import { Stack, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <Stack spacing={0.5} sx={{ mb: 3 }}>
      <Typography component="h1" variant="h3">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {subtitle}
      </Typography>
    </Stack>
  );
}
