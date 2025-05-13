// server/index.js (ou server/auth.js importé dans index.js)
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "une_clé_top_secrète";

// Inscription
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Champs manquants" });

  const hash = await bcrypt.hash(password, 10);
  const userRef = await db.collection("users").add({
    username,
    passwordHash: hash,
  });
  return res.status(201).json({ id: userRef.id });
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const snap = await db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get();
  if (snap.empty) return res.status(404).json({ error: "Utilisateur inconnu" });

  const userDoc = snap.docs[0];
  const { passwordHash } = userDoc.data();
  const match = await bcrypt.compare(password, passwordHash);
  if (!match) return res.status(401).json({ error: "Mot de passe invalide" });

  const token = jwt.sign({ uid: userDoc.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});
