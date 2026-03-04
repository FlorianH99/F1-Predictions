create extension if not exists pgcrypto;

drop type if exists session_type cascade;
create type session_type as enum (
  'quali',
  'race',
  'sprint_quali',
  'sprint_race'
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  season integer not null,
  code text not null,
  full_name text not null,
  display_name text not null,
  team_name text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint drivers_season_check check (season >= 2026),
  constraint drivers_code_length_check check (char_length(code) between 2 and 5),
  constraint drivers_sort_order_check check (sort_order >= 0),
  constraint drivers_season_code_unique unique (season, code)
);

create table if not exists race_weekends (
  id uuid primary key default gen_random_uuid(),
  season integer not null,
  name text not null,
  slug text not null unique,
  location text not null,
  is_sprint boolean not null default false,
  lock_at_utc timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint race_weekends_season_check check (season >= 2026)
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  race_weekend_id uuid not null references race_weekends(id) on delete cascade,
  type session_type not null,
  starts_at_utc timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint sessions_weekend_type_unique unique (race_weekend_id, type)
);

create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  race_weekend_id uuid not null references race_weekends(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  quali_pole_driver_id uuid not null references drivers(id),
  race_p1_driver_id uuid not null references drivers(id),
  race_p2_driver_id uuid not null references drivers(id),
  race_p3_driver_id uuid not null references drivers(id),
  race_p10_driver_id uuid not null references drivers(id),
  sprint_quali_pole_driver_id uuid references drivers(id),
  sprint_race_p1_driver_id uuid references drivers(id),
  submitted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint predictions_weekend_player_unique unique (race_weekend_id, player_id)
);

create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  race_weekend_id uuid not null unique references race_weekends(id) on delete cascade,
  quali_pole_driver_id uuid not null references drivers(id),
  race_p1_driver_id uuid not null references drivers(id),
  race_p2_driver_id uuid not null references drivers(id),
  race_p3_driver_id uuid not null references drivers(id),
  race_p10_driver_id uuid not null references drivers(id),
  sprint_quali_pole_driver_id uuid references drivers(id),
  sprint_race_p1_driver_id uuid references drivers(id),
  entered_by_player_id uuid not null references players(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists score_entries (
  id uuid primary key default gen_random_uuid(),
  race_weekend_id uuid not null references race_weekends(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  quali_pole_points integer not null default 0,
  race_p1_points integer not null default 0,
  race_p2_points integer not null default 0,
  race_p3_points integer not null default 0,
  race_p10_points integer not null default 0,
  sprint_quali_pole_points integer not null default 0,
  sprint_race_p1_points integer not null default 0,
  total_points integer not null default 0,
  calculated_at timestamptz not null default timezone('utc', now()),
  constraint score_entries_points_non_negative_check check (
    quali_pole_points >= 0
    and race_p1_points >= 0
    and race_p2_points >= 0
    and race_p3_points >= 0
    and race_p10_points >= 0
    and sprint_quali_pole_points >= 0
    and sprint_race_p1_points >= 0
    and total_points >= 0
  ),
  constraint score_entries_weekend_player_unique unique (race_weekend_id, player_id)
);

create index if not exists idx_drivers_season_active
  on drivers (season, is_active, sort_order, display_name);

create index if not exists idx_race_weekends_season
  on race_weekends (season);

create index if not exists idx_race_weekends_lock_at
  on race_weekends (lock_at_utc);

create index if not exists idx_sessions_weekend_starts_at
  on sessions (race_weekend_id, starts_at_utc);

create index if not exists idx_predictions_player
  on predictions (player_id);

create index if not exists idx_predictions_weekend
  on predictions (race_weekend_id);

create index if not exists idx_score_entries_player
  on score_entries (player_id);

create index if not exists idx_score_entries_total_points
  on score_entries (total_points desc, calculated_at desc);

drop trigger if exists trg_drivers_set_updated_at on drivers;
create trigger trg_drivers_set_updated_at
before update on drivers
for each row
execute function set_updated_at();

drop trigger if exists trg_race_weekends_set_updated_at on race_weekends;
create trigger trg_race_weekends_set_updated_at
before update on race_weekends
for each row
execute function set_updated_at();

drop trigger if exists trg_sessions_set_updated_at on sessions;
create trigger trg_sessions_set_updated_at
before update on sessions
for each row
execute function set_updated_at();

drop trigger if exists trg_predictions_set_updated_at on predictions;
create trigger trg_predictions_set_updated_at
before update on predictions
for each row
execute function set_updated_at();

drop trigger if exists trg_results_set_updated_at on results;
create trigger trg_results_set_updated_at
before update on results
for each row
execute function set_updated_at();

create or replace view leaderboard_totals as
select
  p.id as player_id,
  p.name as player_name,
  coalesce(sum(se.total_points), 0) as season_points
from players p
left join score_entries se on se.player_id = p.id
group by p.id, p.name
order by season_points desc, p.name asc;
