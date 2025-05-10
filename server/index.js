import express from "express";
import cors from "cors";
import { db } from "./firebase.js";

const app = express();
app.use(cors());
app.use(express.json());

// 1) Récupérer toutes les histoires
app.get("/api/stories", async (req, res) => {
  const snapshot = await db.collection("stories").get();
  const stories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return res.json(stories);
});

// 2) Récupérer une seule histoire + ses paragraphes
app.get("/api/stories/:id", async (req, res) => {
  const { id } = req.params;
  const storySnap = await db.collection("stories").doc(id).get();
  if (!storySnap.exists) {
    return res.status(404).json({ error: "Story not found" });
  }
  const story = { id, ...storySnap.data() };
  const paraSnap = await db
    .collection("paragraphs")
    .where("storyId", "==", `stories/${id}`)
    .get();
  const paragraphs = paraSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return res.json({ ...story, paragraphs });
});

// 3) Créer une nouvelle histoire
app.post("/api/stories", async (req, res) => {
  const {
    title,
    theme,
    paragraphMin,
    paragraphMax,
    voteIntervalHours,
    creatorId,
  } = req.body;
  if (!title || !theme) {
    return res.status(400).json({ error: "title and theme are required" });
  }
  const ref = db.collection("stories").doc();
  await ref.set({
    title,
    theme,
    paragraphMin,
    paragraphMax,
    voteIntervalHours,
    creatorId: creatorId || null,
    createdAt: new Date(),
    status: "active",
  });
  return res.status(201).json({ id: ref.id });
});

// 4) Ajouter un paragraphe de contribution
app.post("/api/stories/:id/contribute", async (req, res) => {
  const { id } = req.params;
  const { text, userId = "anon" } = req.body;

  // 1) Récupérer la story
  const storyRef = db.collection("stories").doc(id);
  const storySnap = await storyRef.get();
  if (!storySnap.exists) {
    return res.status(404).json({ error: "Story not found" });
  }
  const story = storySnap.data();
  const limit = story.contributorLimit || 5;

  // 2) Compter les contributeurs uniques
  const parasSnap = await db
    .collection("paragraphs")
    .where("storyId", "==", `stories/${id}`)
    .get();

  // on suppose que chaque doc paragraphe a un champ userId
  const uniqueUsers = new Set(
    parasSnap.docs.map((d) => d.data().userId || "anon")
  );
  if (!uniqueUsers.has(userId) && uniqueUsers.size >= limit) {
    return res
      .status(403)
      .json({ error: "Limite maximum de contributeurs atteinte" });
  }

  // 3) Créer le paragraphe
  const paraRef = db.collection("paragraphs").doc();
  await paraRef.set({
    storyId: `stories/${id}`,
    userId,
    content: text,
    voteStage: 0,
    votes: 0,
    createdAt: new Date(),
  });

  return res.status(201).json({ id: paraRef.id });
});

// Poster un vote pour un paragraphe
app.post("/api/paragraphs/:pid/vote", async (req, res) => {
  const { pid } = req.params;
  const paraRef = db.collection("paragraphs").doc(pid);
  const snap = await paraRef.get();
  if (!snap.exists) {
    return res.status(404).json({ error: "Paragraph not found" });
  }
  // Incrémenter le compteur votes
  await paraRef.update({
    votes: admin.firestore.FieldValue.increment(1),
  });
  return res.json({ success: true });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
