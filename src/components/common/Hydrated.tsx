import { useHydrated } from "@tanstack/react-router";
import { formatDayLabel, formatTime } from "@/lib/chat-utils";

/** Times depend on the viewer's clock and timezone, so render them only after hydration. */
export function TimeLabel({ ts, className }: { ts: number; className?: string }) {
  const hydrated = useHydrated();
  return (
    <time className={className} dateTime={hydrated ? new Date(ts).toISOString() : undefined} suppressHydrationWarning>
      {hydrated ? formatTime(ts) : "\u00a0"}
    </time>
  );
}

export function DayLabel({ ts }: { ts: number }) {
  const hydrated = useHydrated();
  return <>{hydrated ? formatDayLabel(ts) : "\u00a0"}</>;
}
