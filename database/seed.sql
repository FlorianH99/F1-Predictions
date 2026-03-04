insert into players (name, is_admin)
values
  ('Flo', true),
  ('Patrick', false),
  ('Jacques', false),
  ('Eva', false),
  ('Max', false)
on conflict (name) do update
set is_admin = excluded.is_admin;

insert into drivers (
  season,
  code,
  full_name,
  display_name,
  team_name,
  is_active,
  sort_order
)
values
  (2026, 'GAS', 'Pierre Gasly', 'Gasly', 'Alpine', true, 1),
  (2026, 'COL', 'Franco Colapinto', 'Colapinto', 'Alpine', true, 2),
  (2026, 'ALO', 'Fernando Alonso', 'Alonso', 'Aston Martin', true, 3),
  (2026, 'STR', 'Lance Stroll', 'Stroll', 'Aston Martin', true, 4),
  (2026, 'HUL', 'Nico Hulkenberg', 'Hulkenberg', 'Audi', true, 5),
  (2026, 'BOR', 'Gabriel Bortoleto', 'Bortoleto', 'Audi', true, 6),
  (2026, 'PER', 'Sergio Perez', 'Perez', 'Cadillac', true, 7),
  (2026, 'BOT', 'Valtteri Bottas', 'Bottas', 'Cadillac', true, 8),
  (2026, 'LEC', 'Charles Leclerc', 'Leclerc', 'Ferrari', true, 9),
  (2026, 'HAM', 'Lewis Hamilton', 'Hamilton', 'Ferrari', true, 10),
  (2026, 'OCO', 'Esteban Ocon', 'Ocon', 'Haas', true, 11),
  (2026, 'BEA', 'Oliver Bearman', 'Bearman', 'Haas', true, 12),
  (2026, 'NOR', 'Lando Norris', 'Norris', 'McLaren', true, 13),
  (2026, 'PIA', 'Oscar Piastri', 'Piastri', 'McLaren', true, 14),
  (2026, 'RUS', 'George Russell', 'Russell', 'Mercedes', true, 15),
  (2026, 'ANT', 'Kimi Antonelli', 'Antonelli', 'Mercedes', true, 16),
  (2026, 'LAW', 'Liam Lawson', 'Lawson', 'Racing Bulls', true, 17),
  (2026, 'LIN', 'Arvid Lindblad', 'Lindblad', 'Racing Bulls', true, 18),
  (2026, 'VER', 'Max Verstappen', 'Verstappen', 'Red Bull', true, 19),
  (2026, 'HAD', 'Isack Hadjar', 'Hadjar', 'Red Bull', true, 20),
  (2026, 'SAI', 'Carlos Sainz', 'Sainz', 'Williams', true, 21),
  (2026, 'ALB', 'Alexander Albon', 'Albon', 'Williams', true, 22)
on conflict (season, code) do update
set
  full_name = excluded.full_name,
  display_name = excluded.display_name,
  team_name = excluded.team_name,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into race_weekends (
  season,
  name,
  slug,
  location,
  is_sprint,
  lock_at_utc
)
values
  (2026, 'Australian Grand Prix', 'australia', 'Melbourne', false, '2026-03-07T05:00:00Z'),
  (2026, 'Chinese Grand Prix', 'china', 'Shanghai', true, '2026-03-13T07:30:00Z'),
  (2026, 'Japanese Grand Prix', 'japan', 'Suzuka', false, '2026-03-28T06:00:00Z'),
  (2026, 'Bahrain Grand Prix', 'bahrain', 'Sakhir', false, '2026-04-11T16:00:00Z'),
  (2026, 'Saudi Arabian Grand Prix', 'saudi-arabia', 'Jeddah', false, '2026-04-18T17:00:00Z'),
  (2026, 'Miami Grand Prix', 'miami', 'Miami', true, '2026-05-01T20:30:00Z'),
  (2026, 'Canadian Grand Prix', 'canada', 'Montreal', true, '2026-05-22T20:30:00Z'),
  (2026, 'Monaco Grand Prix', 'monaco', 'Monte Carlo', false, '2026-06-06T14:00:00Z'),
  (2026, 'Barcelona-Catalunya Grand Prix', 'barcelona-catalunya', 'Barcelona', false, '2026-06-13T14:00:00Z'),
  (2026, 'Austrian Grand Prix', 'austria', 'Spielberg', false, '2026-06-27T14:00:00Z'),
  (2026, 'British Grand Prix', 'great-britain', 'Silverstone', true, '2026-07-03T15:30:00Z'),
  (2026, 'Belgian Grand Prix', 'belgium', 'Spa-Francorchamps', false, '2026-07-18T14:00:00Z'),
  (2026, 'Hungarian Grand Prix', 'hungary', 'Budapest', false, '2026-07-25T14:00:00Z'),
  (2026, 'Dutch Grand Prix', 'netherlands', 'Zandvoort', true, '2026-08-21T14:30:00Z'),
  (2026, 'Italian Grand Prix', 'italy', 'Monza', false, '2026-09-05T14:00:00Z'),
  (2026, 'Spanish Grand Prix', 'madrid', 'Madrid', false, '2026-09-12T14:00:00Z'),
  (2026, 'Azerbaijan Grand Prix', 'azerbaijan', 'Baku', false, '2026-09-25T12:00:00Z'),
  (2026, 'Singapore Grand Prix', 'singapore', 'Singapore', true, '2026-10-09T12:30:00Z'),
  (2026, 'United States Grand Prix', 'united-states', 'Austin', false, '2026-10-24T21:00:00Z'),
  (2026, 'Mexico City Grand Prix', 'mexico', 'Mexico City', false, '2026-10-31T21:00:00Z'),
  (2026, 'Sao Paulo Grand Prix', 'brazil', 'Sao Paulo', false, '2026-11-07T18:00:00Z'),
  (2026, 'Las Vegas Grand Prix', 'las-vegas', 'Las Vegas', false, '2026-11-21T04:00:00Z'),
  (2026, 'Qatar Grand Prix', 'qatar', 'Lusail', false, '2026-11-28T18:00:00Z'),
  (2026, 'Abu Dhabi Grand Prix', 'abu-dhabi', 'Abu Dhabi', false, '2026-12-05T14:00:00Z')
