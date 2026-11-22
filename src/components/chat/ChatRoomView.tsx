import { useNavigate } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { RoomIcon } from "@/components/common/RoomIcon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatCount } from "@/lib/chat-utils";
import { cn } from "@/lib/utils";
import { useChat } from "@/store/chat-store";
import type { Message, Room, User } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { InviteDialog } from "./InviteDialog";
import { MembersPanelBody } from "./MembersPanel";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

const EMPTY: Message[] = [];

export function ChatRoomView({ room }: { room: Room }) {
  const chat = useChat();
  const navigate = useNavigate();
  const { users, messages, typing, joinedIds, mutedIds, setActiveRoom, membersPanelOpen, setMembersPanelOpen } = chat;

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [membersSheet, setMembersSheet] = useState(false);

  const roomMessages = messages[room.id] ?? EMPTY;
  const joined = joinedIds.includes(room.id);
  const muted = mutedIds.includes(room.id);
  const typingUsers = useMemo(
    () => (typing[room.id] ?? []).map((id) => users[id]).filter((u): u is User => Boolean(u)),
    [typing, room.id, users],
  );
  const onlineCount = room.memberIds.filter((id) => users[id]?.status !== "offline").length;

  useEffect(() => {
    setActiveRoom(room.id);
    setSearch("");
    setSearchOpen(false);
    setReplyTo(null);
    return () => setActiveRoom(null);
  }, [room.id, setActiveRoom]);

  // Keep unread at zero while new messages land in the open room.
  useEffect(() => {
    setActiveRoom(room.id);
  }, [roomMessages.length, room.id, setActiveRoom]);

  const toggleMembers = () => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches) {
      setMembersPanelOpen(!membersPanelOpen);
    } else {
      setMembersSheet(true);
    }
  };

  return (
    <div className="flex h-full min-h-0">
      <div className="relative flex min-w-0 flex-1 flex-col bg-dots">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <ChatHeader
          room={room}
          onlineCount={onlineCount}
          joined={joined}
          muted={muted}
          searchOpen={searchOpen}
          search={search}
          membersActive={membersPanelOpen}
          onSearchOpen={(o) => {
            setSearchOpen(o);
            if (!o) setSearch("");
          }}
          onSearchChange={setSearch}
          onOpenMenu={() => chat.setMobileNavOpen(true)}
          onInvite={() => setInviteOpen(true)}
          onToggleMembers={toggleMembers}
          onToggleMute={() => {
            chat.toggleMute(room.id);
            toast(muted ? `${room.name} unmuted` : `${room.name} muted`);
          }}
          onLeave={() => {
            chat.leaveRoom(room.id);
            toast(`You left ${room.name}`);
            navigate({ to: "/rooms" });
          }}
        />

        <MessageList
          room={room}
          messages={roomMessages}
          users={users}
          typingUsers={typingUsers}
          search={search}
          onReact={(id, emoji) => chat.toggleReaction(room.id, id, emoji)}
          onReply={(m) => setReplyTo(m)}
        />

        {joined ? (
          <MessageInput
            roomId={room.id}
            roomName={room.name}
            replyTo={replyTo}
            replyAuthor={replyTo ? users[replyTo.userId] : undefined}
            onCancelReply={() => setReplyTo(null)}
            onSend={(text) => {
              chat.sendMessage(room.id, text, replyTo?.id);
              setReplyTo(null);
            }}
          />
        ) : (
          <div className="shrink-0 px-3 pb-4 pt-1 md:px-6 md:pb-5">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 rounded-2xl glass p-4 text-center sm:flex-row sm:text-left">
              <RoomIcon room={room} size="md" />
              <div className="flex-1">
                <p className="font-semibold">You're previewing {room.name}</p>
                <p className="text-sm text-muted-foreground">Join {formatCount(room.memberCount)} members to start chatting.</p>
              </div>
              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  chat.joinRoom(room.id);
                  toast.success(`Welcome to ${room.name}! 🎉`);
                }}
              >
                Join Room
              </Button>
            </div>
          </div>
        )}
      </div>

      <aside
        className={cn(
          "hidden shrink-0 overflow-hidden border-l border-border bg-surface transition-[width] duration-300 xl:block",
          membersPanelOpen ? "w-72" : "w-0 border-l-0",
        )}
        aria-label="Members"
      >
        <div className="h-full w-72">
          <MembersPanelBody room={room} users={users} onClose={() => setMembersPanelOpen(false)} />
        </div>
      </aside>

      <Sheet open={membersSheet} onOpenChange={setMembersSheet}>
        <SheetContent side="right" className="w-[86vw] max-w-xs border-border bg-surface p-0">
          <SheetTitle className="sr-only">
            <Users /> Members
          </SheetTitle>
          <MembersPanelBody room={room} users={users} />
        </SheetContent>
      </Sheet>

      <InviteDialog room={room} open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
