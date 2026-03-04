import { Stack, Typography } from "@mui/material";

import { PageHeader } from "@/components/page-header";
import { PredictionsShell } from "@/components/predictions-shell";

export default function PredictionsPage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        title="Predictions"
        subtitle="Select player and race weekend, then submit picks for qualifying, race, and sprint sessions."
      />

      <Typography color="text.secondary" variant="body2">
        Current view is a schema-aligned shell using local mock data. Wiring to Supabase tables is next.
      </Typography>

      <PredictionsShell />
    </Stack>
  );
}
