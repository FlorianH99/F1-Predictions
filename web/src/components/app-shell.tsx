"use client";

import { useState } from "react";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import {
  AppBar,
  Box,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { appTheme } from "@/lib/theme";

const drawerWidth = 264;

const navItems = [
  { label: "Home", href: "/", icon: <HomeRoundedIcon /> },
  { label: "Predictions", href: "/predictions", icon: <SpeedRoundedIcon /> },
  { label: "Picks", href: "/picks", icon: <FactCheckRoundedIcon /> },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: <EmojiEventsRoundedIcon />,
  },
  { label: "Calendar", href: "/calendar", icon: <CalendarMonthRoundedIcon /> },
  { label: "Admin", href: "/admin", icon: <ManageAccountsRoundedIcon /> },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setMobileOpen((open) => !open);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(175deg, rgba(14,20,38,0.98) 0%, rgba(20,28,52,0.98) 60%, rgba(13,24,47,0.96) 100%)",
        color: "#F5F7FF",
      }}
    >
      <Box sx={{ px: 2.5, py: 2.25 }}>
        <Typography variant="h4" sx={{ lineHeight: 1, color: "#FFFFFF" }}>
          F1 Predictions
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(245,247,255,0.78)", mt: 0.35 }}>
          2026 race control center
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.16)" }} />

      <List sx={{ px: 1.2, py: 1.5 }}>
        {navItems.map((item) => {
          const active = isActiveRoute(pathname, item.href);

          return (
            <ListItem disablePadding key={item.href} sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={active}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  color: "rgba(245,247,255,0.92)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                  "&.Mui-selected": {
                    background:
                      "linear-gradient(90deg, rgba(225,6,0,0.92) 0%, rgba(253,63,42,0.92) 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 10px 26px rgba(225, 6, 0, 0.35)",
                  },
                  "&.Mui-selected:hover": {
                    background:
                      "linear-gradient(90deg, rgba(225,6,0,0.96) 0%, rgba(253,63,42,0.96) 100%)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Stack spacing={1.25}>
          <Chip
            size="small"
            label="HELL YEAH F1"
            sx={{
              fontWeight: 900,
              alignSelf: "flex-start",
              color: "#FFFFFF",
              borderColor: "rgba(255,255,255,0.32)",
              borderWidth: 1,
              borderStyle: "solid",
              background:
                "linear-gradient(90deg, rgba(225,6,0,0.95), rgba(30,65,255,0.92), rgba(0,161,155,0.92))",
            }}
          />
          <Typography variant="caption" sx={{ color: "rgba(245,247,255,0.72)" }}>
            Predictions, results, standings, and weekend locks.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100dvh",
          background:
            "radial-gradient(circle at 3% -10%, rgba(225,6,0,0.30), transparent 36%), radial-gradient(circle at 97% 8%, rgba(30,65,255,0.24), transparent 42%), radial-gradient(circle at 55% 105%, rgba(0,161,155,0.20), transparent 46%)",
        }}
      >
        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)",
            background:
              "linear-gradient(90deg, rgba(13,20,41,0.92) 0%, rgba(21,29,57,0.90) 55%, rgba(12,27,59,0.88) 100%)",
            color: "#FFFFFF",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={toggleMobileDrawer}
              sx={{ mr: 2, display: { md: "none" }, color: "inherit" }}
              aria-label="open navigation"
            >
              <MenuRoundedIcon />
            </IconButton>

            <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: "#FFFFFF" }}>
              F1 Predictions
            </Typography>

            <Chip
              size="small"
              label="Season 2026"
              sx={{
                fontWeight: 900,
                color: "#FFFFFF",
                borderColor: "rgba(255,255,255,0.28)",
                borderWidth: 1,
                borderStyle: "solid",
                background: "rgba(255,255,255,0.10)",
              }}
            />
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex" }}>
          <Box component="nav" aria-label="app sections">
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={toggleMobileDrawer}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  borderRight: "1px solid rgba(255,255,255,0.12)",
                },
              }}
            >
              {drawerContent}
            </Drawer>

            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", md: "block" },
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  borderRight: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "inset -1px 0 0 rgba(255,255,255,0.08)",
                },
              }}
              open
            >
              <Toolbar />
              {drawerContent}
            </Drawer>
          </Box>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              px: { xs: 2, sm: 3, md: 4 },
              pb: { xs: 3, md: 4 },
              width: { md: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <Toolbar />
            <Box sx={{ maxWidth: 1160, mx: "auto", pt: 2.5 }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
