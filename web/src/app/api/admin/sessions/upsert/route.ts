import { NextResponse } from "next/server";

import type { Database, SessionType } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface UpsertSessionPayload {
  admin_player_id: string;
  race_weekend_id: string;
  type: SessionType;
  starts_at_utc: string;
}

type SessionInsert = Database["public"]["Tables"]["sessions"]["Insert"];

type SessionUpsertResponse = {
  error: {
    code?: string;
    message: string;
  } | null;
};

type SessionsUpsertTable = {
  upsert: (
    values: SessionInsert,
    options: { onConflict: string },
  ) => Promise<SessionUpsertResponse>;
};

const validSessionTypes = new Set<SessionType>([
  "quali",
  "race",
  "sprint_quali",
  "sprint_race",
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSessionType(value: unknown): value is SessionType {
  return typeof value === "string" && validSessionTypes.has(value as SessionType);
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let payload: Partial<UpsertSessionPayload>;

  try {
    payload = (await request.json()) as Partial<UpsertSessionPayload>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (
    !isNonEmptyString(payload.admin_player_id) ||
    !isNonEmptyString(payload.race_weekend_id) ||
    !isSessionType(payload.type) ||
    !isNonEmptyString(payload.starts_at_utc)
  ) {
    return NextResponse.json({ error: "Missing required session fields." }, { status: 400 });
  }

  const startsAtDate = new Date(payload.starts_at_utc);

  if (Number.isNaN(startsAtDate.getTime())) {
    return NextResponse.json({ error: "Invalid starts_at_utc timestamp." }, { status: 400 });
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
    return NextResponse.json(
      { error: "Only admin players can manage sessions." },
      { status: 403 },
    );
  }

  const weekendResult = await supabase
    .from("race_weekends")
    .select("id")
    .eq("id", payload.race_weekend_id)
    .maybeSingle();

  if (weekendResult.error) {
    return NextResponse.json(
      { error: `Could not validate race weekend: ${weekendResult.error.message}` },
      { status: 500 },
    );
  }

  if (!weekendResult.data) {
    return NextResponse.json({ error: "Race weekend not found." }, { status: 404 });
  }

  const sessionsTable = supabase.from("sessions") as unknown as SessionsUpsertTable;

  const { error: upsertError } = await sessionsTable.upsert(
    {
      race_weekend_id: payload.race_weekend_id,
      type: payload.type,
      starts_at_utc: startsAtDate.toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "race_weekend_id,type" },
  );

  if (upsertError) {
    const status = upsertError.code === "23503" ? 400 : 500;

    return NextResponse.json(
      { error: `Could not save session: ${upsertError.message}` },
      { status },
    );
  }

  return NextResponse.json({ ok: true });
}
