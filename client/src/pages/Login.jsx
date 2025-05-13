// client/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      nav("/");
    } catch {
      alert("Échec de la connexion");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Utilisateur"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button>Se connecter</button>
    </form>
  );
}
