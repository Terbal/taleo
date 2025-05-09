// server/api/createStory.js
import admin from "firebase-admin";
import { db } from "../firebase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const {
    title,
    theme,
    creatorId,
    visibleCreator = false,
    paragraphMin = 3,
    paragraphMax = 5,
    voteIntervalHours = 12,
  } = req.body;

  if (!title || !theme || !creatorId) {
    return res
      .status(400)
      .json({ error: "title, theme and creatorId are required" });
  }

  try {
    const newStoryRef = db.collection("stories").doc();
    await newStoryRef.set({
      title,
      theme,
      creatorId: db.doc(`users/${creatorId}`),
      visibleCreator,
      paragraphMin,
      paragraphMax,
      voteIntervalHours,
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ id: newStoryRef.id });
  } catch (err) {
    console.error("createStory error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
