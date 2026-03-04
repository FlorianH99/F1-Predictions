insert into players (name, is_admin)
values
  ('Flo', true),
  ('Patrick', false),
  ('Jacques', false),
  ('Eva', false),
  ('Max', false)
on conflict (name) do update
set is_admin = excluded.is_admin;

-- Intentionally leaving drivers empty for now.
-- We should seed the 2026 driver list after we confirm the exact roster we want
-- available in the prediction UI.
