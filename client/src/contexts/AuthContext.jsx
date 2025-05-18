// client/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({ token: null, logout: () => {} });

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const navigate = useNavigate();

  // Ici, on capte le token Google OAuth quand AuthProvider est sous Router
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      localStorage.setItem("jwt", t);
      setToken(t);
      window.history.replaceState({}, document.title, "/");
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
