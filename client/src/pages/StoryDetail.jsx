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

  const API_URL = import.meta.env.VITE_API_URL; // <<-- ajout

  // Récupère la story et ses paragraphes
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/stories/${id}`)
      .then((res) => setStory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Fonction de vote
  const voteParagraph = async (pid) => {
    try {
      await axios.post(`${API_URL}/api/paragraphs/${pid}/vote`);
      setVoted((prev) => ({ ...prev, [pid]: true }));
      // Rafraîchit les données
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/stories/${id}`);
      setStory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      {/* Titre et actions */}
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

      {/* Thème + seuil */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" color="textSecondary">
          Thème : {story.theme}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>
          Un paragraphe est validé dès qu’il atteint&nbsp;
          <strong>{story.voteThreshold}</strong>&nbsp;votes.
        </Typography>
      </Grid>

      {/* Paragraphes */}
      {story.paragraphs.map((p) => (
        <Grid item xs={12} key={p.id}>
          <Card variant="outlined">
            <CardContent>{p.content}</CardContent>
            <CardContent>
              {p.voteStage === 1 ? (
                <Typography component="span" color="success.main">
                  Validé ✅ ({p.votes} votes)
                </Typography>
              ) : (
                <Button
                  size="small"
                  onClick={() => voteParagraph(p.id)}
                  disabled={!!voted[p.id]}
                >
                  👍 {p.votes || 0}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Proposer une suite */}
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
