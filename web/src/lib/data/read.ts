import { cache } from "react";

import {
  drivers as mockDrivers,
  players as mockPlayers,
  predictions as mockPredictions,
  raceWeekends as mockRaceWeekends,
  results as mockResults,
  scoreEntries as mockScoreEntries,
  sessions as mockSessions,
} from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type {
  Driver,
  Player,
  Prediction,
  RaceWeekend,
  Result,
  ScoreEntry,
  Session,
} from "@/lib/types";

export type DataSource = "supabase" | "mock";

export interface ReadData {
  source: DataSource;
  players: Player[];
  drivers: Driver[];
  raceWeekends: RaceWeekend[];
  sessions: Session[];
  predictions: Prediction[];
  results: Result[];
  scoreEntries: ScoreEntry[];
  warning: string | null;
}

const fallbackData: ReadData = {
  source: "mock",
  players: mockPlayers,
  drivers: mockDrivers,
  raceWeekends: mockRaceWeekends,
  sessions: mockSessions,
  predictions: mockPredictions,
  results: mockResults,
  scoreEntries: mockScoreEntries,
  warning: null,
};

function toPlayers(rows: Database["public"]["Tables"]["players"]["Row"][]): Player[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    is_admin: row.is_admin,
  }));
}

function toDrivers(rows: Database["public"]["Tables"]["drivers"]["Row"][]): Driver[] {
  return rows.map((row) => ({
    id: row.id,
    season: row.season,
    code: row.code,
    full_name: row.full_name,
    display_name: row.display_name,
    team_name: row.team_name,
    is_active: row.is_active,
    sort_order: row.sort_order,
  }));
}

function toRaceWeekends(
  rows: Database["public"]["Tables"]["race_weekends"]["Row"][],
): RaceWeekend[] {
  return rows.map((row) => ({
    id: row.id,
    season: row.season,
    name: row.name,
    slug: row.slug,
    location: row.location,
    is_sprint: row.is_sprint,
    lock_at_utc: row.lock_at_utc,
  }));
}

function toSessions(rows: Database["public"]["Tables"]["sessions"]["Row"][]): Session[] {
  return rows.map((row) => ({
    id: row.id,
    race_weekend_id: row.race_weekend_id,
    type: row.type,
    starts_at_utc: row.starts_at_utc,
  }));
}

function toPredictions(
  rows: Database["public"]["Tables"]["predictions"]["Row"][],
): Prediction[] {
  return rows.map((row) => ({
    id: row.id,
    race_weekend_id: row.race_weekend_id,
    player_id: row.player_id,
    quali_pole_driver_id: row.quali_pole_driver_id,
    race_p1_driver_id: row.race_p1_driver_id,
    race_p2_driver_id: row.race_p2_driver_id,
    race_p3_driver_id: row.race_p3_driver_id,
    race_p10_driver_id: row.race_p10_driver_id,
    sprint_quali_pole_driver_id: row.sprint_quali_pole_driver_id,
    sprint_race_p1_driver_id: row.sprint_race_p1_driver_id,
  }));
}

function toResults(rows: Database["public"]["Tables"]["results"]["Row"][]): Result[] {
  return rows.map((row) => ({
    id: row.id,
    race_weekend_id: row.race_weekend_id,
    quali_pole_driver_id: row.quali_pole_driver_id,
    race_p1_driver_id: row.race_p1_driver_id,
    race_p2_driver_id: row.race_p2_driver_id,
    race_p3_driver_id: row.race_p3_driver_id,
    race_p10_driver_id: row.race_p10_driver_id,
    sprint_quali_pole_driver_id: row.sprint_quali_pole_driver_id,
    sprint_race_p1_driver_id: row.sprint_race_p1_driver_id,
    entered_by_player_id: row.entered_by_player_id,
  }));
}

function toScoreEntries(
  rows: Database["public"]["Tables"]["score_entries"]["Row"][],
): ScoreEntry[] {
  return rows.map((row) => ({
    id: row.id,
    race_weekend_id: row.race_weekend_id,
    player_id: row.player_id,
    quali_pole_points: row.quali_pole_points,
    race_p1_points: row.race_p1_points,
    race_p2_points: row.race_p2_points,
    race_p3_points: row.race_p3_points,
    race_p10_points: row.race_p10_points,
    sprint_quali_pole_points: row.sprint_quali_pole_points,
    sprint_race_p1_points: row.sprint_race_p1_points,
    total_points: row.total_points,
  }));
}

export const getReadData = cache(async (): Promise<ReadData> => {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return {
      ...fallbackData,
      warning:
        "Missing Supabase env vars. Rendering with local mock data until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    };
  }

  try {
    const [
      playersResult,
      driversResult,
      raceWeekendsResult,
      sessionsResult,
      predictionsResult,
      resultsResult,
      scoreEntriesResult,
    ] = await Promise.all([
      supabase.from("players").select("*").order("name", { ascending: true }),
      supabase
        .from("drivers")
        .select("*")
        .eq("season", 2026)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("race_weekends")
        .select("*")
        .eq("season", 2026)
        .order("lock_at_utc", { ascending: true }),
      supabase.from("sessions").select("*").order("starts_at_utc", { ascending: true }),
      supabase.from("predictions").select("*"),
      supabase.from("results").select("*"),
      supabase
        .from("score_entries")
        .select("*")
        .order("calculated_at", { ascending: false }),
    ]);

    const errors = [
      playersResult.error,
      driversResult.error,
      raceWeekendsResult.error,
      sessionsResult.error,
      predictionsResult.error,
      resultsResult.error,
      scoreEntriesResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      const details = errors.map((error) => error?.message).join("; ");

      return {
        ...fallbackData,
        warning: `Supabase read failed, using mock data. ${details}`,
      };
    }

    return {
      source: "supabase",
      players: toPlayers(playersResult.data ?? []),
      drivers: toDrivers(driversResult.data ?? []),
      raceWeekends: toRaceWeekends(raceWeekendsResult.data ?? []),
      sessions: toSessions(sessionsResult.data ?? []),
      predictions: toPredictions(predictionsResult.data ?? []),
      results: toResults(resultsResult.data ?? []),
      scoreEntries: toScoreEntries(scoreEntriesResult.data ?? []),
      warning: null,
    };
  } catch (error) {
    return {
      ...fallbackData,
      warning: `Supabase read failed, using mock data. ${String(error)}`,
    };
  }
});
