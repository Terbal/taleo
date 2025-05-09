// server/schemaSetup.js
import fs from "fs";
import admin from "firebase-admin";
import { db } from "./firebase.js"; // importe ton firebase.js existant

async function setupSchema() {
  // 1) COLLECTION "users"
  const userRef = db.collection("users").doc("user-test1");
  await userRef.set({
    username: "Anon-1234",
    permanent: false,
    storiesCreated: 0,
  });
  console.log("✅ users collection ready");

  // 2) COLLECTION "stories"
  const storyRef = db.collection("stories").doc("story-test1");
  await storyRef.set({
    title: "Ma première histoire",
    theme: "Fantasy",
    creatorId: userRef, // référence vers users/user-test1
    visibleCreator: false,
    voteIntervalHours: 12,
    paragraphMin: 3,
    paragraphMax: 5,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("✅ stories collection ready");

  // 3) COLLECTION "paragraphs"
  const paragraphsData = [
    {
      id: "para-1",
      content: "Il était une fois un chevalier sans peur.",
      voteStage: 0,
    },
    {
      id: "para-2",
      content: "Mais dans son cœur, un doute grandissait.",
      voteStage: 0,
    },
  ];
  for (const p of paragraphsData) {
    await db.collection("paragraphs").doc(p.id).set({
      storyId: storyRef, // référence vers stories/story-test1
      userId: userRef, // référence vers users/user-test1
      content: p.content,
      voteStage: p.voteStage,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  console.log("✅ paragraphs collection ready");

  // 4) COLLECTION "votes"
  for (const p of paragraphsData) {
    const voteId = `vote-${p.id}`;
    await db
      .collection("votes")
      .doc(voteId)
      .set({
        paragraphId: db.collection("paragraphs").doc(p.id),
        userId: userRef,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  }
  console.log("✅ votes collection ready");

  console.log("🎉 All Firestore collections & sample documents created.");
  process.exit(0);
}

setupSchema().catch((err) => {
  console.error("❌ Error setting up schema:", err);
  process.exit(1);
});
