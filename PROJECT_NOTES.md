# F1 Predictions App Notes

## Product Goal

Build a live website for a private group to submit predictions for Formula 1 race weekends, view points, and track season standings.

## Tech Direction

- Frontend: Next.js + React + TypeScript
- Package manager: Yarn
- UI library: Material UI (MUI)
- Hosting: Vercel
- Backend/database: Supabase
- Domain: optional later; can start on a free `vercel.app` URL

## Cost Direction

- V1 can run at $0 using:
  - Vercel Hobby
  - Supabase Free
  - default Vercel domain
- A custom domain is optional and would be the first likely cost.

## Identity / Permissions

- No password-based auth for v1.
- The UI uses a player selector to choose identity.
- A selected player can edit only their own predictions.
- `Flo` is the admin player.
- `Flo` can manage race weekends, session times, results, and scoring.

Note: this is convenient for a friends-only app, but it is not secure authentication.

## Players

- Flo
- Patrick
- Jacques
- Eva
- Max

## Prediction Rules

For every race weekend:

- Predict qualifying pole (end of Q3)
- Predict race P1
- Predict race P2
- Predict race P3
- Predict race P10

For sprint weekends only:

- Predict sprint qualifying pole
- Predict sprint race P1

## Scoring Rules

- Qualifying pole correct: 1 point
- Race P1 correct: 1 point
- Race P2 correct: 1 point
- Race P3 correct: 1 point
- Race P10 correct: 2 points
- Sprint qualifying pole correct: 1 point
- Sprint race P1 correct: 1 point

## Lock Rule

- Predictions lock before the first prediction-relevant session starts.
- Session schedule data will drive this automatically.

## Calendar Requirement

- Include a 2026 Formula 1 calendar page.
- Show all race weekends and session times in the viewer's local time.
- Use the calendar/session data to determine prediction lock deadlines.

## MVP Database Tables

### `players`

- `id`
- `name` (unique)
- `is_admin`

### `drivers`

- `id`
- `season`
- `code`
- `full_name`
- `display_name`
- `team_name`
- `is_active`
- `sort_order`

Purpose:
- Stores the selectable driver list for prediction inputs.

### `race_weekends`

- `id`
- `season`
- `name`
- `slug`
- `location`
- `is_sprint`
- `lock_at_utc`
- `created_at`

### `sessions`

- `id`
- `race_weekend_id`
- `type` (`quali`, `race`, `sprint_quali`, `sprint_race`)
- `starts_at_utc`

### `predictions`

- `id`
- `race_weekend_id`
- `player_id`
- `quali_pole_driver_id`
- `race_p1_driver_id`
- `race_p2_driver_id`
- `race_p3_driver_id`
- `race_p10_driver_id`
- `sprint_quali_pole_driver_id` (nullable)
- `sprint_race_p1_driver_id` (nullable)
- `submitted_at`
- `updated_at`

Constraint:
- Unique on (`race_weekend_id`, `player_id`)

### `results`

- `id`
- `race_weekend_id` (unique)
- `quali_pole_driver_id`
- `race_p1_driver_id`
- `race_p2_driver_id`
- `race_p3_driver_id`
- `race_p10_driver_id`
- `sprint_quali_pole_driver_id` (nullable)
- `sprint_race_p1_driver_id` (nullable)
- `entered_by_player_id`
- `updated_at`

### `score_entries`

- `id`
- `race_weekend_id`
- `player_id`
- `quali_pole_points`
- `race_p1_points`
- `race_p2_points`
- `race_p3_points`
- `race_p10_points`
- `sprint_quali_pole_points`
- `sprint_race_p1_points`
- `total_points`
- `calculated_at`

## MVP App Structure

- `/`
  - Home page
  - Next race
  - Lock status
  - Standings snapshot

- `/predictions`
  - Player selector
  - Race weekend selector
  - Prediction form

- `/leaderboard`
  - Season standings
  - Per-race points

- `/calendar`
  - 2026 F1 calendar
  - Local session times

- `/admin`
  - Flo-only controls
  - Manage weekends
  - Manage sessions
  - Enter results
  - Recalculate scores

## Next Planned Step

The initial SQL artifacts now exist:

- `database/schema.sql`
- `database/seed.sql`

Next:
- Set up Supabase and run the schema/seed scripts
- Scaffold the Next.js app around this model
