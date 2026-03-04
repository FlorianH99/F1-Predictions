import type {
  Driver,
  LeaderboardTotal,
  PerRacePoints,
  Player,
  Prediction,
  RaceWeekend,
  Result,
  ScoreEntry,
  Session,
  WeekendWithSessions,
} from "@/lib/types";

export const players: Player[] = [
  { id: "player-flo", name: "Flo", is_admin: true },
  { id: "player-patrick", name: "Patrick", is_admin: false },
  { id: "player-jacques", name: "Jacques", is_admin: false },
  { id: "player-eva", name: "Eva", is_admin: false },
  { id: "player-max", name: "Max", is_admin: false },
];

export const drivers: Driver[] = [
  {
    id: "driver-ver",
    season: 2026,
    code: "VER",
    full_name: "Max Verstappen",
    display_name: "Verstappen",
    team_name: "Red Bull",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "driver-ham",
    season: 2026,
    code: "HAM",
    full_name: "Lewis Hamilton",
    display_name: "Hamilton",
    team_name: "Ferrari",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "driver-lec",
    season: 2026,
    code: "LEC",
    full_name: "Charles Leclerc",
    display_name: "Leclerc",
    team_name: "Ferrari",
    is_active: true,
    sort_order: 3,
  },
  {
    id: "driver-nor",
    season: 2026,
    code: "NOR",
    full_name: "Lando Norris",
    display_name: "Norris",
    team_name: "McLaren",
    is_active: true,
    sort_order: 4,
  },
  {
    id: "driver-pia",
    season: 2026,
    code: "PIA",
    full_name: "Oscar Piastri",
    display_name: "Piastri",
    team_name: "McLaren",
    is_active: true,
    sort_order: 5,
  },
  {
    id: "driver-rus",
    season: 2026,
    code: "RUS",
    full_name: "George Russell",
    display_name: "Russell",
    team_name: "Mercedes",
    is_active: true,
    sort_order: 6,
  },
  {
    id: "driver-alo",
    season: 2026,
    code: "ALO",
    full_name: "Fernando Alonso",
    display_name: "Alonso",
    team_name: "Aston Martin",
    is_active: true,
    sort_order: 7,
  },
  {
    id: "driver-sai",
    season: 2026,
    code: "SAI",
    full_name: "Carlos Sainz",
    display_name: "Sainz",
    team_name: "Williams",
    is_active: true,
    sort_order: 8,
  },
  {
    id: "driver-gas",
    season: 2026,
    code: "GAS",
    full_name: "Pierre Gasly",
    display_name: "Gasly",
    team_name: "Alpine",
    is_active: true,
    sort_order: 9,
  },
  {
    id: "driver-alb",
    season: 2026,
    code: "ALB",
    full_name: "Alexander Albon",
    display_name: "Albon",
    team_name: "Williams",
    is_active: true,
    sort_order: 10,
  },
];

export const raceWeekends: RaceWeekend[] = [
  {
    id: "rw-australia",
    season: 2026,
    name: "Australian Grand Prix",
    slug: "australian-grand-prix",
    location: "Melbourne",
    is_sprint: false,
    lock_at_utc: "2026-03-14T03:00:00Z",
  },
  {
    id: "rw-china",
    season: 2026,
    name: "Chinese Grand Prix",
    slug: "chinese-grand-prix",
    location: "Shanghai",
    is_sprint: true,
    lock_at_utc: "2026-03-21T03:30:00Z",
  },
  {
    id: "rw-japan",
    season: 2026,
    name: "Japanese Grand Prix",
    slug: "japanese-grand-prix",
    location: "Suzuka",
    is_sprint: false,
    lock_at_utc: "2026-04-04T03:00:00Z",
  },
  {
    id: "rw-bahrain",
    season: 2026,
    name: "Bahrain Grand Prix",
    slug: "bahrain-grand-prix",
    location: "Sakhir",
    is_sprint: false,
    lock_at_utc: "2026-04-11T13:00:00Z",
  },
  {
    id: "rw-saudi-arabia",
    season: 2026,
    name: "Saudi Arabian Grand Prix",
    slug: "saudi-arabian-grand-prix",
    location: "Jeddah",
    is_sprint: true,
    lock_at_utc: "2026-04-18T16:00:00Z",
  },
];

