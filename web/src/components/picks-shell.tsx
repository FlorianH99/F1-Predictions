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
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.name.localeCompare(b.name)),
    [players],
  );
  const sortedWeekends = useMemo(
    () =>
      [...raceWeekends].sort(
        (a, b) => Date.parse(a.lock_at_utc) - Date.parse(b.lock_at_utc),
      ),
    [raceWeekends],
  );

  const [selectedWeekendId, setSelectedWeekendId] = useState(sortedWeekends[0]?.id ?? "");
  const selectedWeekend =
    sortedWeekends.find((weekend) => weekend.id === selectedWeekendId) ?? sortedWeekends[0] ?? null;

  const driverById = useMemo(
    () => new Map(drivers.map((driver) => [driver.id, driver])),
    [drivers],
  );

  if (sortedPlayers.length === 0) {
    return <Alert severity="warning">No players found in `players` table.</Alert>;
  }

  if (!selectedWeekend) {
    return <Alert severity="warning">No race weekends found in `race_weekends` table.</Alert>;
  }

  if (drivers.length === 0) {
    return <Alert severity="warning">No drivers found in `drivers` table.</Alert>;
  }

  const predictionsByPlayer = new Map<string, Prediction>();
  for (const prediction of predictions) {
    if (prediction.race_weekend_id !== selectedWeekend.id) {
      continue;
    }

    predictionsByPlayer.set(prediction.player_id, prediction);
  }

  const submittedCount = sortedPlayers.reduce((count, player) => {
    return count + (predictionsByPlayer.has(player.id) ? 1 : 0);
  }, 0);

  return (
    <Stack spacing={2.5}>
      <Alert severity="info">
        Data source: {source === "supabase" ? "Supabase" : "Local mock fallback"}.
      </Alert>

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

      <Card>
        <CardContent>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography variant="h5">All Player Picks</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`Lock (ET): ${formatEasternDateTime(selectedWeekend.lock_at_utc)}`} />
              {selectedWeekend.is_sprint ? <Chip label="Sprint Weekend" color="primary" /> : null}
              <Chip label={`Submitted: ${submittedCount}/${sortedPlayers.length}`} color="secondary" />
            </Stack>
          </Stack>

          <Grid container spacing={2}>
            {sortedPlayers.map((player) => {
              const prediction = predictionsByPlayer.get(player.id);

              return (
                <Grid key={player.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                      height: "100%",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ mb: prediction ? 1.5 : 0 }}
                    >
                      <Chip label={player.name} color="secondary" />
                      <Chip
                        label={prediction ? "Submitted" : "Missing"}
                        color={prediction ? "success" : "default"}
                        variant={prediction ? "filled" : "outlined"}
                      />
                    </Stack>

                    {!prediction ? (
                      <Typography variant="body2" color="text.secondary">
                        No picks submitted yet for this weekend.
                      </Typography>
                    ) : (
                      <Grid container spacing={1.25}>
                        {pickFields.map((field) => {
                          if (field.sprintOnly && !selectedWeekend.is_sprint) {
                            return null;
                          }

                          return (
                            <Grid key={`${player.id}-${field.key}`} size={{ xs: 12, sm: 6 }}>
                              <Box
                                sx={{
                                  border: "1px solid",
                                  borderColor: "divider",
                                  borderRadius: 2,
                                  p: 1.25,
                                  height: "100%",
                                }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  {field.label}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.4, fontWeight: 600 }}>
                                  {getDriverLabel(driverById, prediction[field.key])}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}
