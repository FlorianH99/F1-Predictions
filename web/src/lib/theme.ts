import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#C1121F",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0F4C5C",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F6F7FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#101418",
      secondary: "#4F5B66",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "var(--font-body), system-ui, sans-serif",
    h1: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    h2: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    h3: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    h4: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E2E6EE",
          boxShadow: "0 8px 24px rgba(16, 20, 24, 0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});