export const sessions: Session[] = [
  {
    id: "ses-aus-quali",
    race_weekend_id: "rw-australia",
    type: "quali",
    starts_at_utc: "2026-03-14T03:00:00Z",
  },
  {
    id: "ses-aus-race",
    race_weekend_id: "rw-australia",
    type: "race",
    starts_at_utc: "2026-03-15T04:00:00Z",
  },
  {
    id: "ses-chi-sq",
    race_weekend_id: "rw-china",
    type: "sprint_quali",
    starts_at_utc: "2026-03-21T03:30:00Z",
  },
  {
    id: "ses-chi-sr",
    race_weekend_id: "rw-china",
    type: "sprint_race",
    starts_at_utc: "2026-03-21T08:00:00Z",
  },
  {
    id: "ses-chi-quali",
    race_weekend_id: "rw-china",
    type: "quali",
    starts_at_utc: "2026-03-22T06:00:00Z",
  },
  {
    id: "ses-chi-race",
    race_weekend_id: "rw-china",
    type: "race",
    starts_at_utc: "2026-03-22T08:00:00Z",
  },
  {
    id: "ses-jpn-quali",
    race_weekend_id: "rw-japan",
    type: "quali",
    starts_at_utc: "2026-04-04T03:00:00Z",
  },
  {
    id: "ses-jpn-race",
    race_weekend_id: "rw-japan",
    type: "race",
    starts_at_utc: "2026-04-05T05:00:00Z",
  },
  {
    id: "ses-bhr-quali",
    race_weekend_id: "rw-bahrain",
    type: "quali",
    starts_at_utc: "2026-04-11T13:00:00Z",
  },
  {
    id: "ses-bhr-race",
    race_weekend_id: "rw-bahrain",
    type: "race",
    starts_at_utc: "2026-04-12T15:00:00Z",
  },
  {
    id: "ses-sau-sq",
    race_weekend_id: "rw-saudi-arabia",
    type: "sprint_quali",
    starts_at_utc: "2026-04-18T16:00:00Z",
  },
  {
    id: "ses-sau-sr",
    race_weekend_id: "rw-saudi-arabia",
    type: "sprint_race",
    starts_at_utc: "2026-04-19T14:00:00Z",
  },
  {
    id: "ses-sau-quali",
    race_weekend_id: "rw-saudi-arabia",
    type: "quali",
    starts_at_utc: "2026-04-19T17:00:00Z",
  },
  {
    id: "ses-sau-race",
    race_weekend_id: "rw-saudi-arabia",
    type: "race",
    starts_at_utc: "2026-04-20T18:00:00Z",
  },
];

export const predictions: Prediction[] = [
  {
    id: "pred-1",
    race_weekend_id: "rw-australia",
    player_id: "player-flo",
    quali_pole_driver_id: "driver-ver",
    race_p1_driver_id: "driver-ver",
    race_p2_driver_id: "driver-lec",
    race_p3_driver_id: "driver-nor",
    race_p10_driver_id: "driver-gas",
    sprint_quali_pole_driver_id: null,
    sprint_race_p1_driver_id: null,
  },
  {
    id: "pred-2",
    race_weekend_id: "rw-australia",
    player_id: "player-patrick",
    quali_pole_driver_id: "driver-lec",
    race_p1_driver_id: "driver-ham",
    race_p2_driver_id: "driver-ver",
    race_p3_driver_id: "driver-rus",
    race_p10_driver_id: "driver-gas",
    sprint_quali_pole_driver_id: null,
    sprint_race_p1_driver_id: null,
  },
  {
    id: "pred-3",
    race_weekend_id: "rw-australia",
    player_id: "player-jacques",
    quali_pole_driver_id: "driver-nor",
    race_p1_driver_id: "driver-nor",
    race_p2_driver_id: "driver-pia",
    race_p3_driver_id: "driver-ver",
    race_p10_driver_id: "driver-alb",
    sprint_quali_pole_driver_id: null,
    sprint_race_p1_driver_id: null,
  },
];

