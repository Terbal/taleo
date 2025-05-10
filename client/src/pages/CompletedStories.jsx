import React, { useEffect, useState } from "react";
import { getStories } from "../../api/stories";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function CompletedStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStories()
      .then((all) => {
        // on considère qu'une histoire terminée a status === 'finished'
        setStories(all.filter((s) => s.status === "finished"));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "60vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  if (!stories.length) {
    return (
      <Typography p={4}>Aucune histoire terminée pour l’instant.</Typography>
    );
  }

  return (
    <Grid container spacing={4} padding={4}>
      {stories.map((s) => (
        <Grid item xs={12} sm={6} md={4} key={s.id}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">{s.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Thème : {s.theme}
              </Typography>
              <Button component={Link} to={`/story/${s.id}`} sx={{ mt: 2 }}>
                Lire complète
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
