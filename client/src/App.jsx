// client/src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { StoriesProvider } from "./contexts/StoriesContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import OAuthHandler from "./components/OAuthHandler";

export default function App() {
  return (
    <ThemeProvider>
      <StoriesProvider>
        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <OAuthHandler /> {/* Gère useNavigate ici */}
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </StoriesProvider>
    </ThemeProvider>
  );
}
