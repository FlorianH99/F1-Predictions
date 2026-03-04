export type SessionType = "quali" | "race" | "sprint_quali" | "sprint_race";

export interface Player {
  id: string;
  name: string;
  is_admin: boolean;
}

export interface Driver {
  id: string;
  season: number;
  code: string;
  full_name: string;
  display_name: string;
  team_name: string;
  is_active: boolean;
  sort_order: number;
}

export interface RaceWeekend {
  id: string;
  season: number;
  name: string;
  slug: string;
  location: string;
  is_sprint: boolean;
  lock_at_utc: string;
}

export interface Session {
  id: string;
  race_weekend_id: string;
  type: SessionType;
  starts_at_utc: string;
}

export interface Prediction {
  id: string;
  race_weekend_id: string;
  player_id: string;
  quali_pole_driver_id: string;
  race_p1_driver_id: string;
  race_p2_driver_id: string;
  race_p3_driver_id: string;
  race_p10_driver_id: string;
  sprint_quali_pole_driver_id: string | null;
  sprint_race_p1_driver_id: string | null;
}

export interface Result {
  id: string;
  race_weekend_id: string;
  quali_pole_driver_id: string;
  race_p1_driver_id: string;
  race_p2_driver_id: string;
  race_p3_driver_id: string;
  race_p10_driver_id: string;
  sprint_quali_pole_driver_id: string | null;
  sprint_race_p1_driver_id: string | null;
  entered_by_player_id: string;
}

export interface ScoreEntry {
  id: string;
  race_weekend_id: string;
  player_id: string;
  quali_pole_points: number;
  race_p1_points: number;
  race_p2_points: number;
  race_p3_points: number;
  race_p10_points: number;
  sprint_quali_pole_points: number;
  sprint_race_p1_points: number;
  total_points: number;
}

export interface LeaderboardTotal {
  player_id: string;
  player_name: string;
  season_points: number;
}

export interface WeekendWithSessions {
  weekend: RaceWeekend;
  sessions: Session[];
}

export interface PerRacePoints {
  race_weekend_id: string;
  race_name: string;
  entries: Array<{
    player_id: string;
    player_name: string;
    total_points: number;
  }>;
}
