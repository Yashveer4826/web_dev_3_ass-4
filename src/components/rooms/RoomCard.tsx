import { Link } from "@tanstack/react-router";
import { Check, Flame, Lock, Users } from "lucide-react";
import { toast } from "sonner";
import { RoomIcon } from "@/components/common/RoomIcon";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { formatCount } from "@/lib/chat-utils";
import { cn } from "@/lib/utils";
import { useChat } from "@/store/chat-store";
import type { Room } from "@/types/chat";

export function RoomCard({ room, className, style }: { room: Room; className?: string; style?: React.CSSProperties }) {
  const { joinedIds, joinRoom, users, unread } = useChat();
  const joined = joinedIds.includes(room.id);
  const preview = room.memberIds.slice(0, 4).map((id) => users[id]).filter(Boolean);
  const count = unread[room.id] ?? 0;

  return (
    <article
      style={style}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow animate-rise",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/0 blur-2xl transition-colors duration-500 group-hover:bg-primary/20" />
      <div className="relative flex items-start justify-between gap-3">
        <RoomIcon room={room} size="lg" />
        <div className="flex items-center gap-1.5">
          {room.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-gold">
              <Flame className="size-3" /> Popular
            </span>
          )}
          {room.isPrivate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold">
              <Lock className="size-3" /> Private
            </span>
          )}
          {joined && count > 0 && (
            <span className="rounded-full bg-gradient-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">{count} new</span>
          )}
        </div>
      </div>
      <h3 className="relative mt-4 text-lg font-semibold">{room.name}</h3>
      <p className="relative mt-1 line-clamp-2 text-sm text-muted-foreground">{room.description}</p>
      <div className="relative mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">{room.category}</span>
        {room.tags.slice(0, 2).map((t) => (
          <span key={t} className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground/80">
            {t}
          </span>
        ))}
      </div>
      <div className="relative mt-auto flex items-center justify-between gap-3 pt-5">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {preview.map((u) => u && <UserAvatar key={u.id} user={u} size="xs" className="rounded-full ring-2 ring-card" />)}
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" /> {formatCount(room.memberCount)}
          </span>
        </div>
        {joined ? (
          <Button asChild size="sm" variant="soft">
            <Link to="/rooms/$roomId" params={{ roomId: room.id }}>
              <Check /> Open
            </Link>
          </Button>
        ) : (
          <div className="flex gap-1.5">
            <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
              <Link to="/rooms/$roomId" params={{ roomId: room.id }}>Preview</Link>
            </Button>
            <Button
              size="sm"
              variant="hero"
              onClick={() => {
                joinRoom(room.id);
                toast.success(`Joined ${room.name}`, { description: "It's now in My Rooms." });
              }}
            >
              Join Room
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
