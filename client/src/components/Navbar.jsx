import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useThemeContext } from "../contexts/ThemeContext"; // 👈 chemin relatif

export default function Navbar() {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Anonymous Storyteller
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Accueil
        </Button>
        <Button color="inherit" component={Link} to="/create">
          Créer
        </Button>
        <Button color="inherit" component={Link} to="/completed">
          Terminées
        </Button>
        <Button color="inherit" onClick={toggleTheme}>
          {mode === "light" ? "🌙" : "☀️"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
