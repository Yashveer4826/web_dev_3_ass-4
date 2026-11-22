import { createFileRoute } from "@tanstack/react-router";
import { Check, MessageCircle, Search, UserPlus, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { UserAvatar } from "@/components/common/UserAvatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { statusLabel } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { useChat } from "@/store/chat-store";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: "Friends — VibeRooms" },
      { name: "description", content: "See which friends are online on VibeRooms, accept requests and add new friends." },
      { property: "og:title", content: "Friends — VibeRooms" },
      { property: "og:description", content: "See who's online and add new friends." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FriendsPage,
});

type Tab = "Online" | "All" | "Pending";

function FriendsPage() {
  const { friends, users, acceptFriend, declineFriend } = useChat();
  const [tab, setTab] = useState<Tab>("Online");
  const [query, setQuery] = useState("");
  const [addName, setAddName] = useState("");

  const accepted = friends.filter((f) => !f.pending);
  const pending = friends.filter((f) => f.pending);
  const onlineCount = accepted.filter((f) => users[f.userId]?.status !== "offline").length;

  const base = tab === "Pending" ? pending : tab === "Online" ? accepted.filter((f) => users[f.userId]?.status !== "offline") : accepted;
  const list = base.filter((f) => {
    const u = users[f.userId];
    const q = query.trim().toLowerCase();
    return u && (!q || u.name.toLowerCase().includes(q) || u.handle.includes(q));
  });

  const tabs: { id: Tab; count: number }[] = [
    { id: "Online", count: onlineCount },
    { id: "All", count: accepted.length },
    { id: "Pending", count: pending.length },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <PageHeader title="Friends" subtitle={`${onlineCount} online now`} />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-8 md:py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = addName.trim().replace(/^@/, "");
            if (!name) return;
            toast.success(`Friend request sent to @${name}`, { description: "They'll show up here once they accept." });
            setAddName("");
          }}
          className="relative overflow-hidden rounded-2xl bg-hero p-5 sm:p-6"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <UserPlus className="size-5 text-primary" /> Add a friend
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Know their username? Send a request.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="@username"
              aria-label="Friend username"
              className="h-11 min-w-0 flex-1 rounded-xl glass px-4 text-sm outline-none placeholder:text-muted-foreground focus:glow-ring"
            />
            <Button type="submit" variant="hero" size="lg" className="h-11" disabled={!addName.trim()}>
              Send request
            </Button>
          </div>
        </form>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-xl border border-border bg-card p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all sm:px-4",
                  t.id === tab ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.id}
                <span className={cn("rounded-full px-1.5 text-[11px]", t.id === tab ? "bg-primary-foreground/20" : "bg-accent")}>{t.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 sm:w-64">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search friends"
              aria-label="Search friends"
              className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon={Users}
            title={tab === "Pending" ? "No pending requests" : "Nobody here yet"}
            description={tab === "Pending" ? "Friend requests you receive will show up here." : "Try another search, or add someone new above."}
          />
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {list.map((f) => {
              const u = users[f.userId]!;
              return (
                <div key={u.id} className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/40 animate-rise">
                  <UserAvatar user={u} size="lg" showStatus ringClassName="ring-card" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {u.name} <span className="text-sm font-normal text-muted-foreground">@{u.handle}</span>
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {f.pending ? `Wants to be friends · ${f.mutualRooms} mutual room${f.mutualRooms === 1 ? "" : "s"}` : `${statusLabel[u.status]} · ${u.bio}`}
                    </p>
                  </div>
                  {f.pending ? (
                    <div className="flex gap-1.5">
                      <Button
                        size="icon-sm"
                        variant="hero"
                        aria-label={`Accept ${u.name}`}
                        onClick={() => {
                          acceptFriend(u.id);
                          toast.success(`You and ${u.name.split(" ")[0]} are now friends`);
                        }}
                      >
                        <Check />
                      </Button>
                      <Button size="icon-sm" variant="ghost" aria-label={`Decline ${u.name}`} onClick={() => declineFriend(u.id)}>
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="soft"
                      onClick={() => toast("Direct messages coming soon", { description: `For now, catch ${u.name.split(" ")[0]} in a shared room.` })}
                    >
                      <MessageCircle /> <span className="hidden sm:inline">Message</span>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
