import type { Message } from "@/types/chat";

/** Messages from the same sender within this window are visually grouped. */
export const GROUP_WINDOW_MS = 5 * 60_000;

export interface MessageGroup {
  id: string;
  userId: string;
  messages: Message[];
}

export interface DaySection {
  dayKey: string;
  timestamp: number;
  groups: MessageGroup[];
}

export function dayKeyOf(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Split messages into day sections, then into consecutive same-sender groups. */
export function groupMessages(messages: Message[]): DaySection[] {
  const sections: DaySection[] = [];
  for (const msg of messages) {
    const key = dayKeyOf(msg.createdAt);
    let section = sections[sections.length - 1];
    if (!section || section.dayKey !== key) {
      section = { dayKey: key, timestamp: msg.createdAt, groups: [] };
      sections.push(section);
    }
    const lastGroup = section.groups[section.groups.length - 1];
    const lastMsg = lastGroup?.messages[lastGroup.messages.length - 1];
    const canJoin =
      lastGroup &&
      lastMsg &&
      lastGroup.userId === msg.userId &&
      !msg.replyToId &&
      msg.createdAt - lastMsg.createdAt <= GROUP_WINDOW_MS;
    if (canJoin) {
      lastGroup.messages.push(msg);
    } else {
      section.groups.push({ id: msg.id, userId: msg.userId, messages: [msg] });
    }
  }
  return sections;
}

/** Enter sends; Shift+Enter inserts a newline; IME composition never sends. */
export function shouldSendOnKey(e: { key: string; shiftKey: boolean; isComposing?: boolean }): boolean {
  return e.key === "Enter" && !e.shiftKey && !e.isComposing;
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatDayLabel(ts: number, now = Date.now()): string {
  const today = dayKeyOf(now);
  const yesterday = dayKeyOf(now - 24 * 60 * 60_000);
  const key = dayKeyOf(ts);
  if (key === today) return "Today";
  if (key === yesterday) return "Yesterday";
  return new Date(ts).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "room"
  );
}
