// server/index.js
import express from "express";
import bodyParser from "body-parser";
import createStory from "./api/createStory.js";
import getStories from "./api/getStories.js";

const app = express();
app.use(bodyParser.json());

app.post("/api/createStory", createStory);
app.get("/api/getStories", getStories);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
