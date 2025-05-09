// server/api/getStories.js
import { db } from "../firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  try {
    const snapshot = await db
      .collection("stories")
      .orderBy("createdAt", "desc")
      .get();

    const stories = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let creator = null;
        if (data.visibleCreator && data.creatorId) {
          const creatorSnap = await data.creatorId.get();
          if (creatorSnap.exists) {
            creator = { id: creatorSnap.id, ...creatorSnap.data() };
          }
        }
        return {
          id: doc.id,
          title: data.title,
          theme: data.theme,
          status: data.status,
          paragraphMin: data.paragraphMin,
          paragraphMax: data.paragraphMax,
          voteIntervalHours: data.voteIntervalHours,
          createdAt: data.createdAt,
          creator,
        };
      })
    );

    return res.status(200).json(stories);
  } catch (err) {
    console.error("getStories error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
