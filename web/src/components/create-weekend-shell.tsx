"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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

import { sessionTypeLabel } from "@/lib/derived";
import { parseEasternDateTimeInputToUtcIso } from "@/lib/time";
import type { Player, RaceWeekend, SessionType } from "@/lib/types";

type CreateSessionFormState = Record<SessionType, string>;

type CreateWeekendFormState = {
  season: string;
  name: string;
  slug: string;
  location: string;
  is_sprint: boolean;
  lock_at_et: string;
};

interface CreateWeekendShellProps {
  source: "supabase" | "mock";
  players: Player[];
  raceWeekends: RaceWeekend[];
}

const emptySessionState: CreateSessionFormState = {
  quali: "",
  race: "",
  sprint_quali: "",
  sprint_race: "",
};

const sprintSessionOrder: SessionType[] = ["sprint_quali", "sprint_race", "quali", "race"];
const standardSessionOrder: SessionType[] = ["quali", "race"];

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

export function CreateWeekendShell({ source, players, raceWeekends }: CreateWeekendShellProps) {
  const router = useRouter();
  const adminPlayers = useMemo(() => players.filter((player) => player.is_admin), [players]);
  const defaultSeason = useMemo(() => {
    const seasonFromData = raceWeekends[0]?.season;

    return seasonFromData && seasonFromData >= 2026 ? seasonFromData : 2026;
  }, [raceWeekends]);

  const [selectedAdminId, setSelectedAdminId] = useState(adminPlayers[0]?.id ?? "");
  const [formState, setFormState] = useState<CreateWeekendFormState>({
    season: String(defaultSeason),
    name: "",
    slug: "",
    location: "",
    is_sprint: false,
    lock_at_et: "",
  });
  const [sessionState, setSessionState] = useState<CreateSessionFormState>({
    ...emptySessionState,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  if (adminPlayers.length === 0) {
    return <Alert severity="warning">No admin players found in `players` table.</Alert>;
  }

  const requiredSessionTypes = formState.is_sprint ? sprintSessionOrder : standardSessionOrder;

  const handleCreateWeekend = async () => {
    if (source !== "supabase") {
      setFeedback({
        severity: "error",
        message: "Cannot create weekends while app is using mock fallback data.",
      });
      return;
    }

    const season = Number.parseInt(formState.season, 10);
    const normalizedSlug = normalizeSlug(formState.slug);

    if (!Number.isInteger(season) || season < 2026) {
      setFeedback({ severity: "error", message: "Season must be an integer year (2026+)." });
      return;
    }

    if (!formState.name.trim() || !normalizedSlug || !formState.location.trim()) {
      setFeedback({
        severity: "error",
        message: "Name, slug, and location are required.",
      });
      return;
    }

    const lockAtUtcIso = parseEasternDateTimeInputToUtcIso(formState.lock_at_et);

    if (!lockAtUtcIso) {
      setFeedback({ severity: "error", message: "Lock time must be a valid ET datetime." });
      return;
    }

    const sessionsPayload: Array<{ type: SessionType; starts_at_utc: string }> = [];

    for (const sessionType of requiredSessionTypes) {
      const value = sessionState[sessionType];

      if (!value.trim()) {
        setFeedback({
          severity: "error",
          message: `${sessionTypeLabel[sessionType]} is required.`,
        });
        return;
      }

      const startsAtUtcIso = parseEasternDateTimeInputToUtcIso(value);

      if (!startsAtUtcIso) {
        setFeedback({
          severity: "error",
          message: `${sessionTypeLabel[sessionType]} has an invalid ET datetime.`,
        });
        return;
      }

      sessionsPayload.push({ type: sessionType, starts_at_utc: startsAtUtcIso });
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/race-weekends/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_player_id: selectedAdminId,
          season,
          name: formState.name.trim(),
          slug: normalizedSlug,
          location: formState.location.trim(),
          is_sprint: formState.is_sprint,
          lock_at_utc: lockAtUtcIso,
          sessions: sessionsPayload,
        }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response);
        setFeedback({ severity: "error", message });
        return;
      }

      setFeedback({ severity: "success", message: "Race weekend created successfully." });
      setFormState({
        season: String(season),
        name: "",
        slug: "",
        location: "",
        is_sprint: false,
        lock_at_et: "",
      });
      setSessionState({ ...emptySessionState });
      router.refresh();
    } catch (error) {
      setFeedback({ severity: "error", message: `Request failed: ${String(error)}` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.6}>
            <Typography variant="h5">Create New Race Weekend</Typography>
            <Typography variant="body2" color="text.secondary">
              Add race weekends directly from Admin. Enter lock/session times in ET.
            </Typography>
          </Stack>

          {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Admin Player</InputLabel>
                <Select
                  label="Admin Player"
                  value={selectedAdminId}
                  onChange={(event: SelectChangeEvent) => setSelectedAdminId(event.target.value)}
                >
                  {adminPlayers.map((player) => (
                    <MenuItem key={player.id} value={player.id}>
                      {player.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Season"
                type="number"
                value={formState.season}
                onChange={(event) =>
                  setFormState((previous) => ({ ...previous, season: event.target.value }))
                }
                inputProps={{ min: 2026 }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Race Name"
                value={formState.name}
                onChange={(event) =>
                  setFormState((previous) => ({ ...previous, name: event.target.value }))
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Slug"
                value={formState.slug}
                onChange={(event) =>
                  setFormState((previous) => ({ ...previous, slug: event.target.value }))
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={formState.is_sprint ? "sprint" : "standard"}
                  onChange={(event: SelectChangeEvent) =>
                    setFormState((previous) => ({
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
                label="Location"
                value={formState.location}
                onChange={(event) =>
                  setFormState((previous) => ({ ...previous, location: event.target.value }))
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Lock Time (ET)"
                type="datetime-local"
                value={formState.lock_at_et}
                onChange={(event) =>
                  setFormState((previous) => ({ ...previous, lock_at_et: event.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {requiredSessionTypes.map((sessionType) => (
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

          <Box>
            <Button
              variant="contained"
              onClick={handleCreateWeekend}
              disabled={isSaving || source !== "supabase"}
            >
              {isSaving ? "Creating Weekend..." : "Create Race Weekend"}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
