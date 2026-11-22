import { createFileRoute } from "@tanstack/react-router";
import { Flame, Plus, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/button";
import { ROOM_CATEGORIES } from "@/lib/room-icons";
import { cn } from "@/lib/utils";
import { useChat } from "@/store/chat-store";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Rooms — VibeRooms" },
      { name: "description", content: "Find and join chat rooms for gaming, tech, music, study, anime and more." },
      { property: "og:title", content: "Explore Rooms — VibeRooms" },
      { property: "og:description", content: "Find your people. Join rooms for gaming, tech, music, study and anime." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { rooms, setCreateRoomOpen } = useChat();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const publicRooms = rooms.filter((r) => !r.isPrivate);
  const usedCategories = ROOM_CATEGORIES.filter((c) => publicRooms.some((r) => r.category === c));
  const featured = publicRooms.filter((r) => r.featured);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publicRooms.filter((r) => {
      if (category !== "All" && r.category !== category) return false;
      if (!q) return true;
      return [r.name, r.description, r.category, ...r.tags].some((s) => s.toLowerCase().includes(q));
    });
  }, [publicRooms, query, category]);

  const browsing = query.trim() !== "" || category !== "All";

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <PageHeader
        title="Explore Rooms"
        subtitle="Find your people. Jump into a conversation."
        actions={
          <Button variant="hero" size="sm" onClick={() => setCreateRoomOpen(true)}>
            <Plus /> <span className="hidden sm:inline">Create Room</span>
          </Button>
        }
      />
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-8 md:py-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl glass px-4 shadow-soft transition-shadow focus-within:glow-ring">
            <Search className="size-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rooms, topics or tags…"
              aria-label="Search rooms"
              className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-thin md:mx-0 md:flex-wrap md:px-0">
            {["All", ...usedCategories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                  c === category
                    ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {!browsing && featured.length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Flame className="size-5 text-gold" /> Featured & popular
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {featured.map((r, i) => (
                <RoomCard key={r.id} room={r} style={{ animationDelay: `${i * 60}ms` }} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-lg font-semibold">
            {browsing ? `${filtered.length} room${filtered.length === 1 ? "" : "s"} found` : "All rooms"}
          </h2>
          {filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No rooms match that"
              description="Try a different search or category — or create the room you wish existed."
              action={
                <Button variant="hero" onClick={() => setCreateRoomOpen(true)}>
                  <Plus /> Create Room
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r, i) => (
                <RoomCard key={r.id} room={r} style={{ animationDelay: `${i * 50}ms` }} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
