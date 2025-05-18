// client/src/api/axiosConfig.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Crée une instance axios configurée
export const api = axios.create({
  baseURL: API_URL,
});

// Intercepte toutes les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré → on déconnecte l’utilisateur
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
