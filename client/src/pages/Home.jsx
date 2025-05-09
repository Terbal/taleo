// src/pages/Home.jsx
import React from "react";
import { useStories } from "../contexts/StoriesContext";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
  const { stories, loading } = useStories();

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "80vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={4} padding={4}>
      {stories.map((story) => (
        <Grid item xs={12} sm={6} md={4} key={story.id}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {story.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Thème : {story.theme}
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Créée le{" "}
                {new Date(story.createdAt.seconds * 1000).toLocaleDateString()}
              </Typography>
              <Button
                component={RouterLink}
                to={`/story/${story.id}`}
                variant="outlined"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Continuer l’histoire
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          component={RouterLink}
          to="/create"
          variant="contained"
          color="primary"
        >
          + Créer une nouvelle histoire
        </Button>
      </Grid>
    </Grid>
  );
}
