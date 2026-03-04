import { Box, Stack, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        px: { xs: 2, sm: 2.5, md: 3 },
        py: { xs: 2, md: 2.5 },
        background:
          "linear-gradient(120deg, rgba(225,6,0,0.12) 0%, rgba(0,161,155,0.10) 55%, rgba(30,65,255,0.09) 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(115deg, transparent 0 14px, rgba(255,255,255,0.18) 14px 16px)",
          opacity: 0.35,
        }}
      />

      <Stack spacing={0.5} sx={{ position: "relative", zIndex: 1 }}>
        <Typography component="h1" variant="h3">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      </Stack>
    </Box>
  );
}
