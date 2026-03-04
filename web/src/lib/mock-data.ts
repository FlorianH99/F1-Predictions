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
  { id: "driver-gas", season: 2026, code: "GAS", full_name: "Pierre Gasly", display_name: "Gasly", team_name: "Alpine", is_active: true, sort_order: 1 },
  { id: "driver-col", season: 2026, code: "COL", full_name: "Franco Colapinto", display_name: "Colapinto", team_name: "Alpine", is_active: true, sort_order: 2 },
  { id: "driver-alo", season: 2026, code: "ALO", full_name: "Fernando Alonso", display_name: "Alonso", team_name: "Aston Martin", is_active: true, sort_order: 3 },
  { id: "driver-str", season: 2026, code: "STR", full_name: "Lance Stroll", display_name: "Stroll", team_name: "Aston Martin", is_active: true, sort_order: 4 },
  { id: "driver-hul", season: 2026, code: "HUL", full_name: "Nico Hulkenberg", display_name: "Hulkenberg", team_name: "Audi", is_active: true, sort_order: 5 },
  { id: "driver-bor", season: 2026, code: "BOR", full_name: "Gabriel Bortoleto", display_name: "Bortoleto", team_name: "Audi", is_active: true, sort_order: 6 },
  { id: "driver-per", season: 2026, code: "PER", full_name: "Sergio Perez", display_name: "Perez", team_name: "Cadillac", is_active: true, sort_order: 7 },
  { id: "driver-bot", season: 2026, code: "BOT", full_name: "Valtteri Bottas", display_name: "Bottas", team_name: "Cadillac", is_active: true, sort_order: 8 },
  { id: "driver-lec", season: 2026, code: "LEC", full_name: "Charles Leclerc", display_name: "Leclerc", team_name: "Ferrari", is_active: true, sort_order: 9 },
  { id: "driver-ham", season: 2026, code: "HAM", full_name: "Lewis Hamilton", display_name: "Hamilton", team_name: "Ferrari", is_active: true, sort_order: 10 },
  { id: "driver-oco", season: 2026, code: "OCO", full_name: "Esteban Ocon", display_name: "Ocon", team_name: "Haas", is_active: true, sort_order: 11 },
  { id: "driver-bea", season: 2026, code: "BEA", full_name: "Oliver Bearman", display_name: "Bearman", team_name: "Haas", is_active: true, sort_order: 12 },
  { id: "driver-nor", season: 2026, code: "NOR", full_name: "Lando Norris", display_name: "Norris", team_name: "McLaren", is_active: true, sort_order: 13 },
  { id: "driver-pia", season: 2026, code: "PIA", full_name: "Oscar Piastri", display_name: "Piastri", team_name: "McLaren", is_active: true, sort_order: 14 },
  { id: "driver-rus", season: 2026, code: "RUS", full_name: "George Russell", display_name: "Russell", team_name: "Mercedes", is_active: true, sort_order: 15 },
  { id: "driver-ant", season: 2026, code: "ANT", full_name: "Kimi Antonelli", display_name: "Antonelli", team_name: "Mercedes", is_active: true, sort_order: 16 },
  { id: "driver-law", season: 2026, code: "LAW", full_name: "Liam Lawson", display_name: "Lawson", team_name: "Racing Bulls", is_active: true, sort_order: 17 },
  { id: "driver-lin", season: 2026, code: "LIN", full_name: "Arvid Lindblad", display_name: "Lindblad", team_name: "Racing Bulls", is_active: true, sort_order: 18 },
  { id: "driver-ver", season: 2026, code: "VER", full_name: "Max Verstappen", display_name: "Verstappen", team_name: "Red Bull", is_active: true, sort_order: 19 },
  { id: "driver-had", season: 2026, code: "HAD", full_name: "Isack Hadjar", display_name: "Hadjar", team_name: "Red Bull", is_active: true, sort_order: 20 },
  { id: "driver-sai", season: 2026, code: "SAI", full_name: "Carlos Sainz", display_name: "Sainz", team_name: "Williams", is_active: true, sort_order: 21 },
  { id: "driver-alb", season: 2026, code: "ALB", full_name: "Alexander Albon", display_name: "Albon", team_name: "Williams", is_active: true, sort_order: 22 },
];

