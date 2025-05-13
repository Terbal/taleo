// server/schemaSetup.js
import fs from "fs";
import admin from "firebase-admin";
import { db } from "./firebase.js";

async function setupSchema() {
  // 1) USERS
  const userRef = db.collection("users").doc("user-test1");
  await userRef.set({
    username: "Anon-1234",
    permanent: false,
    storiesCreated: 0,
  });

  // 2) STORIES
  const storyRef = db.collection("stories").doc("story-test1");
  await storyRef.set({
    title: "Ma première histoire",
    theme: "Fantasy",
    creatorId: userRef.path,
    visibleCreator: false,
    voteThreshold: 15,
    contributorLimit: 10,
    contributorsCount: 1, // on part de 1 contributeur (le créateur)
    paragraphMin: 3,
    paragraphMax: 5,
    summary: "Une aventure dans un monde inconnu...",
    totalVotes: 0, // 0 votes initialement
    status: "active",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 3) PARAGRAPHS
  const paragraphsData = [
    { id: "para-1", content: "Il était une fois un chevalier sans peur." },
    { id: "para-2", content: "Mais dans son cœur, un doute grandissait." },
  ];
  for (const p of paragraphsData) {
    await db.collection("paragraphs").doc(p.id).set({
      storyId: storyRef.path,
      userId: userRef.path,
      content: p.content,
      voteStage: 0,
      votes: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // 4) VOTES
  for (const p of paragraphsData) {
    const voteId = `vote-${p.id}`;
    await db
      .collection("votes")
      .doc(voteId)
      .set({
        paragraphId: db.collection("paragraphs").doc(p.id).path,
        userId: userRef.path,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  console.log("🎉 Seed complete");
  process.exit(0);
}

setupSchema().catch((err) => {
  console.error(err);
  process.exit(1);
});
