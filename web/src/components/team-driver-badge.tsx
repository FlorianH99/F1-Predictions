import { Box, Typography } from "@mui/material";

import { getDriverTeamColorToken } from "@/lib/team-colors";
import type { Driver } from "@/lib/types";

interface TeamDriverBadgeProps {
  driver: Driver | null | undefined;
  fallbackLabel?: string;
  showTeamName?: boolean;
  compact?: boolean;
}

export function TeamDriverBadge({
  driver,
  fallbackLabel = "Unknown driver",
  showTeamName = false,
  compact = false,
}: TeamDriverBadgeProps) {
  const token = getDriverTeamColorToken(driver);
  const label = driver?.display_name ?? fallbackLabel;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.8,
        px: compact ? 1 : 1.25,
        py: compact ? 0.35 : 0.5,
        borderRadius: 999,
        border: "1px solid",
        borderColor: token.border,
        background: `linear-gradient(135deg, ${token.primary}, ${token.accent})`,
        color: token.text,
        minHeight: compact ? 26 : 30,
      }}
    >
      <Typography sx={{ fontSize: compact ? 12 : 13, fontWeight: 800, lineHeight: 1 }}>
        {label}
      </Typography>
      {showTeamName && driver ? (
        <Typography sx={{ fontSize: compact ? 10 : 11, fontWeight: 700, opacity: 0.88, lineHeight: 1 }}>
          {driver.team_name}
        </Typography>
      ) : null}
    </Box>
  );
}
