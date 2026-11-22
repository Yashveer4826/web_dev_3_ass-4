import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Layers, Plus } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/button";
import { CURRENT_USER_ID } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useChat, useJoinedRooms } from "@/store/chat-store";

export const Route = createFileRoute("/rooms/")({
  head: () => ({
    meta: [
      { title: "My Rooms — VibeRooms" },
      { name: "description", content: "All the VibeRooms chat rooms you've joined or created, in one place." },
      { property: "og:title", content: "My Rooms — VibeRooms" },
      { property: "og:description", content: "All the chat rooms you've joined or created." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyRoomsPage,
});

const TABS = ["All", "Unread", "Created by me"] as const;

function MyRoomsPage() {
  const { unread, setCreateRoomOpen } = useChat();
  const joined = useJoinedRooms();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  const list = joined.filter((r) =>
    tab === "Unread" ? (unread[r.id] ?? 0) > 0 : tab === "Created by me" ? r.ownerId === CURRENT_USER_ID : true,
  );

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <PageHeader
        title="My Rooms"
        subtitle={`${joined.length} room${joined.length === 1 ? "" : "s"} you're part of`}
        actions={
          <Button variant="hero" size="sm" onClick={() => setCreateRoomOpen(true)}>
            <Plus /> <span className="hidden sm:inline">Create Room</span>
          </Button>
        }
      />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-8">
        <div className="inline-flex rounded-xl border border-border bg-card p-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all sm:px-4",
                t === tab ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={tab === "All" ? "No rooms yet" : tab === "Unread" ? "All caught up ✨" : "You haven't created a room"}
            description={
              tab === "Unread"
                ? "No unread messages in your rooms. Go say something fun."
                : "Rooms you join or create will live here. Find a community or start your own."
            }
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="hero" onClick={() => setCreateRoomOpen(true)}>
                  <Plus /> Create Room
                </Button>
                <Button asChild variant="glass">
                  <Link to="/explore">
                    <Compass /> Explore
                  </Link>
                </Button>
              </div>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((r, i) => (
              <RoomCard key={r.id} room={r} style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