export const results: Result[] = [
  {
    id: "res-australia",
    race_weekend_id: "rw-australia",
    quali_pole_driver_id: "driver-ver",
    race_p1_driver_id: "driver-ver",
    race_p2_driver_id: "driver-lec",
    race_p3_driver_id: "driver-nor",
    race_p10_driver_id: "driver-gas",
    sprint_quali_pole_driver_id: null,
    sprint_race_p1_driver_id: null,
    entered_by_player_id: "player-flo",
  },
  {
    id: "res-china",
    race_weekend_id: "rw-china",
    quali_pole_driver_id: "driver-lec",
    race_p1_driver_id: "driver-lec",
    race_p2_driver_id: "driver-ver",
    race_p3_driver_id: "driver-ham",
    race_p10_driver_id: "driver-rus",
    sprint_quali_pole_driver_id: "driver-nor",
    sprint_race_p1_driver_id: "driver-nor",
    entered_by_player_id: "player-flo",
  },
];

export const scoreEntries: ScoreEntry[] = [
  {
    id: "score-aus-flo",
    race_weekend_id: "rw-australia",
    player_id: "player-flo",
    quali_pole_points: 1,
    race_p1_points: 1,
    race_p2_points: 1,
    race_p3_points: 1,
    race_p10_points: 2,
    sprint_quali_pole_points: 0,
    sprint_race_p1_points: 0,
    total_points: 6,
  },
  {
    id: "score-aus-pat",
    race_weekend_id: "rw-australia",
    player_id: "player-patrick",
    quali_pole_points: 0,
    race_p1_points: 0,
    race_p2_points: 0,
    race_p3_points: 0,
    race_p10_points: 2,
    sprint_quali_pole_points: 0,
    sprint_race_p1_points: 0,
    total_points: 2,
  },
  {
    id: "score-aus-jac",
    race_weekend_id: "rw-australia",
    player_id: "player-jacques",
    quali_pole_points: 0,
    race_p1_points: 0,
    race_p2_points: 0,
    race_p3_points: 0,
    race_p10_points: 0,
    sprint_quali_pole_points: 0,
    sprint_race_p1_points: 0,
    total_points: 0,
  },
  {
    id: "score-aus-eva",
    race_weekend_id: "rw-australia",
    player_id: "player-eva",
    quali_pole_points: 0,
    race_p1_points: 0,
    race_p2_points: 1,
    race_p3_points: 0,
    race_p10_points: 0,
    sprint_quali_pole_points: 0,
    sprint_race_p1_points: 0,
    total_points: 1,
  },
  {
    id: "score-aus-max",
    race_weekend_id: "rw-australia",
    player_id: "player-max",
    quali_pole_points: 1,
    race_p1_points: 1,
    race_p2_points: 0,
    race_p3_points: 1,
    race_p10_points: 0,
    sprint_quali_pole_points: 0,
    sprint_race_p1_points: 0,
    total_points: 3,
  },
  {
    id: "score-chi-flo",
    race_weekend_id: "rw-china",
    player_id: "player-flo",
    quali_pole_points: 1,
    race_p1_points: 0,
    race_p2_points: 1,
    race_p3_points: 0,
    race_p10_points: 0,
    sprint_quali_pole_points: 1,
    sprint_race_p1_points: 1,
    total_points: 4,
  },
  {
    id: "score-chi-pat",
    race_weekend_id: "rw-china",
    player_id: "player-patrick",
    quali_pole_points: 0,
    race_p1_points: 0,
    race_p2_points: 1,
    race_p3_points: 1,
    race_p10_points: 0,
    sprint_quali_pole_points: 0,
    sprint_race_p1_points: 0,
    total_points: 2,
  },
  {
    id: "score-chi-jac",
    race_weekend_id: "rw-china",
    player_id: "player-jacques",
    quali_pole_points: 1,
    race_p1_points: 1,
    race_p2_points: 0,
    race_p3_points: 0,
    race_p10_points: 0,
    sprint_quali_pole_points: 0,
    sprint_race_p1_points: 1,
    total_points: 3,
  },
  {
    id: "score-chi-eva",
    race_weekend_id: "rw-china",
    player_id: "player-eva",
    quali_pole_points: 0,
    race_p1_points: 0,
    race_p2_points: 0,
    race_p3_points: 0,
    race_p10_points: 0,
    sprint_quali_pole_points: 0,
    sprint_race_p1_points: 0,
    total_points: 0,
  },
  {
    id: "score-chi-max",
    race_weekend_id: "rw-china",
    player_id: "player-max",
    quali_pole_points: 0,
    race_p1_points: 1,
    race_p2_points: 0,
    race_p3_points: 1,
    race_p10_points: 0,
    sprint_quali_pole_points: 1,
    sprint_race_p1_points: 0,
    total_points: 3,
  },
];

