import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, TextField, Button } from "@mui/material";
import axios from "axios";

export default function Contribute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState(""); // controlled input

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/stories/${id}/contribute`,
      { text }
    );
    navigate(`/story/${id}`);
  };

  return (
    <Grid container justifyContent="center" mt={4}>
      <Grid item xs={11} sm={8} md={6}>
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
