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

const drawerWidth = 252;

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
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography variant="h5" sx={{ lineHeight: 1.1 }}>
          F1 Predictions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          2026 season dashboard
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 1.5 }}>
        {navItems.map((item) => {
          const active = isActiveRoute(pathname, item.href);

          return (
            <ListItem disablePadding key={item.href} sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={active}
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Stack spacing={1.25}>
          <Chip size="small" color="primary" label="Flo admin enabled" />
          <Typography variant="caption" color="text.secondary">
            v1 app shell uses local mock data aligned to the SQL schema.
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
            "radial-gradient(circle at 8% -30%, rgba(193,18,31,0.2), transparent 48%), radial-gradient(circle at 95% 8%, rgba(15,76,92,0.16), transparent 38%)",
        }}
      >
        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(246, 247, 251, 0.86)",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={toggleMobileDrawer}
              sx={{ mr: 2, display: { md: "none" } }}
              aria-label="open navigation"
            >
              <MenuRoundedIcon />
            </IconButton>

            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              F1 Predictions
            </Typography>

            <Chip size="small" color="secondary" label="Season 2026" />
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
                  borderRight: "1px solid",
                  borderColor: "divider",
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
            <Box sx={{ maxWidth: 1160, mx: "auto", pt: 2 }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
