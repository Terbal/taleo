import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf-8")
    )
  ),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export const db = admin.firestore();
