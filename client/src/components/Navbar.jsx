// client/src/components/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useThemeContext } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { mode, toggleTheme } = useThemeContext();
  const { token, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Anonymous Storyteller
        </Typography>

        <Button color="inherit" component={Link} to="/">
          Accueil
        </Button>

        {token ? (
          <>
            <Button color="inherit" component={Link} to="/create">
              Créer
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Déconnexion
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Connexion
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Inscription
            </Button>
          </>
        )}

        <Button color="inherit" onClick={toggleTheme}>
          {mode === "light" ? "🌙" : "☀️"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
