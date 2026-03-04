import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { PageHeader } from "@/components/page-header";

const adminTasks = [
  "Manage race weekends",
  "Manage session start times",
  "Enter official results",
  "Recalculate score_entries",
];

export default function AdminPage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        title="Admin"
        subtitle="Flo-only controls for race schedule management, results entry, and scoring operations."
      />

      <Alert severity="warning">
        Auth is intentionally lightweight in v1. Enforce admin gating in the UI and RLS before production use.
      </Alert>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h5">Admin Actions</Typography>
                <List dense>
                  {adminTasks.map((task) => (
                    <ListItem key={task} disablePadding>
                      <ListItemText primary={task} />
                    </ListItem>
                  ))}
                </List>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained">Enter Results</Button>
                  <Button variant="outlined">Recalculate Scores</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack spacing={1.2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ConstructionRoundedIcon color="secondary" />
                  <Typography variant="h5">Build Queue</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Next integration step is replacing these shell buttons with Supabase mutations for
                  `race_weekends`, `sessions`, `results`, and `score_entries` recalculation.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
