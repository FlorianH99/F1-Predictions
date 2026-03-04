import { Alert, Stack, Typography } from "@mui/material";

import { PageHeader } from "@/components/page-header";
import { PredictionsShell } from "@/components/predictions-shell";
import { getReadData } from "@/lib/data/read";

export default async function PredictionsPage() {
  const data = await getReadData();

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Predictions"
        subtitle="Select player and race weekend, then submit picks for qualifying, race, and sprint sessions."
      />

      {data.warning ? <Alert severity="info">{data.warning}</Alert> : null}

      <Typography color="text.secondary" variant="body2">
        Data source: {data.source === "supabase" ? "Supabase" : "Local mock fallback"}. Save
        requests are lock-checked server-side.
      </Typography>

      <PredictionsShell
        source={data.source}
        players={data.players}
        drivers={data.drivers}
        raceWeekends={data.raceWeekends}
        predictions={data.predictions}
      />
    </Stack>
  );
}
