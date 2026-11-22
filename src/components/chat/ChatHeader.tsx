import { Bell, BellOff, Info, Link2, LogOut, Lock, Menu, MoreVertical, Search, UserPlus, Users, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { RoomIcon } from "@/components/common/RoomIcon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Room } from "@/types/chat";

interface Props {
  room: Room;
  onlineCount: number;
  joined: boolean;
  muted: boolean;
  searchOpen: boolean;
  search: string;
  membersActive: boolean;
  onSearchOpen: (open: boolean) => void;
  onSearchChange: (q: string) => void;
  onOpenMenu: () => void;
  onInvite: () => void;
  onToggleMembers: () => void;
  onToggleMute: () => void;
  onLeave: () => void;
}

export function ChatHeader(p: Props) {
  const { room } = p;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (p.searchOpen) inputRef.current?.focus();
  }, [p.searchOpen]);

  return (
    <header className="relative z-20 flex shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 py-2.5 backdrop-blur-xl sm:gap-3 md:px-6 md:py-3.5">
      <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={p.onOpenMenu} aria-label="Open menu">
        <Menu />
      </Button>

      <div className={cn("flex min-w-0 flex-1 items-center gap-3", p.searchOpen && "hidden sm:flex")}>
        <RoomIcon room={room} size="md" className="hidden sm:inline-flex" />
        <RoomIcon room={room} size="sm" className="sm:hidden" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="truncate text-base font-semibold md:text-lg">{room.name}</h1>
            {room.isPrivate && <Lock className="size-3.5 shrink-0 text-muted-foreground" aria-label="Private room" />}
            {p.muted && <BellOff className="size-3.5 shrink-0 text-muted-foreground" aria-label="Muted" />}
          </div>
          <p className="flex items-center gap-2 truncate text-xs text-muted-foreground">
            <span className="inline-flex shrink-0 items-center gap-1.5 text-online">
              <span className="size-1.5 rounded-full bg-online animate-pulse-ring" />
              {p.onlineCount} online
            </span>
            <span className="hidden truncate lg:inline">· {room.description}</span>
          </p>
        </div>
      </div>

      {p.searchOpen && (
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-input bg-surface px-3 animate-msg-in sm:max-w-xs">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={p.search}
            onChange={(e) => p.onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && p.onSearchOpen(false)}
            placeholder="Search messages"
            aria-label="Search messages"
            className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="button" onClick={() => p.onSearchOpen(false)} aria-label="Close search" className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        {!p.searchOpen && (
          <Button variant="ghost" size="icon-sm" onClick={() => p.onSearchOpen(true)} aria-label="Search messages">
            <Search />
          </Button>
        )}
        {p.joined && (
          <Button variant="soft" size="sm" className="hidden md:inline-flex" onClick={p.onInvite}>
            <UserPlus /> Invite
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={p.onToggleMembers}
          aria-label="Toggle members"
          aria-pressed={p.membersActive}
          className={cn(p.membersActive && "bg-accent text-foreground")}
        >
          <Users />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="More options">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border bg-popover p-1.5 shadow-panel">
            <DropdownMenuItem className="gap-2 rounded-lg" onSelect={() => toast(room.name, { description: `${room.category} · ${room.description}` })}>
              <Info className="size-4" /> Room info
            </DropdownMenuItem>
            {p.joined && (
              <DropdownMenuItem className="gap-2 rounded-lg md:hidden" onSelect={p.onInvite}>
                <UserPlus className="size-4" /> Invite members
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="gap-2 rounded-lg"
              onSelect={() => {
                navigator.clipboard?.writeText(`https://viberooms.app/join/${room.id}`).catch(() => {});
                toast.success("Room link copied");
              }}
            >
              <Link2 className="size-4" /> Copy room link
            </DropdownMenuItem>
            {p.joined && (
              <DropdownMenuItem className="gap-2 rounded-lg" onSelect={p.onToggleMute}>
                {p.muted ? <Bell className="size-4" /> : <BellOff className="size-4" />}
                {p.muted ? "Unmute room" : "Mute notifications"}
              </DropdownMenuItem>
            )}
            {p.joined && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 rounded-lg text-destructive focus:text-destructive" onSelect={p.onLeave}>
                  <LogOut className="size-4" /> Leave room
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
