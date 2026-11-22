import { Crown, X } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { CURRENT_USER_ID } from "@/data/mock";
import { formatCount } from "@/lib/chat-utils";
import { statusLabel } from "@/lib/tones";
import { cn } from "@/lib/utils";
import type { Room, User } from "@/types/chat";

function MemberRow({ user, isOwner, dim }: { user: User; isOwner: boolean; dim?: boolean }) {
  const isMe = user.id === CURRENT_USER_ID;
  return (
    <button
      type="button"
      onClick={() => toast(user.name, { description: user.bio })}
      className={cn("flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-accent", dim && "opacity-55")}
    >
      <UserAvatar user={user} size="sm" showStatus ringClassName="ring-surface" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium">{user.name}</span>
          {isMe && <span className="text-[11px] text-muted-foreground">(you)</span>}
          {isOwner && <Crown className="size-3.5 shrink-0 text-gold" aria-label="Room owner" />}
        </span>
        <span className="block truncate text-xs text-muted-foreground">{isOwner ? "Room owner" : statusLabel[user.status]}</span>
      </span>
    </button>
  );
}

export function MembersPanelBody({ room, users, onClose }: { room: Room; users: Record<string, User>; onClose?: () => void }) {
  const members = room.memberIds.map((id) => users[id]).filter((u): u is User => Boolean(u));
  const online = members.filter((u) => u.status !== "offline").sort((a, b) => (a.id === room.ownerId ? -1 : b.id === room.ownerId ? 1 : 0));
  const offline = members.filter((u) => u.status === "offline");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-3 pt-5">
        <div>
          <h2 className="text-base font-semibold">Members</h2>
          <p className="text-xs text-muted-foreground">
            {formatCount(room.memberCount)} total · <span className="text-online">{online.length} online</span>
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Hide members">
            <X />
          </Button>
        )}
      </div>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-5 scrollbar-thin">
        <div>
          <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Online — {online.length}</p>
          {online.map((u) => (
            <MemberRow key={u.id} user={u} isOwner={u.id === room.ownerId} />
          ))}
        </div>
        {offline.length > 0 && (
          <div>
            <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Offline — {offline.length}</p>
            {offline.map((u) => (
              <MemberRow key={u.id} user={u} isOwner={u.id === room.ownerId} dim />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
