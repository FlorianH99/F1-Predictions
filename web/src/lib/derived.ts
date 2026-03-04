import type {
  LeaderboardTotal,
  PerRacePoints,
  Player,
  RaceWeekend,
  ScoreEntry,
  Session,
  SessionType,
  WeekendWithSessions,
} from "@/lib/types";

export const sessionTypeLabel: Record<SessionType, string> = {
  quali: "Qualifying",
  race: "Race",
  sprint_quali: "Sprint Qualifying",
  sprint_race: "Sprint Race",
};

export function getNextRaceWeekend(
  raceWeekends: RaceWeekend[],
  now: Date = new Date(),
): RaceWeekend | null {
  const next = [...raceWeekends]
    .sort((a, b) => Date.parse(a.lock_at_utc) - Date.parse(b.lock_at_utc))
    .find((weekend) => Date.parse(weekend.lock_at_utc) > now.getTime());

  return next ?? null;
}

export function isWeekendLocked(
  weekend: RaceWeekend,
  now: Date = new Date(),
): boolean {
  return Date.parse(weekend.lock_at_utc) <= now.getTime();
}

export function getSessionCountForWeekend(
  allSessions: Session[],
  raceWeekendId: string,
): number {
  return allSessions.filter((session) => session.race_weekend_id === raceWeekendId).length;
}

export function getWeekendWithSessions(
  raceWeekends: RaceWeekend[],
  allSessions: Session[],
  season: number,
): WeekendWithSessions[] {
  return raceWeekends
    .filter((weekend) => weekend.season === season)
    .map((weekend) => ({
      weekend,
      sessions: allSessions
        .filter((session) => session.race_weekend_id === weekend.id)
        .sort((a, b) => Date.parse(a.starts_at_utc) - Date.parse(b.starts_at_utc)),
    }))
    .sort(
      (a, b) =>
        Date.parse(a.weekend.lock_at_utc) - Date.parse(b.weekend.lock_at_utc),
    );
}

export function getLeaderboardTotals(
  allPlayers: Player[],
  allScoreEntries: ScoreEntry[],
): LeaderboardTotal[] {
  const totalsByPlayer = new Map<string, number>();

  allScoreEntries.forEach((entry) => {
    const current = totalsByPlayer.get(entry.player_id) ?? 0;
    totalsByPlayer.set(entry.player_id, current + entry.total_points);
  });

  return allPlayers
    .map((player) => ({
      player_id: player.id,
      player_name: player.name,
      season_points: totalsByPlayer.get(player.id) ?? 0,
    }))
    .sort(
      (a, b) =>
        b.season_points - a.season_points ||
        a.player_name.localeCompare(b.player_name),
    );
}

export function getPerRacePoints(
  allScoreEntries: ScoreEntry[],
  raceWeekends: RaceWeekend[],
  allPlayers: Player[],
): PerRacePoints[] {
  const grouped = new Map<string, ScoreEntry[]>();
  const weekendById = new Map(raceWeekends.map((weekend) => [weekend.id, weekend]));
  const playerById = new Map(allPlayers.map((player) => [player.id, player]));

  allScoreEntries.forEach((entry) => {
    const items = grouped.get(entry.race_weekend_id) ?? [];
    items.push(entry);
    grouped.set(entry.race_weekend_id, items);
  });

  return Array.from(grouped.entries())
    .map(([raceWeekendId, entries]) => ({
      race_weekend_id: raceWeekendId,
      race_name: weekendById.get(raceWeekendId)?.name ?? "Unknown race",
      entries: entries
        .map((entry) => ({
          player_id: entry.player_id,
          player_name: playerById.get(entry.player_id)?.name ?? "Unknown player",
          total_points: entry.total_points,
        }))
        .sort(
          (a, b) =>
            b.total_points - a.total_points ||
            a.player_name.localeCompare(b.player_name),
        ),
    }))
    .sort(
      (a, b) =>
        Date.parse(weekendById.get(a.race_weekend_id)?.lock_at_utc ?? "0") -
        Date.parse(weekendById.get(b.race_weekend_id)?.lock_at_utc ?? "0"),
    );
}

export function getLockCountdown(
  raceWeekends: RaceWeekend[],
  now: Date = new Date(),
): {
  weekend: RaceWeekend | null;
  millisecondsUntilLock: number | null;
} {
  const nextWeekend = getNextRaceWeekend(raceWeekends, now);

  if (!nextWeekend) {
    return { weekend: null, millisecondsUntilLock: null };
  }

  return {
    weekend: nextWeekend,
    millisecondsUntilLock: Date.parse(nextWeekend.lock_at_utc) - now.getTime(),
  };
}
