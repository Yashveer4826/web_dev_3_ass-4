import type { Tone, UserStatus } from "@/types/chat";

export const TONES: Tone[] = ["violet", "indigo", "cyan", "pink", "amber", "emerald", "rose", "sky"];

export const toneClass: Record<Tone, string> = {
  violet: "tone-violet",
  indigo: "tone-indigo",
  cyan: "tone-cyan",
  pink: "tone-pink",
  amber: "tone-amber",
  emerald: "tone-emerald",
  rose: "tone-rose",
  sky: "tone-sky",
};

export const statusDot: Record<UserStatus, string> = {
  online: "bg-online",
  away: "bg-away",
  busy: "bg-busy",
  offline: "bg-offline",
};

export const statusLabel: Record<UserStatus, string> = {
  online: "Online",
  away: "Away",
  busy: "Do not disturb",
  offline: "Offline",
};
