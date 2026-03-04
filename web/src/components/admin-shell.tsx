"use client";

import { useEffect, useMemo, useState } from "react";

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
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { TeamDriverBadge } from "@/components/team-driver-badge";
import { sessionTypeLabel } from "@/lib/derived";
import {
  formatEasternDateTime,
  formatEasternDateTimeInputValue,
  parseEasternDateTimeInputToUtcIso,
} from "@/lib/time";
import type { Driver, Player, RaceWeekend, Result, Session, SessionType } from "@/lib/types";

type ResultFormState = {
  quali_pole_driver_id: string;
  race_p1_driver_id: string;
  race_p2_driver_id: string;
  race_p3_driver_id: string;
  race_p10_driver_id: string;
  sprint_quali_pole_driver_id: string;
  sprint_race_p1_driver_id: string;
};

type WeekendFormState = {
  name: string;
  slug: string;
  location: string;
  is_sprint: boolean;
  lock_at_et: string;
};

type SessionFormState = Record<SessionType, string>;

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

const emptySessionFormState: SessionFormState = {
  quali: "",
  race: "",
  sprint_quali: "",
  sprint_race: "",
};

const sprintSessionOrder: SessionType[] = ["sprint_quali", "sprint_race", "quali", "race"];
const standardSessionOrder: SessionType[] = ["quali", "race"];

