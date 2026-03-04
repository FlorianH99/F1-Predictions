import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { PageHeader } from "@/components/page-header";
import { getLeaderboardTotals, getPerRacePoints } from "@/lib/mock-data";

export default function LeaderboardPage() {
  const totals = getLeaderboardTotals();
  const perRace = getPerRacePoints();

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Leaderboard"
        subtitle="Season standings and per-race scoring breakdown based on score_entries."
      />

      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1.5 }}>
            Season Standings
          </Typography>

          <Table size="small" aria-label="season leaderboard">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Player</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {totals.map((entry, index) => (
                <TableRow key={entry.player_id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.player_name}</TableCell>
                  <TableCell align="right">
                    <Chip
                      color={index === 0 ? "primary" : "default"}
                      label={`${entry.season_points} pts`}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Stack spacing={1.2}>
        <Typography variant="h5">Per-Race Points</Typography>
        {perRace.map((race) => (
          <Accordion key={race.race_weekend_id} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <Typography variant="subtitle1">{race.race_name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small" aria-label={`${race.race_name} points`}>
                <TableHead>
                  <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell align="right">Points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {race.entries.map((entry) => (
                    <TableRow key={entry.player_id} hover>
                      <TableCell>{entry.player_name}</TableCell>
                      <TableCell align="right">{entry.total_points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Stack>
  );
}
