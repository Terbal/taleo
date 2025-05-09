import express from "express";
import cors from "cors";
import { db } from "./firebase.js";

const app = express();
app.use(cors());
app.use(express.json());

// 1) GET all stories
app.get("/api/stories", async (req, res) => {
  const snapshot = await db.collection("stories").get();
  const stories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(stories);
});

// 2) GET one story by ID
app.get("/api/stories/:id", async (req, res) => {
  const { id } = req.params;
  const doc = await db.collection("stories").doc(id).get();
  if (!doc.exists) return res.status(404).json({ error: "Story not found" });

  const data = doc.data();
  // load paragraphs for this story
  const parasSnap = await db
    .collection("paragraphs")
    .where("storyId", "==", `stories/${id}`)
    .get();
  const paragraphs = parasSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // load pending contributions (example if you have a 'pending' flag)
  // ... ou simplement renvoyer tous les paragraphs, selon ton schéma

  res.json({ id, ...data, paragraphs });
});

// 3) POST create a new story
app.post("/api/stories", async (req, res) => {
  const { title, theme, paragraphMin, paragraphMax, voteIntervalHours } =
    req.body;
  if (!title || !theme)
    return res.status(400).json({ error: "Missing fields" });

  const ref = db.collection("stories").doc();
  await ref.set({
    title,
    theme,
    paragraphMin,
    paragraphMax,
    voteIntervalHours,
    createdAt: new Date(),
    status: "active",
    creatorId: req.body.creatorId || null,
  });
  res.status(201).json({ id: ref.id });
});

// 4) POST contribute a paragraph
app.post("/api/stories/:id/contribute", async (req, res) => {
  const { id } = req.params;
  const { text, userId } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const storyDoc = db.collection("stories").doc(id);
  const storySnap = await storyDoc.get();
  if (!storySnap.exists)
    return res.status(404).json({ error: "Story not found" });

  const paraRef = db.collection("paragraphs").doc();
  await paraRef.set({
    storyId: `stories/${id}`,
    userId: userId || null,
    content: text,
    voteStage: 0,
    createdAt: new Date(),
  });
  res.status(201).json({ id: paraRef.id });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
