import { NextResponse } from "next/server";

import type { Database } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface UpsertResultPayload {
  race_weekend_id: string;
  entered_by_player_id: string;
  quali_pole_driver_id: string;
  race_p1_driver_id: string;
  race_p2_driver_id: string;
  race_p3_driver_id: string;
  race_p10_driver_id: string;
  sprint_quali_pole_driver_id?: string | null;
  sprint_race_p1_driver_id?: string | null;
}

type ResultInsert = Database["public"]["Tables"]["results"]["Insert"];

type ResultUpsertResponse = {
  error: {
    code?: string;
    message: string;
  } | null;
};

type ResultUpsertTable = {
  upsert: (
    values: ResultInsert,
    options: { onConflict: string },
  ) => Promise<ResultUpsertResponse>;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let payload: Partial<UpsertResultPayload>;

  try {
    payload = (await request.json()) as Partial<UpsertResultPayload>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (
    !isNonEmptyString(payload.race_weekend_id) ||
    !isNonEmptyString(payload.entered_by_player_id) ||
    !isNonEmptyString(payload.quali_pole_driver_id) ||
    !isNonEmptyString(payload.race_p1_driver_id) ||
    !isNonEmptyString(payload.race_p2_driver_id) ||
    !isNonEmptyString(payload.race_p3_driver_id) ||
    !isNonEmptyString(payload.race_p10_driver_id)
  ) {
    return NextResponse.json({ error: "Missing required result fields." }, { status: 400 });
  }

  const adminResult = await supabase
    .from("players")
    .select("id,is_admin")
    .eq("id", payload.entered_by_player_id)
    .maybeSingle();

  const adminRow = adminResult.data as { id: string; is_admin: boolean } | null;

  if (adminResult.error) {
    return NextResponse.json(
      { error: `Could not validate player: ${adminResult.error.message}` },
      { status: 500 },
    );
  }

  if (!adminRow?.is_admin) {
    return NextResponse.json({ error: "Only admin players can enter results." }, { status: 403 });
  }

  const weekendResult = await supabase
    .from("race_weekends")
    .select("id,is_sprint")
    .eq("id", payload.race_weekend_id)
    .maybeSingle();

  const weekend = weekendResult.data as { id: string; is_sprint: boolean } | null;

  if (weekendResult.error) {
    return NextResponse.json(
      { error: `Could not validate race weekend: ${weekendResult.error.message}` },
      { status: 500 },
    );
  }

  if (!weekend) {
    return NextResponse.json({ error: "Race weekend not found." }, { status: 404 });
  }

  if (
    weekend.is_sprint &&
    (!isNonEmptyString(payload.sprint_quali_pole_driver_id) ||
      !isNonEmptyString(payload.sprint_race_p1_driver_id))
  ) {
    return NextResponse.json(
      { error: "Sprint weekends require sprint result fields." },
      { status: 400 },
    );
  }

  const resultsTable = supabase.from("results") as unknown as ResultUpsertTable;

  const { error: upsertError } = await resultsTable.upsert(
    {
      race_weekend_id: payload.race_weekend_id,
      entered_by_player_id: payload.entered_by_player_id,
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
      updated_at: new Date().toISOString(),
    },
    { onConflict: "race_weekend_id" },
  );

  if (upsertError) {
    const status = upsertError.code === "23503" ? 400 : 500;

    return NextResponse.json(
      { error: `Could not save result: ${upsertError.message}` },
      { status },
    );
  }

  return NextResponse.json({ ok: true });
}