const playerById = new Map(players.map((player) => [player.id, player]));
const weekendById = new Map(raceWeekends.map((weekend) => [weekend.id, weekend]));
const driverById = new Map(drivers.map((driver) => [driver.id, driver]));

export const sessionTypeLabel: Record<Session["type"], string> = {
  quali: "Qualifying",
  race: "Race",
  sprint_quali: "Sprint Qualifying",
  sprint_race: "Sprint Race",
};

export function getDriversForSeason(season: number): Driver[] {
  return drivers
    .filter((driver) => driver.season === season && driver.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getWeekendWithSessions(season: number): WeekendWithSessions[] {
  return raceWeekends
    .filter((weekend) => weekend.season === season)
    .map((weekend) => ({
      weekend,
      sessions: sessions
        .filter((session) => session.race_weekend_id === weekend.id)
        .sort((a, b) => Date.parse(a.starts_at_utc) - Date.parse(b.starts_at_utc)),
    }))
    .sort(
      (a, b) =>
        Date.parse(a.weekend.lock_at_utc) - Date.parse(b.weekend.lock_at_utc),
    );
}

export function getNextRaceWeekend(now: Date = new Date()): RaceWeekend | null {
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

export function getSessionCountForWeekend(raceWeekendId: string): number {
  return sessions.filter((session) => session.race_weekend_id === raceWeekendId).length;
}

export function getDriverDisplayName(driverId: string): string {
  return driverById.get(driverId)?.display_name ?? "Unknown";
}

export function getLeaderboardTotals(): LeaderboardTotal[] {
  const totalsByPlayer = new Map<string, number>();

  scoreEntries.forEach((entry) => {
    const current = totalsByPlayer.get(entry.player_id) ?? 0;
    totalsByPlayer.set(entry.player_id, current + entry.total_points);
  });

  return players
    .map((player) => ({
      player_id: player.id,
      player_name: player.name,
      season_points: totalsByPlayer.get(player.id) ?? 0,
    }))
    .sort((a, b) => b.season_points - a.season_points || a.player_name.localeCompare(b.player_name));
}

export function getPerRacePoints(): PerRacePoints[] {
  const grouped = new Map<string, ScoreEntry[]>();

  scoreEntries.forEach((entry) => {
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
        .sort((a, b) => b.total_points - a.total_points || a.player_name.localeCompare(b.player_name)),
    }))
    .sort(
      (a, b) =>
        Date.parse(weekendById.get(a.race_weekend_id)?.lock_at_utc ?? "0") -
        Date.parse(weekendById.get(b.race_weekend_id)?.lock_at_utc ?? "0"),
    );
}

export function getLockCountdown(now: Date = new Date()): {
  weekend: RaceWeekend | null;
  millisecondsUntilLock: number | null;
} {
  const nextWeekend = getNextRaceWeekend(now);

  if (!nextWeekend) {
    return { weekend: null, millisecondsUntilLock: null };
  }

  return {
    weekend: nextWeekend,
    millisecondsUntilLock: Date.parse(nextWeekend.lock_at_utc) - now.getTime(),
  };
}
