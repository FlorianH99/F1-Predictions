import type { Driver } from "@/lib/types";

export interface TeamColorToken {
  team: string;
  primary: string;
  accent: string;
  text: string;
  border: string;
}

const teamColors: TeamColorToken[] = [
  { team: "Alpine", primary: "#2293D1", accent: "#0F5D9A", text: "#FFFFFF", border: "#0B3F68" },
  { team: "Aston Martin", primary: "#006F62", accent: "#004D44", text: "#FFFFFF", border: "#00352F" },
  { team: "Audi", primary: "#A00000", accent: "#5B0000", text: "#FFFFFF", border: "#2E0000" },
  { team: "Cadillac", primary: "#1C4E80", accent: "#0A2948", text: "#FFFFFF", border: "#041526" },
  { team: "Ferrari", primary: "#DC0000", accent: "#8F0000", text: "#FFFFFF", border: "#5A0000" },
  { team: "Haas", primary: "#AEB4B8", accent: "#6C7377", text: "#101418", border: "#4B5053" },
  { team: "McLaren", primary: "#FF8000", accent: "#C25A00", text: "#1F1200", border: "#7A3A00" },
  { team: "Mercedes", primary: "#00D2BE", accent: "#008A7B", text: "#032623", border: "#04564E" },
  { team: "Racing Bulls", primary: "#6692FF", accent: "#2B4D9A", text: "#FFFFFF", border: "#1A2F60" },
  { team: "Red Bull", primary: "#1E41FF", accent: "#0D1C75", text: "#FFFFFF", border: "#081047" },
  { team: "Williams", primary: "#005AFF", accent: "#0038A8", text: "#FFFFFF", border: "#002266" },
];

const fallbackColor: TeamColorToken = {
  team: "Unknown",
  primary: "#3D4B59",
  accent: "#202933",
  text: "#FFFFFF",
  border: "#11171E",
};

const teamColorByName = new Map(teamColors.map((token) => [token.team.toLowerCase(), token]));

export function getTeamColorToken(teamName: string | null | undefined): TeamColorToken {
  if (!teamName) {
    return fallbackColor;
  }

  return teamColorByName.get(teamName.toLowerCase()) ?? fallbackColor;
}

export function getDriverTeamColorToken(driver: Driver | null | undefined): TeamColorToken {
  return getTeamColorToken(driver?.team_name);
}
