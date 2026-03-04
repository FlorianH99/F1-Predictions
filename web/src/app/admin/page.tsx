import { Alert, Stack, Typography } from "@mui/material";

import { AdminShell } from "@/components/admin-shell";
import { PageHeader } from "@/components/page-header";
import { getReadData } from "@/lib/data/read";

export default async function AdminPage() {
  const data = await getReadData();

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Admin"
        subtitle="Flo-only controls for weekend schedule, result entry, and scoring operations."
      />

      <Alert severity="warning">
        v1 uses selector-based identity. Add RLS/policies before treating admin controls as secure.
      </Alert>

      {data.warning ? <Alert severity="info">{data.warning}</Alert> : null}

      <Typography color="text.secondary" variant="body2">
        Data source: {data.source === "supabase" ? "Supabase" : "Local mock fallback"}.
      </Typography>

      <AdminShell
        source={data.source}
        players={data.players}
        drivers={data.drivers}
        raceWeekends={data.raceWeekends}
        sessions={data.sessions}
        results={data.results}
      />
    </Stack>
  );
}
