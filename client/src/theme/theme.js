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
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.getContrastText(theme.palette.primary.main),
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
          padding: "0.5rem 1rem",
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[1],
          color: theme.palette.text.primary,
          padding: theme.spacing(2),
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
  },
};

export const light = createTheme({
  ...base,
  palette: {
    mode: "light",
    primary: { main: "#B58969", dark: "#A37352" },
    secondary: { main: "#3E2723" },
    background: { default: "#FAF5EE", paper: "#F5E9DA" },
    text: { primary: "#3E2723", secondary: "#5D4037" },
    divider: "rgba(62,39,35,0.5)",
  },
});

export const dark = createTheme({
  ...base,
  palette: {
    mode: "dark",
    primary: { main: "#D8C3A5", dark: "#C1AD8C" },
    secondary: { main: "#F5E9DA" },
    background: { default: "#1C1C1E", paper: "#2C2C2E" },
    text: { primary: "#FAF5EE", secondary: "#E0C097" },
    divider: "rgba(255,255,255,0.12)",
  },
});

export default light;
