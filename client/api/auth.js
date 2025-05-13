// client/src/api/auth.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function register(username, password) {
  return axios.post(`${API_URL}/api/auth/register`, { username, password });
}

export async function login(username, password) {
  const res = await axios.post(`${API_URL}/api/auth/login`, {
    username,
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

// Convertit "7d"/"1h"/"30m" en ms
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

// Configure axios
axios.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("jwt");
  const exp = parseInt(localStorage.getItem("jwtExpiresAt") || "0", 10);
  if (!token || Date.now() > exp) {
    localStorage.removeItem("jwt");
    window.location.href = "/login"; // redirige si expiré
    return cfg;
  }
  cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Interceptor pour les 401
axios.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
