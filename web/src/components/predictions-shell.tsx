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
import { useRouter } from "next/navigation";

import { getNextRaceWeekend, isWeekendLocked } from "@/lib/derived";
import { formatEasternDateTime } from "@/lib/time";
import type { Driver, Player, Prediction, RaceWeekend } from "@/lib/types";

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

interface PredictionsShellProps {
  source: "supabase" | "mock";
  players: Player[];
  drivers: Driver[];
  raceWeekends: RaceWeekend[];
  predictions: Prediction[];
}

function getDriversForSeason(drivers: Driver[], season: number): Driver[] {
  return drivers
    .filter((driver) => driver.season === season && driver.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

function getFallbackDriverIds(drivers: Driver[], season: number) {
  const seasonDrivers = getDriversForSeason(drivers, season);

  return {
    lead: seasonDrivers[0]?.id ?? "",
    alt1: seasonDrivers[1]?.id ?? "",
    alt2: seasonDrivers[2]?.id ?? "",
    alt3: seasonDrivers[3]?.id ?? "",
    alt4: seasonDrivers[4]?.id ?? "",
  };
}

function buildInitialState(
  playerId: string,
  weekendId: string,
  raceWeekends: RaceWeekend[],
  predictions: Prediction[],
  drivers: Driver[],
): PredictionFormState {
  const weekend = raceWeekends.find((item) => item.id === weekendId);
  const season = weekend?.season ?? 2026;

  const existing = predictions.find(
    (item) => item.player_id === playerId && item.race_weekend_id === weekendId,
  );

  const fallback = getFallbackDriverIds(drivers, season);

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
  drivers,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  season: number;
  drivers: Driver[];
}) {
  const driverOptions = getDriversForSeason(drivers, season);

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

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };

    return body.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export function PredictionsShell({
  source,
  players,
  drivers,
  raceWeekends,
  predictions,
}: PredictionsShellProps) {
  const router = useRouter();
  const firstUpcoming = getNextRaceWeekend(raceWeekends);
  const defaultPlayerId = players[0]?.id ?? "";
  const defaultWeekendId = firstUpcoming?.id ?? raceWeekends[0]?.id ?? "";

  const [selectedPlayerId, setSelectedPlayerId] = useState(defaultPlayerId);
  const [selectedWeekendId, setSelectedWeekendId] = useState(defaultWeekendId);
  const [formState, setFormState] = useState<PredictionFormState>(() =>
    buildInitialState(
      defaultPlayerId,
      defaultWeekendId,
      raceWeekends,
      predictions,
      drivers,
    ),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const selectedWeekend =
    raceWeekends.find((weekend) => weekend.id === selectedWeekendId) ?? raceWeekends[0];

  if (players.length === 0) {
    return <Alert severity="warning">No players available in `players` table.</Alert>;
  }

  if (!selectedWeekend) {
    return <Alert severity="warning">No race weekends available in `race_weekends` table.</Alert>;
  }

  if (drivers.length === 0) {
    return <Alert severity="warning">No drivers available in `drivers` table.</Alert>;
  }

  const locked = isWeekendLocked(selectedWeekend);

  const handlePlayerChange = (event: SelectChangeEvent) => {
    const nextPlayerId = event.target.value;

    setSaveFeedback(null);
    setSelectedPlayerId(nextPlayerId);
    setFormState(
      buildInitialState(
        nextPlayerId,
        selectedWeekendId,
        raceWeekends,
        predictions,
        drivers,
      ),
    );
  };

  const handleWeekendChange = (event: SelectChangeEvent) => {
    const nextWeekendId = event.target.value;

    setSaveFeedback(null);
    setSelectedWeekendId(nextWeekendId);
    setFormState(
      buildInitialState(
        selectedPlayerId,
        nextWeekendId,
        raceWeekends,
        predictions,
        drivers,
      ),
    );
  };

  const handleSave = async () => {
    if (source !== "supabase") {
      setSaveFeedback({
        severity: "error",
        message: "Cannot save while app is in mock fallback mode.",
      });
      return;
    }

    if (locked) {
      setSaveFeedback({
        severity: "error",
        message: "Predictions are locked for this weekend.",
      });
      return;
    }

    setIsSaving(true);
    setSaveFeedback(null);

    try {
      const response = await fetch("/api/predictions/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          race_weekend_id: selectedWeekend.id,
          player_id: selectedPlayerId,
          quali_pole_driver_id: formState.quali_pole_driver_id,
          race_p1_driver_id: formState.race_p1_driver_id,
          race_p2_driver_id: formState.race_p2_driver_id,
          race_p3_driver_id: formState.race_p3_driver_id,
          race_p10_driver_id: formState.race_p10_driver_id,
          sprint_quali_pole_driver_id: selectedWeekend.is_sprint
            ? formState.sprint_quali_pole_driver_id
            : null,
          sprint_race_p1_driver_id: selectedWeekend.is_sprint
            ? formState.sprint_race_p1_driver_id
            : null,
        }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response);
        setSaveFeedback({ severity: "error", message });
        return;
      }

      setSaveFeedback({
        severity: "success",
        message: "Prediction saved successfully.",
      });
      router.refresh();
    } catch (error) {
      setSaveFeedback({
        severity: "error",
        message: `Request failed: ${String(error)}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      {saveFeedback ? (
        <Alert severity={saveFeedback.severity}>{saveFeedback.message}</Alert>
      ) : null}

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
              <Chip label={`Lock (ET): ${formatEasternDateTime(selectedWeekend.lock_at_utc)}`} />
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
                    drivers={drivers}
                  />
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ mt: 2.5 }}>
            <Button
              disabled={locked || isSaving || source !== "supabase"}
              variant="contained"
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save Prediction"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