export const raceWeekends: RaceWeekend[] = [
  { id: "rw-australia", season: 2026, name: "Australian Grand Prix", slug: "australia", location: "Melbourne", is_sprint: false, lock_at_utc: "2026-03-07T05:00:00Z" },
  { id: "rw-china", season: 2026, name: "Chinese Grand Prix", slug: "china", location: "Shanghai", is_sprint: true, lock_at_utc: "2026-03-13T07:30:00Z" },
  { id: "rw-japan", season: 2026, name: "Japanese Grand Prix", slug: "japan", location: "Suzuka", is_sprint: false, lock_at_utc: "2026-03-28T06:00:00Z" },
  { id: "rw-bahrain", season: 2026, name: "Bahrain Grand Prix", slug: "bahrain", location: "Sakhir", is_sprint: false, lock_at_utc: "2026-04-11T16:00:00Z" },
  { id: "rw-saudi-arabia", season: 2026, name: "Saudi Arabian Grand Prix", slug: "saudi-arabia", location: "Jeddah", is_sprint: false, lock_at_utc: "2026-04-18T17:00:00Z" },
  { id: "rw-miami", season: 2026, name: "Miami Grand Prix", slug: "miami", location: "Miami", is_sprint: true, lock_at_utc: "2026-05-01T20:30:00Z" },
  { id: "rw-canada", season: 2026, name: "Canadian Grand Prix", slug: "canada", location: "Montreal", is_sprint: true, lock_at_utc: "2026-05-22T20:30:00Z" },
  { id: "rw-monaco", season: 2026, name: "Monaco Grand Prix", slug: "monaco", location: "Monte Carlo", is_sprint: false, lock_at_utc: "2026-06-06T14:00:00Z" },
  { id: "rw-barcelona-catalunya", season: 2026, name: "Barcelona-Catalunya Grand Prix", slug: "barcelona-catalunya", location: "Barcelona", is_sprint: false, lock_at_utc: "2026-06-13T14:00:00Z" },
  { id: "rw-austria", season: 2026, name: "Austrian Grand Prix", slug: "austria", location: "Spielberg", is_sprint: false, lock_at_utc: "2026-06-27T14:00:00Z" },
  { id: "rw-great-britain", season: 2026, name: "British Grand Prix", slug: "great-britain", location: "Silverstone", is_sprint: true, lock_at_utc: "2026-07-03T15:30:00Z" },
  { id: "rw-belgium", season: 2026, name: "Belgian Grand Prix", slug: "belgium", location: "Spa-Francorchamps", is_sprint: false, lock_at_utc: "2026-07-18T14:00:00Z" },
  { id: "rw-hungary", season: 2026, name: "Hungarian Grand Prix", slug: "hungary", location: "Budapest", is_sprint: false, lock_at_utc: "2026-07-25T14:00:00Z" },
  { id: "rw-netherlands", season: 2026, name: "Dutch Grand Prix", slug: "netherlands", location: "Zandvoort", is_sprint: true, lock_at_utc: "2026-08-21T14:30:00Z" },
  { id: "rw-italy", season: 2026, name: "Italian Grand Prix", slug: "italy", location: "Monza", is_sprint: false, lock_at_utc: "2026-09-05T14:00:00Z" },
  { id: "rw-madrid", season: 2026, name: "Spanish Grand Prix", slug: "madrid", location: "Madrid", is_sprint: false, lock_at_utc: "2026-09-12T14:00:00Z" },
  { id: "rw-azerbaijan", season: 2026, name: "Azerbaijan Grand Prix", slug: "azerbaijan", location: "Baku", is_sprint: false, lock_at_utc: "2026-09-25T12:00:00Z" },
  { id: "rw-singapore", season: 2026, name: "Singapore Grand Prix", slug: "singapore", location: "Singapore", is_sprint: true, lock_at_utc: "2026-10-09T12:30:00Z" },
  { id: "rw-united-states", season: 2026, name: "United States Grand Prix", slug: "united-states", location: "Austin", is_sprint: false, lock_at_utc: "2026-10-24T21:00:00Z" },
  { id: "rw-mexico", season: 2026, name: "Mexico City Grand Prix", slug: "mexico", location: "Mexico City", is_sprint: false, lock_at_utc: "2026-10-31T21:00:00Z" },
  { id: "rw-brazil", season: 2026, name: "Sao Paulo Grand Prix", slug: "brazil", location: "Sao Paulo", is_sprint: false, lock_at_utc: "2026-11-07T18:00:00Z" },
  { id: "rw-las-vegas", season: 2026, name: "Las Vegas Grand Prix", slug: "las-vegas", location: "Las Vegas", is_sprint: false, lock_at_utc: "2026-11-21T04:00:00Z" },
  { id: "rw-qatar", season: 2026, name: "Qatar Grand Prix", slug: "qatar", location: "Lusail", is_sprint: false, lock_at_utc: "2026-11-28T18:00:00Z" },
  { id: "rw-abu-dhabi", season: 2026, name: "Abu Dhabi Grand Prix", slug: "abu-dhabi", location: "Abu Dhabi", is_sprint: false, lock_at_utc: "2026-12-05T14:00:00Z" },
];

