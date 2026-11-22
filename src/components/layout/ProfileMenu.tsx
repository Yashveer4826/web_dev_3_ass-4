import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, LogOut, Pencil, Settings, UserRound } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { statusDot, statusLabel } from "@/lib/tones";
import { useChat } from "@/store/chat-store";
import type { UserStatus } from "@/types/chat";

const STATUSES: UserStatus[] = ["online", "away", "busy", "offline"];

export function ProfileMenu({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { me, updateProfile, setProfileOpen, signOut } = useChat();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          collapsed && "justify-center",
        )}
        aria-label="Open profile menu"
      >
        <UserAvatar user={me} size="md" showStatus ringClassName="ring-sidebar" />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{me.name}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("size-1.5 rounded-full", statusDot[me.status])} />
                {statusLabel[me.status]}
              </span>
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="w-64 rounded-xl border-border bg-popover p-1.5 shadow-panel">
        <DropdownMenuLabel className="flex items-center gap-3 p-2">
          <UserAvatar user={me} size="lg" showStatus ringClassName="ring-popover" />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-semibold">{me.name}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">@{me.handle}</span>
          </span>
        </DropdownMenuLabel>
        <p className="px-2 pb-2 text-xs leading-relaxed text-muted-foreground">{me.bio}</p>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Status
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={me.status}
          onValueChange={(v) => {
            updateProfile({ status: v as UserStatus });
            toast.success(`Status set to ${statusLabel[v as UserStatus]}`);
          }}
        >
          {STATUSES.map((s) => (
            <DropdownMenuRadioItem key={s} value={s} className="gap-2 rounded-lg">
              <span className={cn("size-2 rounded-full", statusDot[s])} />
              {statusLabel[s]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 rounded-lg" onSelect={() => setProfileOpen(true)}>
          <UserRound className="size-4" /> View profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 rounded-lg" onSelect={() => setProfileOpen(true)}>
          <Pencil className="size-4" /> Edit profile
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-2 rounded-lg">
          <Link to="/settings" onClick={onNavigate}>
            <Settings className="size-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 rounded-lg text-destructive focus:text-destructive" onSelect={signOut}>
          <LogOut className="size-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
