// client/src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Les critères de mot de passe
const passwordCriteria = [
  {
    key: "length",
    label: "Au moins 8 caractères",
    test: (pwd) => pwd.length >= 8,
  },
  {
    key: "upper",
    label: "Au moins une majuscule (A–Z)",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    key: "lower",
    label: "Au moins une minuscule (a–z)",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    key: "digit",
    label: "Au moins un chiffre (0–9)",
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    key: "special",
    label: "Au moins un caractère spécial (!@#$…)",
    test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // observe password pour les critères
  const pwd = watch("password", "");
  const confirm = watch("confirm", "");

  // Vérifie que tous les critères passent
  const allOk = passwordCriteria.every((c) => c.test(pwd)) && pwd === confirm;

  // Étape 1 : soumission de l’email
  const onSubmitEmail = async (data) => {
    try {
      setEmailError("");
      // Ici on appelle une route backend /api/auth/check-email
      // qui renverra 200 si l’email est ok pour s’inscrire
      await axios.post(`${API_URL}/api/auth/check-email`, {
        email: data.email,
      });
      setEmail(data.email);
      setStep(2);
    } catch (err) {
      setEmailError(err.response?.data?.error || "Email invalide");
    }
  };

  // Étape 2 : création du compte
  const onSubmitPassword = async (data) => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password: data.password,
      });
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  // Gère l’inscription avec Google (via backend OAuth)
  const handleGoogle = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        {step === 1 ? (
          <>
            <Typography variant="h5" gutterBottom>
              Inscription — Étape 1/2
            </Typography>
            <form onSubmit={handleSubmit(onSubmitEmail)}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email requis",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email invalide",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Adresse e-mail"
                    fullWidth
                    margin="normal"
                    error={!!errors.email || !!emailError}
                    helperText={errors.email?.message || emailError}
                  />
                )}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Vérifier l’email
              </Button>
              <Divider sx={{ my: 3 }}>ou</Divider>
              <Button variant="outlined" fullWidth onClick={handleGoogle}>
                S’inscrire avec Google
              </Button>
            </form>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Inscription — Étape 2/2
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email&nbsp;: <strong>{email}</strong>
            </Typography>
            <form onSubmit={handleSubmit(onSubmitPassword)}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Mot de passe requis" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Mot de passe"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
              <Controller
                name="confirm"
                control={control}
                defaultValue=""
                rules={{
                  required: "Veuillez confirmer",
                  validate: (value) =>
                    value === pwd || "Les mots de passe ne correspondent pas",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Confirmer le mot de passe"
                    fullWidth
                    margin="normal"
                    error={!!errors.confirm}
                    helperText={errors.confirm?.message}
                  />
                )}
              />

              {/* Liste des critères */}
              <List dense>
                {passwordCriteria.map(({ key, label, test }) => {
                  const ok = test(pwd);
                  return (
                    <ListItem key={key}>
                      <ListItemIcon>
                        {ok ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItem>
                  );
                })}
                <ListItem>
                  <ListItemIcon>
                    {pwd === confirm && confirm !== "" ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CloseIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Mots de passe identiques" />
                </ListItem>
              </List>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!allOk}
                sx={{ mt: 2 }}
              >
                Créer mon compte
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
}
