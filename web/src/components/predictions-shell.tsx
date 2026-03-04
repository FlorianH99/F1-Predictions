"use client";

import { useState } from "react";

import {
  Alert,
  Box,
  Button,
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

import {
  drivers,
  getDriversForSeason,
  getNextRaceWeekend,
  isWeekendLocked,
  players,
  predictions,
  raceWeekends,
} from "@/lib/mock-data";

type PredictionFormState = {
  quali_pole_driver_id: string;
  race_p1_driver_id: string;
  race_p2_driver_id: string;
  race_p3_driver_id: string;
  race_p10_driver_id: string;
  sprint_quali_pole_driver_id: string;
  sprint_race_p1_driver_id: string;
};

const fieldDefinitions: Array<{
  key: keyof PredictionFormState;
  label: string;
  sprintOnly?: boolean;
}> = [
  { key: "quali_pole_driver_id", label: "Qualifying Pole" },
  { key: "race_p1_driver_id", label: "Race P1" },
  { key: "race_p2_driver_id", label: "Race P2" },
  { key: "race_p3_driver_id", label: "Race P3" },
  { key: "race_p10_driver_id", label: "Race P10 (2 pts)" },
  {
    key: "sprint_quali_pole_driver_id",
    label: "Sprint Qualifying Pole",
    sprintOnly: true,
  },
  { key: "sprint_race_p1_driver_id", label: "Sprint Race P1", sprintOnly: true },
];

function getFallbackDriverIds(season: number) {
  const seasonDrivers = getDriversForSeason(season);

  return {
    lead: seasonDrivers[0]?.id ?? drivers[0]?.id ?? "",
    alt1: seasonDrivers[1]?.id ?? drivers[1]?.id ?? "",
    alt2: seasonDrivers[2]?.id ?? drivers[2]?.id ?? "",
    alt3: seasonDrivers[3]?.id ?? drivers[3]?.id ?? "",
    alt4: seasonDrivers[4]?.id ?? drivers[4]?.id ?? "",
  };
}

function buildInitialState(playerId: string, weekendId: string): PredictionFormState {
  const weekend = raceWeekends.find((item) => item.id === weekendId);
  const season = weekend?.season ?? 2026;

  const existing = predictions.find(
    (item) => item.player_id === playerId && item.race_weekend_id === weekendId,
  );

  const fallback = getFallbackDriverIds(season);

  return {
    quali_pole_driver_id: existing?.quali_pole_driver_id ?? fallback.lead,
    race_p1_driver_id: existing?.race_p1_driver_id ?? fallback.lead,
    race_p2_driver_id: existing?.race_p2_driver_id ?? fallback.alt1,
    race_p3_driver_id: existing?.race_p3_driver_id ?? fallback.alt2,
    race_p10_driver_id: existing?.race_p10_driver_id ?? fallback.alt3,
    sprint_quali_pole_driver_id: existing?.sprint_quali_pole_driver_id ?? fallback.alt2,
    sprint_race_p1_driver_id: existing?.sprint_race_p1_driver_id ?? fallback.alt4,
  };
}

function DriverSelect({
  label,
  value,
  onChange,
  season,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  season: number;
}) {
  const driverOptions = getDriversForSeason(season);

  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
      >
        {driverOptions.map((driver) => (
          <MenuItem value={driver.id} key={driver.id}>
            {`${driver.display_name} (${driver.team_name})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function PredictionsShell() {
  const firstUpcoming = getNextRaceWeekend();
  const defaultPlayerId = players[0]?.id ?? "";
  const defaultWeekendId = firstUpcoming?.id ?? raceWeekends[0]?.id ?? "";

  const [selectedPlayerId, setSelectedPlayerId] = useState(defaultPlayerId);
  const [selectedWeekendId, setSelectedWeekendId] = useState(defaultWeekendId);
  const [formState, setFormState] = useState<PredictionFormState>(() =>
    buildInitialState(defaultPlayerId, defaultWeekendId),
  );

  const selectedWeekend =
    raceWeekends.find((weekend) => weekend.id === selectedWeekendId) ?? raceWeekends[0];

  if (!selectedWeekend) {
    return (
      <Alert severity="warning">
        No race weekends found. Seed race weekends before using the predictions form.
      </Alert>
    );
  }

  const locked = isWeekendLocked(selectedWeekend);

  const handlePlayerChange = (event: SelectChangeEvent) => {
    const nextPlayerId = event.target.value;

    setSelectedPlayerId(nextPlayerId);
    setFormState(buildInitialState(nextPlayerId, selectedWeekendId));
  };

  const handleWeekendChange = (event: SelectChangeEvent) => {
    const nextWeekendId = event.target.value;

    setSelectedWeekendId(nextWeekendId);
    setFormState(buildInitialState(selectedPlayerId, nextWeekendId));
  };

  return (
    <Stack spacing={2.5}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Player</InputLabel>
            <Select value={selectedPlayerId} label="Player" onChange={handlePlayerChange}>
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
            <Select value={selectedWeekendId} label="Race Weekend" onChange={handleWeekendChange}>
              {raceWeekends.map((weekend) => (
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
            <Typography variant="h5">Prediction Form</Typography>
            <Typography color="text.secondary">
              Predictions lock at the start of the first prediction-relevant session.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                color={locked ? "warning" : "success"}
                label={locked ? "Locked" : "Open"}
              />
              <Chip label={`Lock: ${new Date(selectedWeekend.lock_at_utc).toUTCString()}`} />
              {selectedWeekend.is_sprint && <Chip color="secondary" label="Sprint Weekend" />}
            </Stack>
          </Stack>

          <Grid container spacing={1.5}>
            {fieldDefinitions.map((field) => {
              if (field.sprintOnly && !selectedWeekend.is_sprint) {
                return null;
              }

              return (
                <Grid size={{ xs: 12, md: 6 }} key={field.key}>
                  <DriverSelect
                    label={field.label}
                    value={formState[field.key]}
                    onChange={(value) =>
                      setFormState((previous) => ({
                        ...previous,
                        [field.key]: value,
                      }))
                    }
                    season={selectedWeekend.season}
                  />
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ mt: 2.5 }}>
            <Button disabled={locked} variant="contained">
              Save Prediction (UI Shell)
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
