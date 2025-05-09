import express from "express";
import cors from "cors";
import { db } from "./firebase.js"; // Importez db depuis firebase.js

const app = express();

// Middleware essentiel
app.use(cors());
app.use(express.json());

// Route de test minimaliste
app.get("/api/stories", async (req, res) => {
  try {
    const snapshot = await db.collection("stories").get();
    const stories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Gestion des erreurs
app.use((req, res) => {
  res.status(404).send("Route not found");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
