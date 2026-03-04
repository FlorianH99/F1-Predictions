"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";

import { formatEasternDateTime } from "@/lib/time";
import type { Driver, Player, Prediction, RaceWeekend } from "@/lib/types";

interface PicksShellProps {
  source: "supabase" | "mock";
  players: Player[];
  drivers: Driver[];
  raceWeekends: RaceWeekend[];
  predictions: Prediction[];
}

const pickFields: Array<{
  key:
    | "quali_pole_driver_id"
    | "race_p1_driver_id"
    | "race_p2_driver_id"
    | "race_p3_driver_id"
    | "race_p10_driver_id"
    | "sprint_quali_pole_driver_id"
    | "sprint_race_p1_driver_id";
  label: string;
  sprintOnly?: boolean;
}> = [
  { key: "quali_pole_driver_id", label: "Qualifying Pole" },
  { key: "race_p1_driver_id", label: "Race P1" },
  { key: "race_p2_driver_id", label: "Race P2" },
  { key: "race_p3_driver_id", label: "Race P3" },
  { key: "race_p10_driver_id", label: "Race P10" },
  { key: "sprint_quali_pole_driver_id", label: "Sprint Qualifying Pole", sprintOnly: true },
  { key: "sprint_race_p1_driver_id", label: "Sprint Race P1", sprintOnly: true },
];

function getDriverLabel(driverById: Map<string, Driver>, driverId: string | null): string {
  if (!driverId) {
    return "Not set";
  }

  return driverById.get(driverId)?.display_name ?? "Unknown driver";
}

export function PicksShell({ source, players, drivers, raceWeekends, predictions }: PicksShellProps) {
  const sortedWeekends = useMemo(
    () =>
      [...raceWeekends].sort(
        (a, b) => Date.parse(a.lock_at_utc) - Date.parse(b.lock_at_utc),
      ),
    [raceWeekends],
  );

  const defaultPlayerId = players[0]?.id ?? "";
  const defaultWeekendId = sortedWeekends[0]?.id ?? "";

  const [selectedPlayerId, setSelectedPlayerId] = useState(defaultPlayerId);
  const [selectedWeekendId, setSelectedWeekendId] = useState(defaultWeekendId);

  const selectedPlayer = players.find((player) => player.id === selectedPlayerId) ?? players[0];
  const selectedWeekend =
    sortedWeekends.find((weekend) => weekend.id === selectedWeekendId) ?? sortedWeekends[0];

  const driverById = useMemo(
    () => new Map(drivers.map((driver) => [driver.id, driver])),
    [drivers],
  );
  const weekendById = useMemo(
    () => new Map(sortedWeekends.map((weekend) => [weekend.id, weekend])),
    [sortedWeekends],
  );

  if (players.length === 0) {
    return <Alert severity="warning">No players found in `players` table.</Alert>;
  }

  if (sortedWeekends.length === 0) {
    return <Alert severity="warning">No race weekends found in `race_weekends` table.</Alert>;
  }

  if (drivers.length === 0) {
    return <Alert severity="warning">No drivers found in `drivers` table.</Alert>;
  }

  const selectedPrediction = predictions.find(
    (prediction) =>
      prediction.player_id === selectedPlayer.id &&
      prediction.race_weekend_id === selectedWeekend.id,
  );

  const playerPredictions = predictions
    .filter((prediction) => prediction.player_id === selectedPlayer.id)
    .sort(
      (a, b) =>
        Date.parse(weekendById.get(a.race_weekend_id)?.lock_at_utc ?? "0") -
        Date.parse(weekendById.get(b.race_weekend_id)?.lock_at_utc ?? "0"),
    );

  return (
    <Stack spacing={2.5}>
      <Alert severity="info">
        Data source: {source === "supabase" ? "Supabase" : "Local mock fallback"}.
      </Alert>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Player</InputLabel>
            <Select
              value={selectedPlayerId}
              label="Player"
              onChange={(event: SelectChangeEvent) => setSelectedPlayerId(event.target.value)}
            >
              {players.map((player) => (
                <MenuItem key={player.id} value={player.id}>
                  {player.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <FormControl fullWidth>
            <InputLabel>Race Weekend</InputLabel>
            <Select
              value={selectedWeekendId}
              label="Race Weekend"
              onChange={(event: SelectChangeEvent) => setSelectedWeekendId(event.target.value)}
            >
              {sortedWeekends.map((weekend) => (
                <MenuItem key={weekend.id} value={weekend.id}>
                  {`${weekend.name} (${weekend.location})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography variant="h5">Selected Weekend Picks</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={selectedPlayer.name} color="secondary" />
              <Chip label={`Lock (ET): ${formatEasternDateTime(selectedWeekend.lock_at_utc)}`} />
              {selectedWeekend.is_sprint ? <Chip label="Sprint Weekend" color="primary" /> : null}
            </Stack>
          </Stack>

          {!selectedPrediction ? (
            <Alert severity="warning">No picks submitted yet for this player/weekend.</Alert>
          ) : (
            <Grid container spacing={1.5}>
              {pickFields.map((field) => {
                if (field.sprintOnly && !selectedWeekend.is_sprint) {
                  return null;
                }

                return (
                  <Grid key={field.key} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 1.5,
                        height: "100%",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {field.label}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.4, fontWeight: 600 }}>
                        {getDriverLabel(driverById, selectedPrediction[field.key])}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">Submitted Weekends for {selectedPlayer.name}</Typography>
            {playerPredictions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No submitted picks found yet.
              </Typography>
            ) : (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {playerPredictions.map((prediction) => {
                  const weekend = weekendById.get(prediction.race_weekend_id);

                  return (
                    <Chip
                      key={prediction.id}
                      label={weekend?.name ?? prediction.race_weekend_id}
                      variant="outlined"
                    />
                  );
                })}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
