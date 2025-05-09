import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Grid, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const themes = ["Fantasy", "Mystery", "Sci-Fi", "Horror", "Romance"];

export default function CreateStory() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/createStory`,
      data
    );
    navigate(`/story/${res.data.id}`);
  };

  return (
    <Grid container justifyContent="center" mt={4}>
      <Grid item xs={11} sm={8} md={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Titre"
            {...register("title")}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Thème"
            {...register("theme")}
            margin="normal"
            required
          >
            {themes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Min paragraphe"
                {...register("paragraphMin")}
                margin="normal"
                defaultValue={3}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Max paragraphe"
                {...register("paragraphMax")}
                margin="normal"
                defaultValue={5}
                required
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Créer l'histoire
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}
