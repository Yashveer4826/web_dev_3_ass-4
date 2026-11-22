import { cn } from "@/lib/utils";
import { ROOM_ICONS } from "@/lib/room-icons";
import { toneClass } from "@/lib/tones";
import type { Room } from "@/types/chat";

const sizes = {
  sm: "size-8 rounded-lg [&_svg]:size-4",
  md: "size-10 rounded-xl [&_svg]:size-5",
  lg: "size-12 rounded-2xl [&_svg]:size-6",
  xl: "size-16 rounded-2xl [&_svg]:size-8",
} as const;

export function RoomIcon({
  room,
  size = "md",
  className,
}: {
  room: Pick<Room, "icon" | "tone">;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const Icon = ROOM_ICONS[room.icon];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-primary-foreground shadow-soft",
        toneClass[room.tone],
        sizes[size],
        className,
      )}
      aria-hidden
    >
      <Icon strokeWidth={2.2} />
    </span>
  );
}
