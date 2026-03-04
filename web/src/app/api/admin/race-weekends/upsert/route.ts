import { NextResponse } from "next/server";

import type { Database } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface UpsertRaceWeekendPayload {
  admin_player_id: string;
  race_weekend_id: string;
  season: number;
  name: string;
  slug: string;
  location: string;
  is_sprint: boolean;
  lock_at_utc: string;
}

type RaceWeekendUpdate = Database["public"]["Tables"]["race_weekends"]["Update"];

type RaceWeekendUpdateResponse = {
  error: {
    code?: string;
    message: string;
  } | null;
};

type RaceWeekendsUpdateTable = {
  update: (values: RaceWeekendUpdate) => {
    eq: (column: "id", value: string) => Promise<RaceWeekendUpdateResponse>;
  };
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let payload: Partial<UpsertRaceWeekendPayload>;

  try {
    payload = (await request.json()) as Partial<UpsertRaceWeekendPayload>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (
    !isNonEmptyString(payload.admin_player_id) ||
    !isNonEmptyString(payload.race_weekend_id) ||
    !Number.isInteger(payload.season) ||
    !isNonEmptyString(payload.name) ||
    !isNonEmptyString(payload.slug) ||
    !isNonEmptyString(payload.location) ||
    typeof payload.is_sprint !== "boolean" ||
    !isNonEmptyString(payload.lock_at_utc)
  ) {
    return NextResponse.json({ error: "Missing required race weekend fields." }, { status: 400 });
  }

  const {
    admin_player_id: adminPlayerId,
    race_weekend_id: raceWeekendId,
    season,
    name,
    slug,
    location,
    is_sprint: isSprint,
    lock_at_utc: lockAtUtc,
  } = payload as UpsertRaceWeekendPayload;

  if (season < 2026) {
    return NextResponse.json({ error: "Season must be 2026 or later." }, { status: 400 });
  }

  const parsedLockDate = new Date(lockAtUtc);

  if (Number.isNaN(parsedLockDate.getTime())) {
    return NextResponse.json({ error: "Invalid lock_at_utc timestamp." }, { status: 400 });
  }

  const adminResult = await supabase
    .from("players")
    .select("id,is_admin")
    .eq("id", adminPlayerId)
    .maybeSingle();

  const adminRow = adminResult.data as { id: string; is_admin: boolean } | null;

  if (adminResult.error) {
    return NextResponse.json(
      { error: `Could not validate player: ${adminResult.error.message}` },
      { status: 500 },
    );
  }

  if (!adminRow?.is_admin) {
    return NextResponse.json(
      { error: "Only admin players can manage race weekends." },
      { status: 403 },
    );
  }

  const raceWeekendsTable = supabase.from("race_weekends") as unknown as RaceWeekendsUpdateTable;

  const { error: updateError } = await raceWeekendsTable
    .update({
      season,
      name: name.trim(),
      slug: slug.trim(),
      location: location.trim(),
      is_sprint: isSprint,
      lock_at_utc: parsedLockDate.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", raceWeekendId);

  if (updateError) {
    const status = updateError.code === "23505" ? 409 : 500;

    return NextResponse.json(
      { error: `Could not update race weekend: ${updateError.message}` },
      { status },
    );
  }

  if (!isSprint) {
    const pruneResult = await supabase
      .from("sessions")
      .delete()
      .eq("race_weekend_id", raceWeekendId)
      .in("type", ["sprint_quali", "sprint_race"]);

    if (pruneResult.error) {
      return NextResponse.json(
        {
          error: `Race weekend updated, but sprint sessions could not be pruned: ${pruneResult.error.message}`,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
