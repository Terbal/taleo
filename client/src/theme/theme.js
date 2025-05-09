// client/src/theme/theme.js
import { createTheme } from "@mui/material/styles";

const base = {
  typography: {
    fontFamily: '"Merriweather", serif',
    h1: { fontSize: "2.25rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: { borderRadius: 8 }, // un peu plus doux que le standard brutaliste
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(62, 39, 35, 0.8)",
          backgroundColor: "rgba(216, 195, 165, 0.9)",
          color: "#3E2723",
          "&:hover": {
            backgroundColor: "rgba(216, 195, 165, 1)",
          },
          padding: "0.5rem 1rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#F5E9DA",
          border: "1px solid #B58969",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
          padding: "1rem",
        },
      },
    },
  },
};

export const light = createTheme({
  ...base,
  palette: {
    mode: "light",
    primary: { main: "#B58969" }, // brun sépia
    secondary: { main: "#3E2723" }, // marron foncé
    background: { default: "#FAF5EE", paper: "#F5E9DA" },
    text: { primary: "#3E2723", secondary: "#5D4037" },
  },
});

export const dark = createTheme({
  ...base,
  palette: {
    mode: "dark",
    primary: { main: "#D8C3A5" }, // beige foncé
    secondary: { main: "#3E2723" },
    background: { default: "#3E2723", paper: "#5D4037" },
    text: { primary: "#FAF5EE", secondary: "#E0C097" },
  },
});

export default light;
