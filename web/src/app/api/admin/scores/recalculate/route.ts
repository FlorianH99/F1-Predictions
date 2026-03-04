import { NextResponse } from "next/server";

import type { Database } from "@/lib/supabase/database.types";
import { buildScoreEntryInsert } from "@/lib/scoring";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RecalculateScoresPayload {
  admin_player_id: string;
  race_weekend_id?: string;
}

type PredictionRow = Database["public"]["Tables"]["predictions"]["Row"];
type ResultRow = Database["public"]["Tables"]["results"]["Row"];
type ScoreEntryInsert = Database["public"]["Tables"]["score_entries"]["Insert"];

type ScoreEntriesUpsertResponse = {
  error: {
    code?: string;
    message: string;
  } | null;
};

type ScoreEntriesUpsertTable = {
  upsert: (
    values: ScoreEntryInsert[],
    options: { onConflict: string },
  ) => Promise<ScoreEntriesUpsertResponse>;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let payload: Partial<RecalculateScoresPayload>;

  try {
    payload = (await request.json()) as Partial<RecalculateScoresPayload>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (!isNonEmptyString(payload.admin_player_id)) {
    return NextResponse.json({ error: "Missing admin_player_id." }, { status: 400 });
  }

  const adminResult = await supabase
    .from("players")
    .select("id,is_admin")
    .eq("id", payload.admin_player_id)
    .maybeSingle();

  const adminRow = adminResult.data as { id: string; is_admin: boolean } | null;

  if (adminResult.error) {
    return NextResponse.json(
      { error: `Could not validate player: ${adminResult.error.message}` },
      { status: 500 },
    );
  }

  if (!adminRow?.is_admin) {
    return NextResponse.json({ error: "Only admin players can recalculate scores." }, { status: 403 });
  }

  let resultsQuery = supabase.from("results").select("*");

  if (isNonEmptyString(payload.race_weekend_id)) {
    resultsQuery = resultsQuery.eq("race_weekend_id", payload.race_weekend_id);
  }

  const resultsResult = await resultsQuery;

  if (resultsResult.error) {
    return NextResponse.json(
      { error: `Could not read results: ${resultsResult.error.message}` },
      { status: 500 },
    );
  }

  const results = (resultsResult.data ?? []) as ResultRow[];

  if (results.length === 0) {
    return NextResponse.json(
      { error: "No results found for recalculation." },
      { status: 400 },
    );
  }

  const weekendIds = Array.from(new Set(results.map((item) => item.race_weekend_id)));

  const weekendsResult = await supabase
    .from("race_weekends")
    .select("id,is_sprint")
    .in("id", weekendIds);

  if (weekendsResult.error) {
    return NextResponse.json(
      { error: `Could not read race weekends: ${weekendsResult.error.message}` },
      { status: 500 },
    );
  }

  const weekends = (weekendsResult.data ?? []) as Array<{ id: string; is_sprint: boolean }>;

  const predictionsResult = await supabase
    .from("predictions")
    .select("*")
    .in("race_weekend_id", weekendIds);

  if (predictionsResult.error) {
    return NextResponse.json(
      { error: `Could not read predictions: ${predictionsResult.error.message}` },
      { status: 500 },
    );
  }

  const predictions = (predictionsResult.data ?? []) as PredictionRow[];

  const weekendById = new Map(weekends.map((weekend) => [weekend.id, weekend]));
  const resultByWeekendId = new Map(results.map((result) => [result.race_weekend_id, result]));

  const inserts: ScoreEntryInsert[] = [];

  for (const prediction of predictions) {
    const weekend = weekendById.get(prediction.race_weekend_id);
    const result = resultByWeekendId.get(prediction.race_weekend_id);

    if (!weekend || !result) {
      continue;
    }

    inserts.push(buildScoreEntryInsert(prediction, result, weekend));
  }

  if (inserts.length === 0) {
    return NextResponse.json(
      { error: "No score entries could be generated." },
      { status: 400 },
    );
  }

  const scoreEntriesTable = supabase.from("score_entries") as unknown as ScoreEntriesUpsertTable;

  const { error: upsertError } = await scoreEntriesTable.upsert(inserts, {
    onConflict: "race_weekend_id,player_id",
  });

  if (upsertError) {
    return NextResponse.json(
      { error: `Could not upsert score entries: ${upsertError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    recalculated_weekends: weekendIds.length,
    recalculated_entries: inserts.length,
  });
}
