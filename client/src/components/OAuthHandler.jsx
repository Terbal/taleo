// client/src/components/OAuthHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwt", token);
      // Optionnel : stocke expiration si tu l’envoies
      window.history.replaceState({}, document.title, "/");
      navigate("/");
    }
  }, [navigate]);

  return null;
}
