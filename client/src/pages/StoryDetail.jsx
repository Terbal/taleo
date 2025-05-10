// client/src/pages/StoryDetail.jsx
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
import { exportAsPDF, exportAsTXT } from "../utils/export";

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState({}); // track which paragraph IDs user voted

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/stories/${id}`)
      .then((res) => setStory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const voteParagraph = async (pid) => {
    await axios.post(`${VITE_API_URL}/api/paragraphs/${pid}/vote`);
    setVoted((prev) => ({ ...prev, [pid]: true }));
    // re-fetch pour mettre à jour votes et approved
    setLoading(true);
    const res = await axios.get(`${VITE_API_URL}/api/stories/${id}`);
    setStory(res.data);
    setLoading(false);
  };

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
      {/* Titre et actions globales */}
      <Grid
        item
        xs={12}
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4">{story.title}</Typography>
        <div>
          <Button onClick={() => exportAsPDF(story)} sx={{ mr: 1 }}>
            Export PDF
          </Button>
          <Button onClick={() => exportAsTXT(story)}>Export TXT</Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" color="textSecondary">
          Thème : {story.theme}
        </Typography>
      </Grid>

      {/* Paragraphes validés */}
      {story.paragraphs.map((p) => (
        <Grid item xs={12} key={p.id}>
          <Card variant="outlined">
            <CardContent>{p.content}</CardContent>
            <Button
              onClick={() => voteParagraph(p.id)}
              disabled={!!voted[p.id]}
            >
              👍 {p.votes || 0}
            </Button>
          </Card>
        </Grid>
      ))}

      {/* Bouton contribution */}
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
