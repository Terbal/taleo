// client/src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { StoriesProvider } from "./contexts/StoriesContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // ← TON provider
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <ThemeProvider>
      {" "}
      {/* Utilise TON ThemeProvider */}
      <StoriesProvider>
        <BrowserRouter>
          <Navbar />
          <AppRoutes />
        </BrowserRouter>
      </StoriesProvider>
    </ThemeProvider>
  );
}
