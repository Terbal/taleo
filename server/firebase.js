// server/firebase.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

let serviceAccount;

if (process.env.SERVICE_ACCOUNT_JSON) {
  // Si la variable est définie, on la parse (prod sur Render)
  try {
    serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.error("❌ SERVICE_ACCOUNT_JSON invalide :", err);
    process.exit(1);
  }
} else {
  // Sinon, on lit le fichier local (dev)
  const localPath = path.resolve(process.cwd(), "serviceAccountKey.json");
  if (!fs.existsSync(localPath)) {
    console.error("❌ Fichier local serviceAccountKey.json introuvable");
    process.exit(1);
  }
  serviceAccount = JSON.parse(fs.readFileSync(localPath, "utf-8"));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
