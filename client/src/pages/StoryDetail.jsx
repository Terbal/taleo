import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Grid, Typography, Card, CardContent, Button } from "@mui/material";

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getStory?id=${id}`)
      .then((res) => setStory(res.data))
      .catch(console.error);
  }, [id]);

  if (!story) return <Typography>Chargement...</Typography>;

  return (
    <Grid container spacing={2} p={2}>
      <Grid item xs={12}>
        <Typography variant="h4">{story.title}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Thème: {story.theme}
        </Typography>
      </Grid>
      {story.paragraphs.map((p, i) => (
        <Grid item xs={12} key={i}>
          <Card variant="outlined">
            <CardContent>{p.text}</CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button component={Link} to={`/story/${id}/contrib`} variant="outlined">
          Proposer une suite
        </Button>
      </Grid>
    </Grid>
  );
}
