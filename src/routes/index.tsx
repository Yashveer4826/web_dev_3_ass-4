import { createFileRoute, Link } from "@tanstack/react-router";
import { useHydrated } from "@tanstack/react-router";
import { ArrowRight, Compass, Layers, MessageSquareText, Plus, Sparkles, Users } from "lucide-react";
import { useMemo } from "react";
import { TimeLabel } from "@/components/common/Hydrated";
import { RoomIcon } from "@/components/common/RoomIcon";
import { UserAvatar } from "@/components/common/UserAvatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/button";
import { CURRENT_USER_ID } from "@/data/mock";
import { dayKeyOf } from "@/lib/chat-utils";
import { cn } from "@/lib/utils";
import { useChat, useJoinedRooms } from "@/store/chat-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — VibeRooms" },
      { name: "description", content: "Your VibeRooms dashboard: active rooms, friends online and new rooms to discover." },
      { property: "og:title", content: "Home — VibeRooms" },
      { property: "og:description", content: "Your space. Your people. Your conversations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function StatCard({ icon: Icon, label, value, hint, delay }: { icon: typeof Users; label: string; value: string; hint: string; delay: number }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 animate-rise" style={{ animationDelay: `${delay}ms` }}>
      <div className="absolute -right-6 -top-6 size-24 rounded-full bg-primary/10 blur-2xl transition-colors group-hover:bg-primary/25" />
      <div className="relative flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary-soft text-primary">
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="relative mt-3 font-display text-3xl font-bold">{value}</p>
      <p className="relative mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function HomePage() {
  const { me, rooms, joinedIds, messages, unread, friends, users, setCreateRoomOpen } = useChat();
  const joined = useJoinedRooms();
  const hydrated = useHydrated();

  const onlineFriends = friends.filter((f) => !f.pending && users[f.userId]?.status === "online");
  const messagesToday = useMemo(() => {
    if (!hydrated) return null;
    const today = dayKeyOf(Date.now());
    return joinedIds.reduce((sum, id) => sum + (messages[id] ?? []).filter((m) => dayKeyOf(m.createdAt) === today).length, 0);
  }, [hydrated, joinedIds, messages]);

  const recent = useMemo(
    () =>
      joined
        .map((room) => {
          const list = messages[room.id] ?? [];
          return { room, last: list[list.length - 1] };
        })
        .sort((a, b) => (b.last?.createdAt ?? 0) - (a.last?.createdAt ?? 0))
        .slice(0, 5),
    [joined, messages],
  );
  const discover = rooms.filter((r) => !joinedIds.includes(r.id)).slice(0, 3);
  const totalUnread = joinedIds.reduce((s, id) => s + (unread[id] ?? 0), 0);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <PageHeader title="Home" subtitle={`Welcome back, ${me.name}`} />
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-8 md:py-8">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-hero p-6 shadow-panel sm:p-10 animate-rise">
          <div className="pointer-events-none absolute right-8 top-6 size-40 rounded-full bg-primary/40 blur-3xl animate-float-slow" />
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs font-semibold">
                <Sparkles className="size-3.5 text-primary" /> {totalUnread > 0 ? `${totalUnread} unread messages waiting` : "You're all caught up"}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] sm:text-5xl">
                <span className="text-gradient">Your space. Your people. Your conversations.</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
                Hey {me.name.split(" ")[0]} 👋 — jump back into your rooms, catch up with friends or start something new.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="hero" size="xl" onClick={() => setCreateRoomOpen(true)}>
                  <Plus /> Create Room
                </Button>
                <Button asChild variant="glass" size="xl">
                  <Link to="/explore">
                    <Compass /> Explore rooms
                  </Link>
                </Button>
              </div>
            </div>
            {/* Floating preview stack */}
            <div className="relative hidden h-56 lg:block" aria-hidden>
              {recent.slice(0, 3).map(({ room, last }, i) => {
                const author = last ? users[last.userId] : undefined;
                return (
                  <div
                    key={room.id}
                    className={cn(
                      "absolute w-72 rounded-2xl glass p-3.5 shadow-panel animate-float-slow",
                      i === 0 && "right-4 top-0",
                      i === 1 && "right-24 top-[76px] [animation-delay:1.5s]",
                      i === 2 && "right-0 top-[152px] [animation-delay:3s]",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <RoomIcon room={room} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{room.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {author ? `${author.id === CURRENT_USER_ID ? "You" : author.name.split(" ")[0]}: ${last?.text}` : "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-3" aria-label="Quick stats">
          <StatCard icon={Layers} label="Rooms joined" value={String(joined.length)} hint={`${rooms.length} rooms on VibeRooms`} delay={60} />
          <StatCard icon={Users} label="Friends online" value={String(onlineFriends.length)} hint={`of ${friends.filter((f) => !f.pending).length} friends`} delay={120} />
          <StatCard icon={MessageSquareText} label="Messages today" value={messagesToday === null ? "—" : String(messagesToday)} hint="across your rooms" delay={180} />
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Recently active */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recently active</h2>
              <Link to="/rooms" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                All rooms <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {recent.length === 0 && <p className="p-6 text-sm text-muted-foreground">Join a room to see activity here.</p>}
              {recent.map(({ room, last }) => {
                const author = last ? users[last.userId] : undefined;
                const count = unread[room.id] ?? 0;
                return (
                  <Link
                    key={room.id}
                    to="/rooms/$roomId"
                    params={{ roomId: room.id }}
                    className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50"
                  >
                    <RoomIcon room={room} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("truncate font-medium", count > 0 && "font-semibold")}>{room.name}</p>
                        {last && <TimeLabel ts={last.createdAt} className="shrink-0 text-xs text-muted-foreground" />}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm text-muted-foreground">
                          {author ? (
                            <>
                              <span className="text-foreground/80">{author.id === CURRENT_USER_ID ? "You" : author.name.split(" ")[0]}:</span> {last?.text}
                            </>
                          ) : (
                            "No messages yet — say hi!"
                          )}
                        </p>
                        {count > 0 && (
                          <span className="min-w-5 shrink-0 rounded-full bg-gradient-primary px-1.5 py-0.5 text-center text-[11px] font-bold text-primary-foreground">{count}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Friends online */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Friends online</h2>
              <Link to="/friends" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                See all <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="space-y-1 rounded-2xl border border-border bg-card p-2">
              {onlineFriends.length === 0 && <p className="p-4 text-sm text-muted-foreground">No friends online right now.</p>}
              {onlineFriends.map((f) => {
                const u = users[f.userId];
                if (!u) return null;
                return (
                  <div key={u.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-accent/50">
                    <UserAvatar user={u} size="md" showStatus ringClassName="ring-card" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.bio}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Discover */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Discover new rooms</h2>
            <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Explore <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {discover.length === 0 ? (
            <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">You've joined every room. Legend. Create a new one?</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {discover.map((r, i) => (
                <RoomCard key={r.id} room={r} style={{ animationDelay: `${i * 70}ms` }} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
