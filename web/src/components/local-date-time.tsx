"use client";

import Typography from "@mui/material/Typography";

import { formatEasternDateTime } from "@/lib/time";

interface LocalDateTimeProps {
  iso: string;
  fallback?: string;
}

export function LocalDateTime({ iso, fallback = "--" }: LocalDateTimeProps) {
  const formatted = iso ? formatEasternDateTime(iso) : fallback;

  return (
    <Typography component="span" variant="body2" suppressHydrationWarning>
      {formatted}
    </Typography>
  );
}
