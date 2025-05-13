import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { db } from "./firebase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import { requireAuth } from "./middleware/auth.js"; // <-- importé ici

const app = express(); // <-- déplacé ici

const httpServer = createServer(app);
const io = new IOServer(httpServer, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "ta_clé_secrète";
const JWT_EXPIRES_IN = "7d"; // ou "1h", "30m", etc.

// --- REGISTER ---
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Champs manquants" });

  const hash = await bcrypt.hash(password, 10);
  const userRef = await db.collection("users").add({
    username,
    passwordHash: hash,
  });
  return res.status(201).json({ id: userRef.id });
});

// --- LOGIN ---
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const snap = await db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get();
  if (snap.empty) return res.status(404).json({ error: "Utilisateur inconnu" });

  const userDoc = snap.docs[0];
  const data = userDoc.data();
  const match = await bcrypt.compare(password, data.passwordHash);
  if (!match) return res.status(401).json({ error: "Mot de passe invalide" });

  const token = jwt.sign({ uid: userDoc.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  res.json({ token, expiresIn: JWT_EXPIRES_IN });
});

// Exemple d’utilisation :
app.post("/api/paragraphs/:pid/vote", requireAuth, async (req, res) => {
  // ton code de vote ici, avec req.userId
});

// 1) GET all stories
app.get("/api/stories", async (req, res) => {
  const snaps = await db.collection("stories").get();
  const stories = snaps.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      title: d.title,
      theme: d.theme,
      summary: d.summary,
      contributorLimit: d.contributorLimit,
      contributorsCount: d.contributorsCount,
      totalVotes: d.totalVotes,
      status: d.status,
      createdAt: d.createdAt,
    };
  });
  res.json(stories);
});

// 2) GET one story + paragraphs
app.get("/api/stories/:id", async (req, res) => {
  const { id } = req.params;
  const storyDoc = await db.collection("stories").doc(id).get();
  if (!storyDoc.exists)
    return res.status(404).json({ error: "Story not found" });
  const s = storyDoc.data();
  const story = { id, ...s };

  const paraSnap = await db
    .collection("paragraphs")
    .where("storyId", "==", `stories/${id}`)
    .get();
  story.paragraphs = paraSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  res.json(story);
});

// 3) POST create story
app.post("/api/stories", async (req, res) => {
  const {
    title,
    theme,
    summary,
    contributorLimit,
    paragraphMin,
    paragraphMax,
    voteThreshold,
    creatorId,
  } = req.body;
  if (!title || !theme || !summary || !contributorLimit) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const ref = db.collection("stories").doc();
  await ref.set({
    title,
    theme,
    summary,
    contributorLimit,
    contributorsCount: 1,
    paragraphMin,
    paragraphMax,
    voteThreshold, // ← ajouté
    totalVotes: 0,
    creatorId: creatorId || null,
    status: "active",
    createdAt: new Date(),
  });
  return res.status(201).json({ id: ref.id });
});

// 4) POST contribute
app.post("/api/stories/:id/contribute", async (req, res) => {
  const { id } = req.params;
  const { text, userId = "anon" } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const storyRef = db.collection("stories").doc(id);
  const storySnap = await storyRef.get();
  if (!storySnap.exists)
    return res.status(404).json({ error: "Story not found" });

  const story = storySnap.data();
  const limit = story.contributorLimit;
  const parasSnap = await db
    .collection("paragraphs")
    .where("storyId", "==", `stories/${id}`)
    .get();
  const uniqueUsers = new Set(
    parasSnap.docs.map((d) => d.data().userId || "anon")
  );

  // Si nouvel utilisateur et limite atteinte → 403
  if (!uniqueUsers.has(userId) && uniqueUsers.size >= limit) {
    return res.status(403).json({ error: "Contributor limit reached" });
  }

  // Créer paragraphe
  const paraRef = db.collection("paragraphs").doc();
  await paraRef.set({
    storyId: `stories/${id}`,
    userId,
    content: text,
    voteStage: 0,
    votes: 0,
    createdAt: new Date(),
  });

  // Si nouvel utilisateur, incrémente contributorsCount
  if (!uniqueUsers.has(userId)) {
    await storyRef.update({
      contributorsCount: admin.firestore.FieldValue.increment(1),
    });
  }

  res.status(201).json({ id: paraRef.id });
});

// 5) POST vote
app.post("/api/paragraphs/:pid/vote", requireAuth, async (req, res) => {
  try {
    const { pid } = req.params;
    const uid = req.userId;

    // 1) Référence au paragraphe et au sous-collection votes
    const paraRef = db.collection("paragraphs").doc(pid);
    const voteRef = paraRef.collection("votes").doc(uid);

    // 2) Vérifie si l'utilisateur a déjà voté
    const voteSnap = await voteRef.get();
    if (voteSnap.exists) {
      return res.status(400).json({ error: "Déjà voté" });
    }

    // 3) Enregistre le vote
    await voteRef.set({ createdAt: new Date() });

    // 4) Recompte des votes
    const votesSnap = await paraRef.collection("votes").get();
    const currentVotes = votesSnap.size;

    // 5) Récupère storyId & voteStage du paragraphe
    const paraSnap = await paraRef.get();
    const { storyId, voteStage } = paraSnap.data();

    // 6) Récupère le voteThreshold de la story parente
    const storyDoc = await db.doc(storyId).get();
    const { voteThreshold } = storyDoc.data();

    // 7) Si on atteint le seuil, on valide et on notifie
    if (currentVotes >= voteThreshold && voteStage === 0) {
      await paraRef.update({ voteStage: 1 });
      io.emit("paragraphValidated", {
        pid,
        storyId,
        votes: currentVotes,
      });
    }

    // 8) Notifie tous les clients du nouveau compteur
    io.emit("voteUpdate", { pid, votes: currentVotes });

    // 9) Réponse au client
    return res.json({ success: true, votes: currentVotes });
  } catch (err) {
    console.error("Erreur dans /api/paragraphs/:pid/vote :", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// 404 fallback
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
