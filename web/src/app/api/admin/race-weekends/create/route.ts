import { NextResponse } from "next/server";

import type { Database, SessionType } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface CreateWeekendSessionPayload {
  type: SessionType;
  starts_at_utc: string;
}

interface CreateRaceWeekendPayload {
  admin_player_id: string;
  season: number;
  name: string;
  slug: string;
  location: string;
  is_sprint: boolean;
  lock_at_utc: string;
  sessions: CreateWeekendSessionPayload[];
}

type RaceWeekendInsert = Database["public"]["Tables"]["race_weekends"]["Insert"];
type SessionInsert = Database["public"]["Tables"]["sessions"]["Insert"];

type CreateWeekendInsertResponse = {
  data: { id: string } | null;
  error: {
    code?: string;
    message: string;
  } | null;
};

type RaceWeekendsInsertTable = {
  insert: (values: RaceWeekendInsert) => {
    select: (columns: string) => {
      single: () => Promise<CreateWeekendInsertResponse>;
    };
  };
};

type SessionsInsertResponse = {
  error: {
    code?: string;
    message: string;
  } | null;
};

type SessionsInsertTable = {
  insert: (values: SessionInsert[]) => Promise<SessionsInsertResponse>;
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

function normalizeSlug(rawValue: string): string {
  return rawValue
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getRequiredSessionTypes(isSprintWeekend: boolean): SessionType[] {
  return isSprintWeekend
    ? ["sprint_quali", "sprint_race", "quali", "race"]
    : ["quali", "race"];
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let payload: Partial<CreateRaceWeekendPayload>;

  try {
    payload = (await request.json()) as Partial<CreateRaceWeekendPayload>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (
    !isNonEmptyString(payload.admin_player_id) ||
    !Number.isInteger(payload.season) ||
    !isNonEmptyString(payload.name) ||
    !isNonEmptyString(payload.slug) ||
    !isNonEmptyString(payload.location) ||
    typeof payload.is_sprint !== "boolean" ||
    !isNonEmptyString(payload.lock_at_utc) ||
    !Array.isArray(payload.sessions)
  ) {
    return NextResponse.json({ error: "Missing required race weekend fields." }, { status: 400 });
  }

  const {
    admin_player_id: adminPlayerId,
    season,
    name,
    slug,
    location,
    is_sprint: isSprint,
    lock_at_utc: lockAtUtc,
    sessions,
  } = payload as CreateRaceWeekendPayload;

  if (season < 2026) {
    return NextResponse.json({ error: "Season must be 2026 or later." }, { status: 400 });
  }

  const lockAtDate = new Date(lockAtUtc);

  if (Number.isNaN(lockAtDate.getTime())) {
    return NextResponse.json({ error: "Invalid lock_at_utc timestamp." }, { status: 400 });
  }

  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    return NextResponse.json({ error: "Slug must include letters or numbers." }, { status: 400 });
  }

  const requiredSessionTypes = getRequiredSessionTypes(isSprint);
  const sessionTypeSet = new Set<SessionType>();
  const sessionRows: CreateWeekendSessionPayload[] = [];

  for (const session of sessions) {
    if (
      !session ||
      typeof session !== "object" ||
      !isSessionType((session as { type?: unknown }).type) ||
      !isNonEmptyString((session as { starts_at_utc?: unknown }).starts_at_utc)
    ) {
      return NextResponse.json({ error: "Invalid session payload." }, { status: 400 });
    }

    const parsedSessionDate = new Date(session.starts_at_utc);

    if (Number.isNaN(parsedSessionDate.getTime())) {
      return NextResponse.json({ error: `Invalid session timestamp for ${session.type}.` }, { status: 400 });
    }

    if (!requiredSessionTypes.includes(session.type)) {
      return NextResponse.json(
        { error: `${session.type} is not allowed for this weekend type.` },
        { status: 400 },
      );
    }

    if (sessionTypeSet.has(session.type)) {
      return NextResponse.json({ error: `Duplicate session type: ${session.type}.` }, { status: 400 });
    }

    sessionTypeSet.add(session.type);
    sessionRows.push({ type: session.type, starts_at_utc: parsedSessionDate.toISOString() });
  }

  for (const sessionType of requiredSessionTypes) {
    if (!sessionTypeSet.has(sessionType)) {
      return NextResponse.json(
        { error: `Missing required session: ${sessionType}.` },
        { status: 400 },
      );
    }
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
      { error: "Only admin players can create race weekends." },
      { status: 403 },
    );
  }

  const weekendInsert: RaceWeekendInsert = {
    season,
    name: name.trim(),
    slug: normalizedSlug,
    location: location.trim(),
    is_sprint: isSprint,
    lock_at_utc: lockAtDate.toISOString(),
    updated_at: new Date().toISOString(),
  };

  const raceWeekendsTable = supabase.from("race_weekends") as unknown as RaceWeekendsInsertTable;
  const weekendInsertResult = await raceWeekendsTable
    .insert(weekendInsert)
    .select("id")
    .single();

  if (weekendInsertResult.error) {
    const status = weekendInsertResult.error.code === "23505" ? 409 : 500;

    return NextResponse.json(
      { error: `Could not create race weekend: ${weekendInsertResult.error.message}` },
      { status },
    );
  }

  const raceWeekendId = weekendInsertResult.data?.id;

  if (!raceWeekendId) {
    return NextResponse.json({ error: "Race weekend created without an id." }, { status: 500 });
  }

  const nowIso = new Date().toISOString();
  const sessionInserts: SessionInsert[] = sessionRows.map((session) => ({
    race_weekend_id: raceWeekendId,
    type: session.type,
    starts_at_utc: session.starts_at_utc,
    updated_at: nowIso,
  }));

  const sessionsTable = supabase.from("sessions") as unknown as SessionsInsertTable;
  const sessionInsertResult = await sessionsTable.insert(sessionInserts);

  if (sessionInsertResult.error) {
    await supabase.from("race_weekends").delete().eq("id", raceWeekendId);

    return NextResponse.json(
      { error: `Race weekend created but sessions failed: ${sessionInsertResult.error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, race_weekend_id: raceWeekendId });
}
