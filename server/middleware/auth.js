// server/middleware/auth.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "une_clé_top_secrète";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization?.split(" ");
  if (!auth || auth[0] !== "Bearer")
    return res.status(401).json({ error: "Token manquant" });

  try {
    const payload = jwt.verify(auth[1], JWT_SECRET);
    req.userId = payload.uid;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
}
