const etDisplayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const etPartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

type EasternDateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

function toEasternParts(date: Date): EasternDateTimeParts {
  const parts = etPartsFormatter.formatToParts(date);

  const values: Partial<EasternDateTimeParts> = {};

  for (const part of parts) {
    if (part.type === "year") {
      values.year = Number.parseInt(part.value, 10);
    }

    if (part.type === "month") {
      values.month = Number.parseInt(part.value, 10);
    }

    if (part.type === "day") {
      values.day = Number.parseInt(part.value, 10);
    }

    if (part.type === "hour") {
      values.hour = Number.parseInt(part.value, 10);
    }

    if (part.type === "minute") {
      values.minute = Number.parseInt(part.value, 10);
    }

    if (part.type === "second") {
      values.second = Number.parseInt(part.value, 10);
    }
  }

  return {
    year: values.year ?? 0,
    month: values.month ?? 1,
    day: values.day ?? 1,
    hour: values.hour ?? 0,
    minute: values.minute ?? 0,
    second: values.second ?? 0,
  };
}

function getEasternOffsetMinutes(date: Date): number {
  const parts = toEasternParts(date);
  const localAsUtcMs = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return Math.round((localAsUtcMs - date.getTime()) / 60000);
}

export function formatEasternDateTime(iso: string): string {
  return etDisplayFormatter.format(new Date(iso));
}

export function formatEasternDateTimeInputValue(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = toEasternParts(date);

  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}T${pad2(parts.hour)}:${pad2(parts.minute)}`;
}

export function parseEasternDateTimeInputToUtcIso(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const hour = Number.parseInt(match[4], 10);
  const minute = Number.parseInt(match[5], 10);

  const baseUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  let resolvedUtcMs = baseUtcMs;

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const offsetMinutes = getEasternOffsetMinutes(new Date(resolvedUtcMs));
    const nextUtcMs = baseUtcMs - offsetMinutes * 60_000;

    if (nextUtcMs === resolvedUtcMs) {
      break;
    }

    resolvedUtcMs = nextUtcMs;
  }

  const resolvedIso = new Date(resolvedUtcMs).toISOString();

  if (formatEasternDateTimeInputValue(resolvedIso) !== value.trim()) {
    return null;
  }

  return resolvedIso;
}
