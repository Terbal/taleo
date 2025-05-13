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
      contributorLimit: 3,
      summary: "",
      voteThreshold: 15, // <-- nouveau champ
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Note : votre backend doit maintenant accepter "voteThreshold" au lieu de voteIntervalHours
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
          {/* Titre */}
          <TextField
            fullWidth
            label="Titre"
            {...register("title", { required: true })}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title && "Le titre est requis"}
          />

          {/* Thème */}
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

          {/* Limite de contributeurs */}
          <TextField
            fullWidth
            type="number"
            label="Nombre de contributeurs souhaité (max 10)"
            {...register("contributorLimit", {
              valueAsNumber: true,
              required: true,
              min: 1,
              max: 10,
            })}
            margin="normal"
            error={!!errors.contributorLimit}
            helperText={
              errors.contributorLimit && "Spécifiez un nombre entre 1 et 10"
            }
          />

          {/* Résumé */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Résumé ou direction de l’histoire"
            {...register("summary", { required: true })}
            margin="normal"
            error={!!errors.summary}
            helperText={errors.summary && "Le résumé est requis"}
          />

          {/* Min/Max paragraphe */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Min paragraphe"
                {...register("paragraphMin", {
                  valueAsNumber: true,
                  min: 1,
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Max paragraphe"
                {...register("paragraphMax", {
                  valueAsNumber: true,
                  min: 1,
                })}
                margin="normal"
              />
            </Grid>
          </Grid>

          {/* Seuil de votes pour valider un paragraphe */}
          <TextField
            fullWidth
            type="number"
            label="Seuil de votes pour valider un paragraphe"
            {...register("voteThreshold", {
              valueAsNumber: true,
              required: true,
              min: 1,
            })}
            margin="normal"
            error={!!errors.voteThreshold}
            helperText={
              errors.voteThreshold && "Indiquez un nombre de votes valide"
            }
          />

          {/* Bouton */}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Créer l'histoire
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}
