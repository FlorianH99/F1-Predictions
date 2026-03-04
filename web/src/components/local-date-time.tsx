"use client";

import Typography from "@mui/material/Typography";

interface LocalDateTimeProps {
  iso: string;
  fallback?: string;
}

export function LocalDateTime({ iso, fallback = "--" }: LocalDateTimeProps) {
  const formatted =
    typeof window === "undefined"
      ? fallback
      : new Intl.DateTimeFormat(undefined, {
          weekday: "short",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }).format(new Date(iso));

  return (
    <Typography component="span" variant="body2" suppressHydrationWarning>
      {formatted}
    </Typography>
  );
}
