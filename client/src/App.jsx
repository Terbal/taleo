import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { StoriesProvider } from "./contexts/StoriesContext";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StoriesProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StoriesProvider>
    </ThemeProvider>
  );
}

export default App;
