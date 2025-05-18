// client/src/api/auth.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Inscription : on envoie email et password
export async function register(email, password) {
  return axios.post(`${API_URL}/api/auth/register`, { email, password });
}

// Connexion : on envoie email et password
export async function login(email, password) {
  const res = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password,
  });
  const { token, expiresIn } = res.data;
  localStorage.setItem("jwt", token);
  localStorage.setItem(
    "jwtExpiresAt",
    String(Date.now() + parseExpiry(expiresIn))
  );

  return res;
}

// Convertit "7d"/"1h"/"30m" en millisecondes
function parseExpiry(str) {
  const unit = str.slice(-1);
  const num = parseInt(str.slice(0, -1), 10);
  switch (unit) {
    case "d":
      return num * 24 * 60 * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "m":
      return num * 60 * 1000;
    default:
      return 0;
  }
}

// Configure axios pour inclure le JWT et gérer les erreurs
axios.interceptors.request.use((cfg) => {
  // Ne pas ajouter le token pour les routes d'authent
  if (cfg.url?.includes("/api/auth/")) {
    return cfg;
  }

  const token = localStorage.getItem("jwt");
  const exp = parseInt(localStorage.getItem("jwtExpiresAt") || "0", 10);
  if (!token || Date.now() > exp) {
    localStorage.removeItem("jwt");
    return cfg;
  }
  cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
