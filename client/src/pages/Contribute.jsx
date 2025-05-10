import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Alert } from "@mui/material";
import axios from "axios";

export default function Contribute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [canContribute, setCanContribute] = useState(true);

  useEffect(() => {
    // Vérifier si limite atteinte
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/stories/${id}`)
      .then((res) => {
        const limit = res.data.contributorLimit || 5;
        const users = res.data.paragraphs.map((p) => p.userId || "anon");
        const unique = new Set(users);
        if (unique.size >= limit && !unique.has("currentUserId")) {
          setCanContribute(false);
        }
      });
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stories/${id}/contribute`,
        { text, userId: "currentUserId" }
      );
      navigate(`/story/${id}`);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Le nombre maximum de contributeurs a été atteint.");
        setCanContribute(false);
      }
    }
  };

  if (!canContribute) {
    return (
      <Alert severity="info" sx={{ m: 4 }}>
        Plus de contributeurs possible pour cette histoire.
      </Alert>
    );
  }

  return (
    <Grid container justifyContent="center" mt={4}>
      <Grid item xs={11} sm={8} md={6}>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Votre paragraphe"
            value={text}
            onChange={(e) => setText(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Soumettre
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}
