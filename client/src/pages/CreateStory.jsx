import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Grid, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const themes = ["Fantasy", "Mystery", "Sci-Fi", "Horror", "Romance"];

export default function CreateStory() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      theme: "",
      paragraphMin: 3,
      paragraphMax: 5,
      voteIntervalHours: 12,
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/stories`,
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
            {...register("title", { required: true })}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title && "Le titre est requis"}
          />
          <TextField
            select
            fullWidth
            label="Thème"
            {...register("theme", { required: true })}
            margin="normal"
            defaultValue=""
            error={!!errors.theme}
            helperText={errors.theme && "Le thème est requis"}
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
                {...register("paragraphMin", { valueAsNumber: true, min: 1 })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Max paragraphe"
                {...register("paragraphMax", { valueAsNumber: true, min: 1 })}
                margin="normal"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Intervalle de vote (heures)"
                {...register("voteIntervalHours", {
                  valueAsNumber: true,
                  min: 1,
                })}
                margin="normal"
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