interface AdminShellProps {
  source: "supabase" | "mock";
  players: Player[];
  drivers: Driver[];
  raceWeekends: RaceWeekend[];
  sessions: Session[];
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

function buildWeekendFormState(weekend: RaceWeekend | null): WeekendFormState {
  if (!weekend) {
    return {
      name: "",
      slug: "",
      location: "",
      is_sprint: false,
      lock_at_et: "",
    };
  }

  return {
    name: weekend.name,
    slug: weekend.slug,
    location: weekend.location,
    is_sprint: weekend.is_sprint,
    lock_at_et: formatEasternDateTimeInputValue(weekend.lock_at_utc),
  };
}

function buildSessionFormState(weekendId: string, allSessions: Session[]): SessionFormState {
  const nextState: SessionFormState = { ...emptySessionFormState };

  for (const session of allSessions) {
    if (session.race_weekend_id !== weekendId) {
      continue;
    }

    nextState[session.type] = formatEasternDateTimeInputValue(session.starts_at_utc);
  }

  return nextState;
}

function normalizeSlug(rawValue: string): string {
  return rawValue
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  sessions,
  results,
}: AdminShellProps) {
  const router = useRouter();
  const adminPlayers = useMemo(
    () => players.filter((player) => player.is_admin),
    [players],
  );
  const sortedWeekends = useMemo(
    () => [...raceWeekends].sort((a, b) => Date.parse(a.lock_at_utc) - Date.parse(b.lock_at_utc)),
    [raceWeekends],
  );

  const initialWeekend = sortedWeekends[0] ?? null;
  const defaultAdminId = adminPlayers[0]?.id ?? "";

  const [selectedAdminId, setSelectedAdminId] = useState(defaultAdminId);
  const [selectedWeekendId, setSelectedWeekendId] = useState(initialWeekend?.id ?? "");
  const [resultState, setResultState] = useState<ResultFormState>(() =>
    buildInitialResultState(initialWeekend?.id ?? "", sortedWeekends, results, drivers),
  );
  const [weekendState, setWeekendState] = useState<WeekendFormState>(() =>
    buildWeekendFormState(initialWeekend),
  );
  const [sessionState, setSessionState] = useState<SessionFormState>(() =>
    buildSessionFormState(initialWeekend?.id ?? "", sessions),
  );
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isSavingWeekend, setIsSavingWeekend] = useState(false);
  const [isSavingSessions, setIsSavingSessions] = useState(false);
  const [feedback, setFeedback] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const selectedWeekend =
    sortedWeekends.find((weekend) => weekend.id === selectedWeekendId) ?? sortedWeekends[0] ?? null;

  useEffect(() => {
    if (!selectedWeekend) {
      return;
    }

    setResultState(buildInitialResultState(selectedWeekend.id, sortedWeekends, results, drivers));
    setWeekendState(buildWeekendFormState(selectedWeekend));
    setSessionState(buildSessionFormState(selectedWeekend.id, sessions));
  }, [drivers, results, selectedWeekend, sessions, sortedWeekends]);

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
  const seasonDriverById = new Map(seasonDrivers.map((driver) => [driver.id, driver]));
  const sessionTypesForWeekend = weekendState.is_sprint ? sprintSessionOrder : standardSessionOrder;

  const handleWeekendChange = (event: SelectChangeEvent) => {
    const nextWeekendId = event.target.value;
    const nextWeekend = sortedWeekends.find((weekend) => weekend.id === nextWeekendId) ?? null;

    setFeedback(null);
    setSelectedWeekendId(nextWeekendId);

    if (nextWeekend) {
      setResultState(buildInitialResultState(nextWeekend.id, sortedWeekends, results, drivers));
      setWeekendState(buildWeekendFormState(nextWeekend));
      setSessionState(buildSessionFormState(nextWeekend.id, sessions));
    }
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

  const handleSaveWeekendDetails = async () => {
    if (source !== "supabase") {
      setFeedback({
        severity: "error",
        message: "Cannot update weekends while app is using mock fallback data.",
      });
      return;
    }

    const normalizedSlug = normalizeSlug(weekendState.slug);

    if (!weekendState.name.trim() || !normalizedSlug || !weekendState.location.trim()) {
      setFeedback({
        severity: "error",
        message: "Name, slug, and location are required before saving weekend details.",
      });
      return;
    }

    const lockAtUtcIso = parseEasternDateTimeInputToUtcIso(weekendState.lock_at_et);

    if (!lockAtUtcIso) {
      setFeedback({
        severity: "error",
        message: "Lock time must be a valid Eastern Time date/time.",
      });
      return;
    }

    setIsSavingWeekend(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/race-weekends/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_player_id: selectedAdminId,
          race_weekend_id: selectedWeekend.id,
          season: selectedWeekend.season,
          name: weekendState.name.trim(),
          slug: normalizedSlug,
          location: weekendState.location.trim(),
          is_sprint: weekendState.is_sprint,
          lock_at_utc: lockAtUtcIso,
        }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response);
        setFeedback({ severity: "error", message });
        return;
      }

      setFeedback({ severity: "success", message: "Race weekend details saved successfully." });
      router.refresh();
    } catch (error) {
      setFeedback({ severity: "error", message: `Request failed: ${String(error)}` });
    } finally {
      setIsSavingWeekend(false);
    }
  };

  const handleSaveSessions = async () => {
    if (source !== "supabase") {
      setFeedback({
        severity: "error",
        message: "Cannot update sessions while app is using mock fallback data.",
      });
      return;
    }

    const sessionUpdates: Array<{ type: SessionType; starts_at_utc: string }> = [];

    for (const sessionType of sessionTypesForWeekend) {
      const value = sessionState[sessionType];

      if (!value.trim()) {
        setFeedback({
          severity: "error",
          message: `${sessionTypeLabel[sessionType]} time is required before saving sessions.`,
        });
        return;
      }

      const startsAtUtcIso = parseEasternDateTimeInputToUtcIso(value);

      if (!startsAtUtcIso) {
        setFeedback({
          severity: "error",
          message: `${sessionTypeLabel[sessionType]} has an invalid Eastern Time value.`,
        });
        return;
      }

      sessionUpdates.push({ type: sessionType, starts_at_utc: startsAtUtcIso });
    }

    setIsSavingSessions(true);
    setFeedback(null);

    try {
      const saveResponses = await Promise.all(
        sessionUpdates.map(async (update) => {
          const response = await fetch("/api/admin/sessions/upsert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              admin_player_id: selectedAdminId,
              race_weekend_id: selectedWeekend.id,
              type: update.type,
              starts_at_utc: update.starts_at_utc,
            }),
          });

          if (response.ok) {
            return null;
          }

          return getErrorMessage(response);
        }),
      );

      const firstError = saveResponses.find((message) => typeof message === "string");

      if (firstError) {
        setFeedback({ severity: "error", message: firstError });
        return;
      }

      setFeedback({ severity: "success", message: "Session schedule saved successfully." });
      router.refresh();
    } catch (error) {
      setFeedback({ severity: "error", message: `Request failed: ${String(error)}` });
    } finally {
      setIsSavingSessions(false);
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
          <Stack spacing={1.25}>
            <Typography variant="h5">Manage Weekend Schedule</Typography>
            <Typography variant="body2" color="text.secondary">
              Enter lock and session times in Eastern Time. They are stored as UTC in Supabase.
            </Typography>
          </Stack>

          <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Race Name"
                value={weekendState.name}
                onChange={(event) =>
                  setWeekendState((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Slug"
                value={weekendState.slug}
                onChange={(event) =>
                  setWeekendState((previous) => ({
                    ...previous,
                    slug: event.target.value,
                  }))
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Location"
                value={weekendState.location}
                onChange={(event) =>
                  setWeekendState((previous) => ({
                    ...previous,
                    location: event.target.value,
                  }))
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Weekend Type</InputLabel>
                <Select
                  label="Weekend Type"
                  value={weekendState.is_sprint ? "sprint" : "standard"}
                  onChange={(event: SelectChangeEvent) =>
                    setWeekendState((previous) => ({
                      ...previous,
                      is_sprint: event.target.value === "sprint",
                    }))
                  }
                >
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="sprint">Sprint</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Lock Time (ET)"
                type="datetime-local"
                value={weekendState.lock_at_et}
                onChange={(event) =>
                  setWeekendState((previous) => ({
                    ...previous,
                    lock_at_et: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSaveWeekendDetails}
              disabled={isSavingWeekend || source !== "supabase"}
            >
              {isSavingWeekend ? "Saving Weekend..." : "Save Weekend Details"}
            </Button>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Session Schedule</Typography>

            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {sessionTypesForWeekend.map((sessionType) => (
                <Grid key={sessionType} size={{ xs: 12, md: 6, lg: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`${sessionTypeLabel[sessionType]} (ET)`}
                    type="datetime-local"
                    value={sessionState[sessionType]}
                    onChange={(event) =>
                      setSessionState((previous) => ({
                        ...previous,
                        [sessionType]: event.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleSaveSessions}
                disabled={isSavingSessions || source !== "supabase"}
              >
                {isSavingSessions ? "Saving Sessions..." : "Save Session Schedule"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.25}>
            <Typography variant="h5">Enter Official Result</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`Lock (ET): ${formatEasternDateTime(selectedWeekend.lock_at_utc)}`} />
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
                      renderValue={(selected) => {
                        const driver = seasonDriverById.get(String(selected));

                        return <TeamDriverBadge driver={driver} compact />;
                      }}
                      onChange={(event: SelectChangeEvent) =>
                        setResultState((previous) => ({
                          ...previous,
                          [field.key]: event.target.value,
                        }))
                      }
                    >
                      {seasonDrivers.map((driver) => (
                        <MenuItem key={driver.id} value={driver.id}>
                          <TeamDriverBadge driver={driver} showTeamName compact />
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

