import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import StoryDetail from "../pages/StoryDetail";
import CreateStory from "../pages/CreateStory";
import Contribute from "../pages/Contribute";
import CompletedStories from "../pages/CompletedStories";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/story/:id" element={<StoryDetail />} />
      <Route path="/story/:id/contribute" element={<Contribute />} />
      <Route path="/create" element={<CreateStory />} />
      <Route path="/completed" element={<CompletedStories />} />
    </Routes>
  );
}