export const sessions: Session[] = [
  { id: "ses-australia-quali", race_weekend_id: "rw-australia", type: "quali", starts_at_utc: "2026-03-07T05:00:00Z" },
  { id: "ses-australia-race", race_weekend_id: "rw-australia", type: "race", starts_at_utc: "2026-03-08T04:00:00Z" },
  { id: "ses-china-sprint-quali", race_weekend_id: "rw-china", type: "sprint_quali", starts_at_utc: "2026-03-13T07:30:00Z" },
  { id: "ses-china-sprint-race", race_weekend_id: "rw-china", type: "sprint_race", starts_at_utc: "2026-03-14T03:00:00Z" },
  { id: "ses-china-quali", race_weekend_id: "rw-china", type: "quali", starts_at_utc: "2026-03-14T07:00:00Z" },
  { id: "ses-china-race", race_weekend_id: "rw-china", type: "race", starts_at_utc: "2026-03-15T07:00:00Z" },
  { id: "ses-japan-quali", race_weekend_id: "rw-japan", type: "quali", starts_at_utc: "2026-03-28T06:00:00Z" },
  { id: "ses-japan-race", race_weekend_id: "rw-japan", type: "race", starts_at_utc: "2026-03-29T05:00:00Z" },
  { id: "ses-bahrain-quali", race_weekend_id: "rw-bahrain", type: "quali", starts_at_utc: "2026-04-11T16:00:00Z" },
  { id: "ses-bahrain-race", race_weekend_id: "rw-bahrain", type: "race", starts_at_utc: "2026-04-12T15:00:00Z" },
  { id: "ses-saudi-arabia-quali", race_weekend_id: "rw-saudi-arabia", type: "quali", starts_at_utc: "2026-04-18T17:00:00Z" },
  { id: "ses-saudi-arabia-race", race_weekend_id: "rw-saudi-arabia", type: "race", starts_at_utc: "2026-04-19T17:00:00Z" },
  { id: "ses-miami-sprint-quali", race_weekend_id: "rw-miami", type: "sprint_quali", starts_at_utc: "2026-05-01T20:30:00Z" },
  { id: "ses-miami-sprint-race", race_weekend_id: "rw-miami", type: "sprint_race", starts_at_utc: "2026-05-02T16:00:00Z" },
  { id: "ses-miami-quali", race_weekend_id: "rw-miami", type: "quali", starts_at_utc: "2026-05-02T20:00:00Z" },
  { id: "ses-miami-race", race_weekend_id: "rw-miami", type: "race", starts_at_utc: "2026-05-03T20:00:00Z" },
  { id: "ses-canada-sprint-quali", race_weekend_id: "rw-canada", type: "sprint_quali", starts_at_utc: "2026-05-22T20:30:00Z" },
  { id: "ses-canada-sprint-race", race_weekend_id: "rw-canada", type: "sprint_race", starts_at_utc: "2026-05-23T16:00:00Z" },
  { id: "ses-canada-quali", race_weekend_id: "rw-canada", type: "quali", starts_at_utc: "2026-05-23T20:00:00Z" },
  { id: "ses-canada-race", race_weekend_id: "rw-canada", type: "race", starts_at_utc: "2026-05-24T20:00:00Z" },
  { id: "ses-monaco-quali", race_weekend_id: "rw-monaco", type: "quali", starts_at_utc: "2026-06-06T14:00:00Z" },
  { id: "ses-monaco-race", race_weekend_id: "rw-monaco", type: "race", starts_at_utc: "2026-06-07T13:00:00Z" },
  { id: "ses-barcelona-catalunya-quali", race_weekend_id: "rw-barcelona-catalunya", type: "quali", starts_at_utc: "2026-06-13T14:00:00Z" },
  { id: "ses-barcelona-catalunya-race", race_weekend_id: "rw-barcelona-catalunya", type: "race", starts_at_utc: "2026-06-14T13:00:00Z" },
  { id: "ses-austria-quali", race_weekend_id: "rw-austria", type: "quali", starts_at_utc: "2026-06-27T14:00:00Z" },
  { id: "ses-austria-race", race_weekend_id: "rw-austria", type: "race", starts_at_utc: "2026-06-28T13:00:00Z" },
  { id: "ses-great-britain-sprint-quali", race_weekend_id: "rw-great-britain", type: "sprint_quali", starts_at_utc: "2026-07-03T15:30:00Z" },
  { id: "ses-great-britain-sprint-race", race_weekend_id: "rw-great-britain", type: "sprint_race", starts_at_utc: "2026-07-04T11:00:00Z" },
  { id: "ses-great-britain-quali", race_weekend_id: "rw-great-britain", type: "quali", starts_at_utc: "2026-07-04T15:00:00Z" },
  { id: "ses-great-britain-race", race_weekend_id: "rw-great-britain", type: "race", starts_at_utc: "2026-07-05T14:00:00Z" },
  { id: "ses-belgium-quali", race_weekend_id: "rw-belgium", type: "quali", starts_at_utc: "2026-07-18T14:00:00Z" },
  { id: "ses-belgium-race", race_weekend_id: "rw-belgium", type: "race", starts_at_utc: "2026-07-19T13:00:00Z" },
  { id: "ses-hungary-quali", race_weekend_id: "rw-hungary", type: "quali", starts_at_utc: "2026-07-25T14:00:00Z" },
  { id: "ses-hungary-race", race_weekend_id: "rw-hungary", type: "race", starts_at_utc: "2026-07-26T13:00:00Z" },
  { id: "ses-netherlands-sprint-quali", race_weekend_id: "rw-netherlands", type: "sprint_quali", starts_at_utc: "2026-08-21T14:30:00Z" },
  { id: "ses-netherlands-sprint-race", race_weekend_id: "rw-netherlands", type: "sprint_race", starts_at_utc: "2026-08-22T10:00:00Z" },
  { id: "ses-netherlands-quali", race_weekend_id: "rw-netherlands", type: "quali", starts_at_utc: "2026-08-22T14:00:00Z" },
  { id: "ses-netherlands-race", race_weekend_id: "rw-netherlands", type: "race", starts_at_utc: "2026-08-23T13:00:00Z" },
  { id: "ses-italy-quali", race_weekend_id: "rw-italy", type: "quali", starts_at_utc: "2026-09-05T14:00:00Z" },
  { id: "ses-italy-race", race_weekend_id: "rw-italy", type: "race", starts_at_utc: "2026-09-06T13:00:00Z" },
  { id: "ses-madrid-quali", race_weekend_id: "rw-madrid", type: "quali", starts_at_utc: "2026-09-12T14:00:00Z" },
  { id: "ses-madrid-race", race_weekend_id: "rw-madrid", type: "race", starts_at_utc: "2026-09-13T13:00:00Z" },
  { id: "ses-azerbaijan-quali", race_weekend_id: "rw-azerbaijan", type: "quali", starts_at_utc: "2026-09-25T12:00:00Z" },
  { id: "ses-azerbaijan-race", race_weekend_id: "rw-azerbaijan", type: "race", starts_at_utc: "2026-09-26T11:00:00Z" },
  { id: "ses-singapore-sprint-quali", race_weekend_id: "rw-singapore", type: "sprint_quali", starts_at_utc: "2026-10-09T12:30:00Z" },
  { id: "ses-singapore-sprint-race", race_weekend_id: "rw-singapore", type: "sprint_race", starts_at_utc: "2026-10-10T09:00:00Z" },
  { id: "ses-singapore-quali", race_weekend_id: "rw-singapore", type: "quali", starts_at_utc: "2026-10-10T13:00:00Z" },
  { id: "ses-singapore-race", race_weekend_id: "rw-singapore", type: "race", starts_at_utc: "2026-10-11T12:00:00Z" },
  { id: "ses-united-states-quali", race_weekend_id: "rw-united-states", type: "quali", starts_at_utc: "2026-10-24T21:00:00Z" },
  { id: "ses-united-states-race", race_weekend_id: "rw-united-states", type: "race", starts_at_utc: "2026-10-25T20:00:00Z" },
  { id: "ses-mexico-quali", race_weekend_id: "rw-mexico", type: "quali", starts_at_utc: "2026-10-31T21:00:00Z" },
  { id: "ses-mexico-race", race_weekend_id: "rw-mexico", type: "race", starts_at_utc: "2026-11-01T20:00:00Z" },
  { id: "ses-brazil-quali", race_weekend_id: "rw-brazil", type: "quali", starts_at_utc: "2026-11-07T18:00:00Z" },
  { id: "ses-brazil-race", race_weekend_id: "rw-brazil", type: "race", starts_at_utc: "2026-11-08T17:00:00Z" },
  { id: "ses-las-vegas-quali", race_weekend_id: "rw-las-vegas", type: "quali", starts_at_utc: "2026-11-21T04:00:00Z" },
  { id: "ses-las-vegas-race", race_weekend_id: "rw-las-vegas", type: "race", starts_at_utc: "2026-11-22T04:00:00Z" },
  { id: "ses-qatar-quali", race_weekend_id: "rw-qatar", type: "quali", starts_at_utc: "2026-11-28T18:00:00Z" },
  { id: "ses-qatar-race", race_weekend_id: "rw-qatar", type: "race", starts_at_utc: "2026-11-29T16:00:00Z" },
  { id: "ses-abu-dhabi-quali", race_weekend_id: "rw-abu-dhabi", type: "quali", starts_at_utc: "2026-12-05T14:00:00Z" },
  { id: "ses-abu-dhabi-race", race_weekend_id: "rw-abu-dhabi", type: "race", starts_at_utc: "2026-12-06T13:00:00Z" },
];

