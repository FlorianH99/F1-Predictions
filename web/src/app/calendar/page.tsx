import {
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { CalendarSessionTable } from "@/components/calendar-session-table";
import { PageHeader } from "@/components/page-header";
import { getReadData } from "@/lib/data/read";
import { getWeekendWithSessions } from "@/lib/derived";

export default async function CalendarPage() {
  const data = await getReadData();
  const weekends = getWeekendWithSessions(data.raceWeekends, data.sessions, 2026);

  return (
    <Stack spacing={3}>
      <PageHeader
        title="2026 Calendar"
        subtitle="Full race weekend schedule with session starts shown in your browser's local timezone."
      />

      {data.warning ? <Alert severity="info">{data.warning}</Alert> : null}

      <Typography variant="body2" color="text.secondary">
        Lock deadline is tied to the first prediction-relevant session for each weekend.
      </Typography>

      {weekends.map(({ weekend, sessions }) => (
        <Card key={weekend.id}>
          <CardContent>
            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5">{weekend.name}</Typography>
                {weekend.is_sprint && <Chip size="small" color="secondary" label="Sprint" />}
              </Stack>

              <Typography color="text.secondary">
                {`${weekend.location} • Lock at ${new Date(weekend.lock_at_utc).toUTCString()}`}
              </Typography>

              <Divider />

              <CalendarSessionTable sessions={sessions} />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
