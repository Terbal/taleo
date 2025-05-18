import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import StoryDetail from "../pages/StoryDetail";
import CreateStory from "../pages/CreateStory";
import Contribute from "../pages/Contribute";
import CompletedStories from "../pages/CompletedStories";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/story/:id" element={<StoryDetail />} />
      <Route path="/story/:id/contribute" element={<Contribute />} />
      <Route path="/create" element={<CreateStory />} />
      <Route path="/completed" element={<CompletedStories />} />
    </Routes>
  );
}
