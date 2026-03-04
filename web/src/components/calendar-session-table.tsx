"use client";

import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { LocalDateTime } from "@/components/local-date-time";
import { sessionTypeLabel } from "@/lib/derived";
import type { Session } from "@/lib/types";

interface CalendarSessionTableProps {
  sessions: Session[];
}

export function CalendarSessionTable({ sessions }: CalendarSessionTableProps) {
  return (
    <TableContainer>
      <Table size="small" aria-label="session schedule">
        <TableHead>
          <TableRow>
            <TableCell>Session</TableCell>
            <TableCell>Local Start</TableCell>
            <TableCell>UTC</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id} hover>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">
                    {sessionTypeLabel[session.type]}
                  </Typography>
                  {(session.type === "sprint_quali" || session.type === "sprint_race") && (
                    <Chip size="small" color="secondary" label="Sprint" />
                  )}
                </Stack>
              </TableCell>
              <TableCell>
                <LocalDateTime iso={session.starts_at_utc} fallback="Loading..." />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {new Date(session.starts_at_utc).toISOString().replace(".000", "")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
