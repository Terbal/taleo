import * as functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const scheduledVoteProcessing = functions.pubsub
  .schedule("every 1 hours") // Exécution toutes les heures
  .onRun(async () => {
    const now = Date.now();

    const storiesSnap = await db
      .collection("stories")
      .where("status", "==", "active")
      .get();

    for (const doc of storiesSnap.docs) {
      const s = doc.data();
      const storyId = doc.id;

      const lastTs =
        s.lastVoteProcessedAt?.toMillis?.() || s.createdAt.toMillis?.();
      const hoursSince = (now - lastTs) / (1000 * 60 * 60);

      if (hoursSince < s.voteIntervalHours) continue;

      const paraSnap = await db
        .collection("paragraphs")
        .where("storyId", "==", `stories/${storyId}`)
        .where("voteStage", "==", 0)
        .get();

      if (paraSnap.empty) continue;

      let best = null,
        max = -1;
      paraSnap.docs.forEach((d) => {
        const v = d.data().votes || 0;
        if (v > max) {
          best = d;
          max = v;
        }
      });

      if (!best) continue;

      await best.ref.update({ voteStage: 1 });

      await doc.ref.update({
        lastVoteProcessedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✓ Story ${storyId}: para ${best.id} accepted`);
    }

    return null;
  });
