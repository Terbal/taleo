import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/stories/${id}`)
      .then((res) => setStory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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
  if (!story) {
    return <Typography>Histoire introuvable.</Typography>;
  }

  return (
    <Grid container spacing={2} p={2}>
      <Grid item xs={12}>
        <Typography variant="h4">{story.title}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Thème : {story.theme}
        </Typography>
      </Grid>

      {story.paragraphs.map((p) => (
        <Grid item xs={12} key={p.id}>
          <Card variant="outlined">
            <CardContent>{p.content}</CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button
          component={Link}
          to={`/story/${id}/contribute`}
          variant="outlined"
        >
          Proposer une suite
        </Button>
      </Grid>
    </Grid>
  );
}
