"use client";

import { useMemo, useState } from "react";

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

import type { Driver, Player, RaceWeekend, Result } from "@/lib/types";

type ResultFormState = {
  quali_pole_driver_id: string;
  race_p1_driver_id: string;
  race_p2_driver_id: string;
  race_p3_driver_id: string;
  race_p10_driver_id: string;
  sprint_quali_pole_driver_id: string;
  sprint_race_p1_driver_id: string;
};

const resultFields: Array<{
  key: keyof ResultFormState;
  label: string;
  sprintOnly?: boolean;
}> = [
  { key: "quali_pole_driver_id", label: "Qualifying Pole" },
  { key: "race_p1_driver_id", label: "Race P1" },
  { key: "race_p2_driver_id", label: "Race P2" },
  { key: "race_p3_driver_id", label: "Race P3" },
  { key: "race_p10_driver_id", label: "Race P10" },
  {
    key: "sprint_quali_pole_driver_id",
    label: "Sprint Qualifying Pole",
    sprintOnly: true,
  },
  { key: "sprint_race_p1_driver_id", label: "Sprint Race P1", sprintOnly: true },
];

interface AdminShellProps {
  source: "supabase" | "mock";
  players: Player[];
  drivers: Driver[];
  raceWeekends: RaceWeekend[];
  results: Result[];
}

function getDriversForSeason(drivers: Driver[], season: number): Driver[] {
  return drivers
    .filter((driver) => driver.season === season && driver.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

function buildInitialResultState(
  weekendId: string,
  raceWeekends: RaceWeekend[],
  results: Result[],
  drivers: Driver[],
): ResultFormState {
  const weekend = raceWeekends.find((item) => item.id === weekendId);
  const season = weekend?.season ?? 2026;
  const seasonDrivers = getDriversForSeason(drivers, season);

  const fallback = {
    lead: seasonDrivers[0]?.id ?? "",
    alt1: seasonDrivers[1]?.id ?? "",
    alt2: seasonDrivers[2]?.id ?? "",
    alt3: seasonDrivers[3]?.id ?? "",
    alt4: seasonDrivers[4]?.id ?? "",
  };

  const existing = results.find((result) => result.race_weekend_id === weekendId);

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

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };

    return body.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export function AdminShell({
  source,
  players,
  drivers,
  raceWeekends,
  results,
}: AdminShellProps) {
  const router = useRouter();
  const adminPlayers = useMemo(
    () => players.filter((player) => player.is_admin),
    [players],
  );

  const defaultAdminId = adminPlayers[0]?.id ?? "";
  const defaultWeekendId = raceWeekends[0]?.id ?? "";

  const [selectedAdminId, setSelectedAdminId] = useState(defaultAdminId);
  const [selectedWeekendId, setSelectedWeekendId] = useState(defaultWeekendId);
  const [resultState, setResultState] = useState<ResultFormState>(() =>
    buildInitialResultState(defaultWeekendId, raceWeekends, results, drivers),
  );
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [feedback, setFeedback] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const selectedWeekend =
    raceWeekends.find((weekend) => weekend.id === selectedWeekendId) ?? raceWeekends[0];

  if (adminPlayers.length === 0) {
    return <Alert severity="warning">No admin players found in `players` table.</Alert>;
  }

  if (!selectedWeekend) {
    return <Alert severity="warning">No race weekends found in `race_weekends` table.</Alert>;
  }

  if (drivers.length === 0) {
    return <Alert severity="warning">No drivers found in `drivers` table.</Alert>;
  }

  const seasonDrivers = getDriversForSeason(drivers, selectedWeekend.season);

  const handleWeekendChange = (event: SelectChangeEvent) => {
    const nextWeekendId = event.target.value;

    setFeedback(null);
    setSelectedWeekendId(nextWeekendId);
    setResultState(
      buildInitialResultState(nextWeekendId, raceWeekends, results, drivers),
    );
  };

  const handleSaveResult = async () => {
    if (source !== "supabase") {
      setFeedback({
        severity: "error",
        message: "Cannot write results while app is using mock fallback data.",
      });
      return;
    }

    setIsSavingResult(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/results/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          race_weekend_id: selectedWeekend.id,
          entered_by_player_id: selectedAdminId,
          quali_pole_driver_id: resultState.quali_pole_driver_id,
          race_p1_driver_id: resultState.race_p1_driver_id,
          race_p2_driver_id: resultState.race_p2_driver_id,
          race_p3_driver_id: resultState.race_p3_driver_id,
          race_p10_driver_id: resultState.race_p10_driver_id,
          sprint_quali_pole_driver_id: selectedWeekend.is_sprint
            ? resultState.sprint_quali_pole_driver_id
            : null,
          sprint_race_p1_driver_id: selectedWeekend.is_sprint
            ? resultState.sprint_race_p1_driver_id
            : null,
        }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response);
        setFeedback({ severity: "error", message });
        return;
      }

      setFeedback({ severity: "success", message: "Result saved successfully." });
      router.refresh();
    } catch (error) {
      setFeedback({ severity: "error", message: `Request failed: ${String(error)}` });
    } finally {
      setIsSavingResult(false);
    }
  };

  const handleRecalculate = async () => {
    if (source !== "supabase") {
      setFeedback({
        severity: "error",
        message: "Cannot recalculate while app is using mock fallback data.",
      });
      return;
    }

    setIsRecalculating(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/scores/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_player_id: selectedAdminId,
          race_weekend_id: selectedWeekend.id,
        }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response);
        setFeedback({ severity: "error", message });
        return;
      }

      setFeedback({
        severity: "success",
        message: "Score recalculation completed for the selected weekend.",
      });
      router.refresh();
    } catch (error) {
      setFeedback({ severity: "error", message: `Request failed: ${String(error)}` });
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Admin Player</InputLabel>
            <Select
              value={selectedAdminId}
              label="Admin Player"
              onChange={(event: SelectChangeEvent) => {
                setFeedback(null);
                setSelectedAdminId(event.target.value);
              }}
            >
              {adminPlayers.map((player) => (
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
              onChange={handleWeekendChange}
            >
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
          <Stack spacing={1.25}>
            <Typography variant="h5">Enter Official Result</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={`Lock: ${new Date(selectedWeekend.lock_at_utc).toUTCString()}`} />
              {selectedWeekend.is_sprint ? (
                <Chip color="secondary" label="Sprint Weekend" />
              ) : null}
            </Stack>
          </Stack>

          <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
            {resultFields.map((field) => {
              if (field.sprintOnly && !selectedWeekend.is_sprint) {
                return null;
              }

              return (
                <Grid size={{ xs: 12, md: 6 }} key={field.key}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      value={resultState[field.key]}
                      label={field.label}
                      onChange={(event: SelectChangeEvent) =>
                        setResultState((previous) => ({
                          ...previous,
                          [field.key]: event.target.value,
                        }))
                      }
                    >
                      {seasonDrivers.map((driver) => (
                        <MenuItem key={driver.id} value={driver.id}>
                          {`${driver.display_name} (${driver.team_name})`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ mt: 2.5 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleSaveResult}
                disabled={isSavingResult || source !== "supabase"}
              >
                {isSavingResult ? "Saving..." : "Save Result"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleRecalculate}
                disabled={isRecalculating || source !== "supabase"}
              >
                {isRecalculating ? "Recalculating..." : "Recalculate Scores"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