export const predictions: Prediction[] = [
  {
    id: "pred-1",
    race_weekend_id: "rw-australia",
    player_id: "player-flo",
    quali_pole_driver_id: "driver-ver",
    race_p1_driver_id: "driver-nor",
    race_p2_driver_id: "driver-lec",
    race_p3_driver_id: "driver-pia",
    race_p10_driver_id: "driver-gas",
    sprint_quali_pole_driver_id: null,
    sprint_race_p1_driver_id: null,
  },
  {
    id: "pred-2",
    race_weekend_id: "rw-australia",
    player_id: "player-patrick",
    quali_pole_driver_id: "driver-lec",
    race_p1_driver_id: "driver-ver",
    race_p2_driver_id: "driver-nor",
    race_p3_driver_id: "driver-rus",
    race_p10_driver_id: "driver-gas",
    sprint_quali_pole_driver_id: null,
    sprint_race_p1_driver_id: null,
  },
  {
    id: "pred-3",
    race_weekend_id: "rw-china",
    player_id: "player-jacques",
    quali_pole_driver_id: "driver-nor",
    race_p1_driver_id: "driver-ver",
    race_p2_driver_id: "driver-pia",
    race_p3_driver_id: "driver-rus",
    race_p10_driver_id: "driver-alb",
    sprint_quali_pole_driver_id: "driver-nor",
    sprint_race_p1_driver_id: "driver-ver",
  },
];

export const results: Result[] = [
  {
    id: "res-australia",
    race_weekend_id: "rw-australia",
    quali_pole_driver_id: "driver-ver",
    race_p1_driver_id: "driver-nor",
    race_p2_driver_id: "driver-lec",
    race_p3_driver_id: "driver-pia",
    race_p10_driver_id: "driver-gas",
    sprint_quali_pole_driver_id: null,
    sprint_race_p1_driver_id: null,
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
];

const playerById = new Map(players.map((player) => [player.id, player]));
const weekendById = new Map(raceWeekends.map((weekend) => [weekend.id, weekend]));

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
    .sort(
      (a, b) => b.season_points - a.season_points || a.player_name.localeCompare(b.player_name),
    );
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

export function getWeekendWithSessions(season: number): WeekendWithSessions[] {
  return raceWeekends
    .filter((weekend) => weekend.season === season)
    .map((weekend) => ({
      weekend,
      sessions: sessions
        .filter((session) => session.race_weekend_id === weekend.id)
        .sort((a, b) => Date.parse(a.starts_at_utc) - Date.parse(b.starts_at_utc)),
    }))
    .sort((a, b) => Date.parse(a.weekend.lock_at_utc) - Date.parse(b.weekend.lock_at_utc));
}
