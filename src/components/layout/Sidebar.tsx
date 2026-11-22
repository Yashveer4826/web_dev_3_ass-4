import { Link } from "@tanstack/react-router";
import { Compass, Home, Layers, PanelLeftClose, PanelLeftOpen, Plus, Settings, Users, type LucideIcon, BellOff } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { RoomIcon } from "@/components/common/RoomIcon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useChat, useJoinedRooms } from "@/store/chat-store";
import { ProfileMenu } from "./ProfileMenu";

type NavTo = "/" | "/explore" | "/rooms" | "/friends";
const NAV: { to: NavTo; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore Rooms", icon: Compass },
  { to: "/rooms", label: "My Rooms", icon: Layers },
  { to: "/friends", label: "Friends", icon: Users },
];

const navItem =
  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-foreground";
const navActive =
  "bg-sidebar-accent text-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-gradient-primary";

function WithTip({ show, label, children }: { show: boolean; label: string; children: React.ReactNode }) {
  if (!show) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { unread, mutedIds, setCreateRoomOpen, setSidebarCollapsed, friends, users } = useChat();
  const joined = useJoinedRooms();
  const onlineFriends = friends.filter((f) => !f.pending && users[f.userId]?.status === "online").length;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-full flex-col">
        <div className={cn("flex items-center justify-between px-4 pb-4 pt-5", collapsed && "flex-col gap-4 px-2")}>
          <Link to="/" onClick={onNavigate} aria-label="VibeRooms home">
            <Logo collapsed={collapsed} />
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden text-muted-foreground md:inline-flex"
            onClick={() => setSidebarCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>

        <div className={cn("px-3", collapsed && "px-2")}>
          <ProfileMenu collapsed={collapsed} onNavigate={onNavigate} />
        </div>

        <nav className={cn("mt-4 space-y-1 px-3", collapsed && "px-2")} aria-label="Main">
          {NAV.map(({ to, label, icon: Icon }) => (
            <WithTip key={to} show={collapsed} label={label}>
              <Link
                to={to}
                onClick={onNavigate}
                activeOptions={{ exact: true }}
                className={cn(navItem, collapsed && "justify-center px-0")}
                activeProps={{ className: navActive }}
              >
                <Icon className="size-[18px] shrink-0" />
                {!collapsed && <span className="flex-1">{label}</span>}
                {!collapsed && to === "/friends" && onlineFriends > 0 && (
                  <span className="rounded-full bg-online/15 px-2 py-0.5 text-[11px] font-semibold text-online">
                    {onlineFriends} online
                  </span>
                )}
              </Link>
            </WithTip>
          ))}
        </nav>

        <div className={cn("mt-6 flex items-center justify-between px-6", collapsed && "justify-center px-2")}>
          {!collapsed ? (
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your rooms</span>
          ) : (
            <span className="h-px w-8 bg-border" />
          )}
          {!collapsed && <span className="text-xs text-muted-foreground">{joined.length}</span>}
        </div>

        <div className={cn("mt-2 min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 scrollbar-thin", collapsed && "px-2")}>
          {joined.length === 0 && !collapsed && (
            <p className="px-3 py-4 text-xs text-muted-foreground">No rooms yet. Explore or create one!</p>
          )}
          {joined.map((room) => {
            const count = unread[room.id] ?? 0;
            const muted = mutedIds.includes(room.id);
            return (
              <WithTip key={room.id} show={collapsed} label={room.name}>
                <Link
                  to="/rooms/$roomId"
                  params={{ roomId: room.id }}
                  onClick={onNavigate}
                  className={cn(navItem, "py-2", collapsed && "justify-center px-0")}
                  activeProps={{ className: navActive }}
                >
                  <span className="relative">
                    <RoomIcon room={room} size="sm" />
                    {collapsed && count > 0 && (
                      <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-primary ring-2 ring-sidebar" />
                    )}
                  </span>
                  {!collapsed && (
                    <>
                      <span className={cn("flex-1 truncate", count > 0 && !muted && "font-semibold text-foreground")}>
                        {room.name}
                      </span>
                      {muted && <BellOff className="size-3.5 text-muted-foreground" />}
                      {count > 0 && !muted && (
                        <span className="min-w-5 rounded-full bg-gradient-primary px-1.5 py-0.5 text-center text-[11px] font-bold text-primary-foreground shadow-glow">
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </WithTip>
            );
          })}
        </div>

        <div className={cn("space-y-2 border-t border-sidebar-border p-3", collapsed && "p-2")}>
          <WithTip show={collapsed} label="Create Room">
            <Button
              variant="hero"
              size={collapsed ? "icon" : "lg"}
              className={cn("w-full", collapsed && "mx-auto flex size-10")}
              onClick={() => {
                setCreateRoomOpen(true);
                onNavigate?.();
              }}
            >
              <Plus className="size-5" />
              {!collapsed && "Create Room"}
            </Button>
          </WithTip>
          <WithTip show={collapsed} label="Settings">
            <Link
              to="/settings"
              onClick={onNavigate}
              className={cn(navItem, collapsed && "justify-center px-0")}
              activeProps={{ className: navActive }}
            >
              <Settings className="size-[18px]" />
              {!collapsed && "Settings"}
            </Link>
          </WithTip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function Sidebar() {
  const { sidebarCollapsed } = useChat();
  return (
    <aside
      className={cn(
        "relative hidden h-dvh shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-out md:block",
        sidebarCollapsed ? "w-[76px]" : "w-[272px]",
      )}
    >
      <SidebarContent collapsed={sidebarCollapsed} />
    </aside>
  );
}
