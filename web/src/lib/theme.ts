import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#E10600",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00A19B",
      contrastText: "#041A1E",
    },
    success: {
      main: "#2AB673",
    },
    warning: {
      main: "#F4B000",
    },
    background: {
      default: "#EEF2FF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0C1020",
      secondary: "#465069",
    },
    divider: "#D6DCEC",
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "var(--font-body), sans-serif",
    h1: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontWeight: 700,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontWeight: 700,
      letterSpacing: 0.35,
      textTransform: "uppercase",
    },
    h3: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontWeight: 700,
      letterSpacing: 0.3,
      textTransform: "uppercase",
    },
    h4: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontWeight: 700,
      letterSpacing: 0.25,
      textTransform: "uppercase",
    },
    h5: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontWeight: 700,
      letterSpacing: 0.2,
      textTransform: "uppercase",
    },
    button: {
      textTransform: "uppercase",
      fontWeight: 800,
      letterSpacing: 0.5,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #D6DCEC",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(244,248,255,0.94) 100%)",
          boxShadow: "0 14px 34px rgba(22, 34, 66, 0.10)",
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          letterSpacing: 0.2,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: "rgba(225, 6, 0, 0.08)",
        },
      },
    },
  },
});
