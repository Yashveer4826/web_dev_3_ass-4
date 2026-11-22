import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Ghost } from "lucide-react";
import { ChatRoomView } from "@/components/chat/ChatRoomView";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ROOMS } from "@/data/mock";
import { useChat } from "@/store/chat-store";

export const Route = createFileRoute("/rooms/$roomId")({
  head: ({ params }) => {
    const name = ROOMS.find((r) => r.id === params.roomId)?.name ?? "Chat room";
    return {
      meta: [
        { title: `${name} — VibeRooms` },
        { name: "description", content: `Join the conversation in ${name} on VibeRooms.` },
        { property: "og:title", content: `${name} — VibeRooms` },
        { property: "og:description", content: `Join the conversation in ${name} on VibeRooms.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: RoomPage,
});

function RoomPage() {
  const { roomId } = Route.useParams();
  const { rooms } = useChat();
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return (
      <div className="h-full overflow-y-auto">
        <PageHeader title="Room not found" />
        <EmptyState
          icon={Ghost}
          title="This room has vanished"
          description="It may have been deleted, or the link is wrong. Plenty of other rooms are buzzing though."
          action={
            <Button asChild variant="hero">
              <Link to="/explore">
                <Compass /> Explore rooms
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return <ChatRoomView room={room} />;
}
