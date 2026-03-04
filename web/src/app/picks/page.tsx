import { Alert, Stack } from "@mui/material";

import { PageHeader } from "@/components/page-header";
import { PicksShell } from "@/components/picks-shell";
import { getReadData } from "@/lib/data/read";

export default async function PicksPage() {
  const data = await getReadData();

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Picks"
        subtitle="Review every player's submitted picks side by side for each race weekend."
      />

      {data.warning ? <Alert severity="info">{data.warning}</Alert> : null}

      <PicksShell
        source={data.source}
        players={data.players}
        drivers={data.drivers}
        raceWeekends={data.raceWeekends}
        predictions={data.predictions}
      />
    </Stack>
  );
}
