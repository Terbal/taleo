// client/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { login } from "../../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Connexion
        </Typography>

        {error && (
          <Box mb={2}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Adresse e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Se connecter
          </Button>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Pas encore de compte ?&nbsp;
              <Button component={RouterLink} to="/register">
                Inscription
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
