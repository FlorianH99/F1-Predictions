import type { Database } from "@/lib/supabase/database.types";

type PredictionRow = Database["public"]["Tables"]["predictions"]["Row"];
type ResultRow = Database["public"]["Tables"]["results"]["Row"];
type ScoreEntryInsert = Database["public"]["Tables"]["score_entries"]["Insert"];

type WeekendSprintInfo = {
  id: string;
  is_sprint: boolean;
};

interface ScoreBreakdown {
  quali_pole_points: number;
  race_p1_points: number;
  race_p2_points: number;
  race_p3_points: number;
  race_p10_points: number;
  sprint_quali_pole_points: number;
  sprint_race_p1_points: number;
  total_points: number;
}

function pointIfMatch(actual: string | null, predicted: string | null, points: number): number {
  if (!actual || !predicted) {
    return 0;
  }

  return actual === predicted ? points : 0;
}

export function calculateScoreBreakdown(
  prediction: PredictionRow,
  result: ResultRow,
  isSprintWeekend: boolean,
): ScoreBreakdown {
  const qualiPole = pointIfMatch(result.quali_pole_driver_id, prediction.quali_pole_driver_id, 1);
  const raceP1 = pointIfMatch(result.race_p1_driver_id, prediction.race_p1_driver_id, 1);
  const raceP2 = pointIfMatch(result.race_p2_driver_id, prediction.race_p2_driver_id, 1);
  const raceP3 = pointIfMatch(result.race_p3_driver_id, prediction.race_p3_driver_id, 1);
  const raceP10 = pointIfMatch(result.race_p10_driver_id, prediction.race_p10_driver_id, 2);

  const sprintQualiPole = isSprintWeekend
    ? pointIfMatch(
        result.sprint_quali_pole_driver_id,
        prediction.sprint_quali_pole_driver_id,
        1,
      )
    : 0;

  const sprintRaceP1 = isSprintWeekend
    ? pointIfMatch(result.sprint_race_p1_driver_id, prediction.sprint_race_p1_driver_id, 1)
    : 0;

  return {
    quali_pole_points: qualiPole,
    race_p1_points: raceP1,
    race_p2_points: raceP2,
    race_p3_points: raceP3,
    race_p10_points: raceP10,
    sprint_quali_pole_points: sprintQualiPole,
    sprint_race_p1_points: sprintRaceP1,
    total_points:
      qualiPole + raceP1 + raceP2 + raceP3 + raceP10 + sprintQualiPole + sprintRaceP1,
  };
}

export function buildScoreEntryInsert(
  prediction: PredictionRow,
  result: ResultRow,
  weekend: WeekendSprintInfo,
): ScoreEntryInsert {
  const points = calculateScoreBreakdown(prediction, result, weekend.is_sprint);

  return {
    race_weekend_id: weekend.id,
    player_id: prediction.player_id,
    ...points,
    calculated_at: new Date().toISOString(),
  };
}
