export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SessionType = "quali" | "race" | "sprint_quali" | "sprint_race";

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          name: string;
          is_admin: boolean;
          created_at: string;
        };
      };
      drivers: {
        Row: {
          id: string;
          season: number;
          code: string;
          full_name: string;
          display_name: string;
          team_name: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
      };
      race_weekends: {
        Row: {
          id: string;
          season: number;
          name: string;
          slug: string;
          location: string;
          is_sprint: boolean;
          lock_at_utc: string;
          created_at: string;
          updated_at: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          race_weekend_id: string;
          type: SessionType;
          starts_at_utc: string;
          created_at: string;
          updated_at: string;
        };
      };
      predictions: {
        Row: {
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
          submitted_at: string;
          updated_at: string;
        };
      };
      results: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
      };
      score_entries: {
        Row: {
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
          calculated_at: string;
        };
      };
    };
    Views: {
      leaderboard_totals: {
        Row: {
          player_id: string;
          player_name: string;
          season_points: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: {
      session_type: SessionType;
    };
    CompositeTypes: Record<string, never>;
  };
}