on conflict (slug) do update
set
  season = excluded.season,
  name = excluded.name,
  location = excluded.location,
  is_sprint = excluded.is_sprint,
  lock_at_utc = excluded.lock_at_utc;

with session_seed(slug, type, starts_at_utc) as (
  values
    ('australia', 'quali', '2026-03-07T05:00:00Z'),
    ('australia', 'race', '2026-03-08T04:00:00Z'),

    ('china', 'sprint_quali', '2026-03-13T07:30:00Z'),
    ('china', 'sprint_race', '2026-03-14T03:00:00Z'),
    ('china', 'quali', '2026-03-14T07:00:00Z'),
    ('china', 'race', '2026-03-15T07:00:00Z'),

    ('japan', 'quali', '2026-03-28T06:00:00Z'),
    ('japan', 'race', '2026-03-29T05:00:00Z'),

    ('bahrain', 'quali', '2026-04-11T16:00:00Z'),
    ('bahrain', 'race', '2026-04-12T15:00:00Z'),

    ('saudi-arabia', 'quali', '2026-04-18T17:00:00Z'),
    ('saudi-arabia', 'race', '2026-04-19T17:00:00Z'),

    ('miami', 'sprint_quali', '2026-05-01T20:30:00Z'),
    ('miami', 'sprint_race', '2026-05-02T16:00:00Z'),
    ('miami', 'quali', '2026-05-02T20:00:00Z'),
    ('miami', 'race', '2026-05-03T20:00:00Z'),

    ('canada', 'sprint_quali', '2026-05-22T20:30:00Z'),
    ('canada', 'sprint_race', '2026-05-23T16:00:00Z'),
    ('canada', 'quali', '2026-05-23T20:00:00Z'),
    ('canada', 'race', '2026-05-24T20:00:00Z'),

    ('monaco', 'quali', '2026-06-06T14:00:00Z'),
    ('monaco', 'race', '2026-06-07T13:00:00Z'),

    ('barcelona-catalunya', 'quali', '2026-06-13T14:00:00Z'),
    ('barcelona-catalunya', 'race', '2026-06-14T13:00:00Z'),

    ('austria', 'quali', '2026-06-27T14:00:00Z'),
    ('austria', 'race', '2026-06-28T13:00:00Z'),

    ('great-britain', 'sprint_quali', '2026-07-03T15:30:00Z'),
    ('great-britain', 'sprint_race', '2026-07-04T11:00:00Z'),
    ('great-britain', 'quali', '2026-07-04T15:00:00Z'),
    ('great-britain', 'race', '2026-07-05T14:00:00Z'),

    ('belgium', 'quali', '2026-07-18T14:00:00Z'),
    ('belgium', 'race', '2026-07-19T13:00:00Z'),

    ('hungary', 'quali', '2026-07-25T14:00:00Z'),
    ('hungary', 'race', '2026-07-26T13:00:00Z'),

    ('netherlands', 'sprint_quali', '2026-08-21T14:30:00Z'),
    ('netherlands', 'sprint_race', '2026-08-22T10:00:00Z'),
    ('netherlands', 'quali', '2026-08-22T14:00:00Z'),
    ('netherlands', 'race', '2026-08-23T13:00:00Z'),

    ('italy', 'quali', '2026-09-05T14:00:00Z'),
    ('italy', 'race', '2026-09-06T13:00:00Z'),

    ('madrid', 'quali', '2026-09-12T14:00:00Z'),
    ('madrid', 'race', '2026-09-13T13:00:00Z'),

    ('azerbaijan', 'quali', '2026-09-25T12:00:00Z'),
    ('azerbaijan', 'race', '2026-09-26T11:00:00Z'),

    ('singapore', 'sprint_quali', '2026-10-09T12:30:00Z'),
    ('singapore', 'sprint_race', '2026-10-10T09:00:00Z'),
    ('singapore', 'quali', '2026-10-10T13:00:00Z'),
    ('singapore', 'race', '2026-10-11T12:00:00Z'),

    ('united-states', 'quali', '2026-10-24T21:00:00Z'),
    ('united-states', 'race', '2026-10-25T20:00:00Z'),

    ('mexico', 'quali', '2026-10-31T21:00:00Z'),
    ('mexico', 'race', '2026-11-01T20:00:00Z'),

    ('brazil', 'quali', '2026-11-07T18:00:00Z'),
    ('brazil', 'race', '2026-11-08T17:00:00Z'),

    ('las-vegas', 'quali', '2026-11-21T04:00:00Z'),
    ('las-vegas', 'race', '2026-11-22T04:00:00Z'),

    ('qatar', 'quali', '2026-11-28T18:00:00Z'),
    ('qatar', 'race', '2026-11-29T16:00:00Z'),

    ('abu-dhabi', 'quali', '2026-12-05T14:00:00Z'),
    ('abu-dhabi', 'race', '2026-12-06T13:00:00Z')
)
insert into sessions (race_weekend_id, type, starts_at_utc)
select
  rw.id,
  ss.type::session_type,
  ss.starts_at_utc::timestamptz
from session_seed ss
join race_weekends rw on rw.slug = ss.slug
on conflict (race_weekend_id, type) do update
set starts_at_utc = excluded.starts_at_utc;
