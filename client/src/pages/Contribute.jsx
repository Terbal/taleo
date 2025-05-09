import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Grid } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Contribute() {
  const { id } = useParams();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/stories/${id}/contribute`,
      { text: data.text }
    );
    navigate(`/story/${id}`);
  };

  return (
    <Grid container justifyContent="center" mt={4}>
      <Grid item xs={11} sm={8} md={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Votre paragraphe"
            {...register("text")}
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
