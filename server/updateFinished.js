// server/updateFinished.js
import admin from "firebase-admin";
import { db } from "./firebase.js"; // ton initialisation Firestore

/**
 * Passe en status "finished" toutes les stories dont
 * le nombre de paragraphes validés atteint paragraphMax.
 */
export async function markFinished() {
  const storySnaps = await db.collection("stories").get();

  for (const doc of storySnaps.docs) {
    const s = doc.data();
    if (s.status !== "active") continue;

    // Récupère le nombre de paragraphes validés (voteStage === 1)
    const validatedSnap = await db
      .collection("paragraphs")
      .where("storyId", "==", `stories/${doc.id}`)
      .where("voteStage", "==", 1)
      .get();

    if (validatedSnap.size >= s.paragraphMax) {
      await doc.ref.update({ status: "finished" });
      console.log(`> Story ${doc.id} marked finished`);
    }
  }
}

// Pour pouvoir exécuter ce script en standalone :
if (require.main === module) {
  markFinished()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
