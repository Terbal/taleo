import { db } from "./firebase.js";

async function markFinished() {
  const snaps = await db.collection("stories").get();
  for (const doc of snaps.docs) {
    const s = doc.data();
    if (s.status === "active") {
      // compter les paragraphes
      const paras = await db
        .collection("paragraphs")
        .where("storyId", "==", `stories/${doc.id}`)
        .get();
      if (paras.size >= s.paragraphMax) {
        await doc.ref.update({ status: "finished" });
        console.log(`Story ${doc.id} marked finished`);
      }
    }
  }
  process.exit();
}

markFinished();
