import { Alert, Button, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";

import { PageHeader } from "@/components/page-header";
import {
  getLeaderboardTotals,
  getLockCountdown,
  getSessionCountForWeekend,
  isWeekendLocked,
  results,
} from "@/lib/mock-data";

function formatCountdown(milliseconds: number): string {
  const totalMinutes = Math.max(Math.floor(milliseconds / 60000), 0);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return `${days}d ${hours}h ${minutes}m`;
}

export default function HomePage() {
  const now = new Date();
  const standings = getLeaderboardTotals();
  const { weekend, millisecondsUntilLock } = getLockCountdown(now);

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Race Weekend Center"
        subtitle="Track lock timing, quick standings, and current season status from the 2026 calendar."
      />

      {weekend && millisecondsUntilLock !== null ? (
        <Alert severity={isWeekendLocked(weekend, now) ? "warning" : "info"}>
          {isWeekendLocked(weekend, now)
            ? `Predictions are locked for ${weekend.name}.`
            : `Predictions lock in ${formatCountdown(millisecondsUntilLock)} for ${weekend.name}.`}
        </Alert>
      ) : (
        <Alert severity="success">All race weekends are complete for this season.</Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent>
              <Stack spacing={1.25}>
                <Typography variant="overline" color="text.secondary">
                  Next Race
                </Typography>
                <Typography variant="h4">
                  {weekend?.name ?? "Season Complete"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {weekend
                    ? `${weekend.location} • ${weekend.is_sprint ? "Sprint weekend" : "Standard weekend"}`
                    : "No upcoming race weekend in the current mock schedule."}
                </Typography>

                {weekend ? (
                  <Stack direction="row" spacing={1}>
                    <Chip color="primary" label={`Lock: ${new Date(weekend.lock_at_utc).toUTCString()}`} />
                    <Chip
                      variant="outlined"
                      label={`${getSessionCountForWeekend(weekend.id)} sessions tracked`}
                    />
                  </Stack>
                ) : null}

                <Stack direction="row" spacing={1.25} sx={{ pt: 1 }}>
                  <Button href="/predictions" variant="contained">
                    Open Predictions
                  </Button>
                  <Button href="/calendar" variant="outlined">
                    View Calendar
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Standings Snapshot
              </Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {standings.map((entry, index) => (
                  <Stack
                    key={entry.player_id}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      bgcolor: index === 0 ? "rgba(193,18,31,0.08)" : "transparent",
                    }}
                  >
                    <Typography variant="body1">{`${index + 1}. ${entry.player_name}`}</Typography>
                    <Chip label={`${entry.season_points} pts`} color={index === 0 ? "primary" : "default"} />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Results Coverage
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.75 }}>
                {`${results.length} race weekends have entered results. Use Admin to add results and trigger score recalculation for each completed weekend.`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
