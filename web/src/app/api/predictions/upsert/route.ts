import { NextResponse } from "next/server";

import type { Database } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface UpsertPredictionPayload {
  race_weekend_id: string;
  player_id: string;
  quali_pole_driver_id: string;
  race_p1_driver_id: string;
  race_p2_driver_id: string;
  race_p3_driver_id: string;
  race_p10_driver_id: string;
  sprint_quali_pole_driver_id?: string | null;
  sprint_race_p1_driver_id?: string | null;
}

type RaceWeekendLockRow = Pick<
  Database["public"]["Tables"]["race_weekends"]["Row"],
  "id" | "is_sprint" | "lock_at_utc"
>;

type PredictionInsert = Database["public"]["Tables"]["predictions"]["Insert"];

type PredictionUpsertResult = {
  error: {
    code?: string;
    message: string;
  } | null;
};

type PredictionUpsertTable = {
  upsert: (
    values: PredictionInsert,
    options: { onConflict: string },
  ) => Promise<PredictionUpsertResult>;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  let payload: Partial<UpsertPredictionPayload>;

  try {
    payload = (await request.json()) as Partial<UpsertPredictionPayload>;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  if (
    !isNonEmptyString(payload.race_weekend_id) ||
    !isNonEmptyString(payload.player_id) ||
    !isNonEmptyString(payload.quali_pole_driver_id) ||
    !isNonEmptyString(payload.race_p1_driver_id) ||
    !isNonEmptyString(payload.race_p2_driver_id) ||
    !isNonEmptyString(payload.race_p3_driver_id) ||
    !isNonEmptyString(payload.race_p10_driver_id)
  ) {
    return NextResponse.json(
      { error: "Missing required prediction fields." },
      { status: 400 },
    );
  }

  const weekendResult = await supabase
    .from("race_weekends")
    .select("id,is_sprint,lock_at_utc")
    .eq("id", payload.race_weekend_id)
    .maybeSingle();

  const weekend = weekendResult.data as RaceWeekendLockRow | null;
  const weekendError = weekendResult.error;

  if (weekendError) {
    return NextResponse.json(
      { error: `Could not validate race weekend: ${weekendError.message}` },
      { status: 500 },
    );
  }

  if (!weekend) {
    return NextResponse.json(
      { error: "Race weekend not found." },
      { status: 404 },
    );
  }

  if (Date.parse(weekend.lock_at_utc) <= Date.now()) {
    return NextResponse.json(
      { error: "Predictions are locked for this race weekend." },
      { status: 423 },
    );
  }

  if (
    weekend.is_sprint &&
    (!isNonEmptyString(payload.sprint_quali_pole_driver_id) ||
      !isNonEmptyString(payload.sprint_race_p1_driver_id))
  ) {
    return NextResponse.json(
      { error: "Sprint weekends require sprint predictions." },
      { status: 400 },
    );
  }

  const predictionsTable = supabase.from("predictions") as unknown as PredictionUpsertTable;

  const { error: upsertError } = await predictionsTable.upsert(
    {
      race_weekend_id: payload.race_weekend_id,
      player_id: payload.player_id,
      quali_pole_driver_id: payload.quali_pole_driver_id,
      race_p1_driver_id: payload.race_p1_driver_id,
      race_p2_driver_id: payload.race_p2_driver_id,
      race_p3_driver_id: payload.race_p3_driver_id,
      race_p10_driver_id: payload.race_p10_driver_id,
      sprint_quali_pole_driver_id: weekend.is_sprint
        ? payload.sprint_quali_pole_driver_id ?? null
        : null,
      sprint_race_p1_driver_id: weekend.is_sprint
        ? payload.sprint_race_p1_driver_id ?? null
        : null,
      submitted_at: new Date().toISOString(),
    },
    {
      onConflict: "race_weekend_id,player_id",
    },
  );

  if (upsertError) {
    const status = upsertError.code === "23503" ? 400 : 500;

    return NextResponse.json(
      { error: `Could not save prediction: ${upsertError.message}` },
      { status },
    );
  }

  return NextResponse.json({ ok: true });
}
