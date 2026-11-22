import { ArrowDown, MessageCircleHeart, SearchX } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DayLabel, TimeLabel } from "@/components/common/Hydrated";
import { EmptyState } from "@/components/common/EmptyState";
import { UserAvatar } from "@/components/common/UserAvatar";
import { CURRENT_USER_ID } from "@/data/mock";
import { groupMessages } from "@/lib/chat-utils";
import { cn } from "@/lib/utils";
import type { Message, Room, User } from "@/types/chat";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";

interface Props {
  room: Room;
  messages: Message[];
  users: Record<string, User>;
  typingUsers: User[];
  search: string;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
}

export function MessageList({ room, messages, users, typingUsers, search, onReact, onReply }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const prevLen = useRef(messages.length);

  const query = search.trim();
  const visible = useMemo(
    () => (query ? messages.filter((m) => m.text.toLowerCase().includes(query.toLowerCase())) : messages),
    [messages, query],
  );
  const sections = useMemo(() => groupMessages(visible), [visible]);
  const byId = useMemo(() => new Map(messages.map((m) => [m.id, m])), [messages]);

  const scrollToBottom = (smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  // Jump to the bottom when switching rooms.
  useLayoutEffect(() => {
    scrollToBottom(false);
    prevLen.current = messages.length;
    setNewCount(0);
    setActiveId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id]);

  // New messages: follow along if mine or already at the bottom; otherwise count them.
  useEffect(() => {
    const added = messages.length - prevLen.current;
    prevLen.current = messages.length;
    if (added <= 0 || query) return;
    const last = messages[messages.length - 1];
    if (last?.userId === CURRENT_USER_ID || atBottom) {
      requestAnimationFrame(() => scrollToBottom(true));
    } else {
      setNewCount((c) => c + added);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  useEffect(() => {
    if (typingUsers.length && atBottom) requestAnimationFrame(() => scrollToBottom(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingUsers.length]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAtBottom(bottom);
    if (bottom) setNewCount(0);
  };

  const jumpTo = (id: string) => {
    const el = document.getElementById(`msg-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-primary/60", "rounded-2xl");
    setTimeout(() => el.classList.remove("ring-2", "ring-primary/60", "rounded-2xl"), 1400);
  };

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={scrollRef} onScroll={onScroll} className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin" onClick={(e) => e.target === e.currentTarget && setActiveId(null)}>
        <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-end px-3 pb-12 pt-6 sm:px-4 md:px-6">
          {messages.length === 0 && (
            <EmptyState
              icon={MessageCircleHeart}
              title={`Welcome to ${room.name}`}
              description="This room is brand new. Say hello, set the vibe, and invite your friends to join the conversation."
            />
          )}
          {messages.length > 0 && query && visible.length === 0 && (
            <EmptyState icon={SearchX} title="No matching messages" description={`Nothing in ${room.name} mentions “${query}”. Try another word.`} />
          )}
          {query && visible.length > 0 && (
            <p className="mb-4 text-center text-xs text-muted-foreground">
              {visible.length} message{visible.length === 1 ? "" : "s"} matching “{query}”
            </p>
          )}

          {sections.map((section) => (
            <section key={section.dayKey} aria-label="Messages">
              <div className="sticky top-2 z-[5] my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
                <span className="rounded-full glass px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <DayLabel ts={section.timestamp} />
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
              </div>

              <div className="space-y-4">
                {section.groups.map((group) => {
                  const isMine = group.userId === CURRENT_USER_ID;
                  const author = users[group.userId];
                  const first = group.messages[0]!;
                  return (
                    <div key={group.id} className={cn("flex gap-3", isMine && "justify-end")}>
                      {!isMine && author && <UserAvatar user={author} size="md" className="mt-0.5 hidden sm:inline-flex" />}
                      <div className={cn("flex min-w-0 flex-1 flex-col", isMine && "items-end")}>
                        {!isMine && (
                          <div className="mb-1 flex items-baseline gap-2 px-1">
                            <span className="text-sm font-semibold">{author?.name ?? "Unknown"}</span>
                            {room.ownerId === group.userId && (
                              <span className="rounded-md bg-gold/15 px-1.5 py-px text-[10px] font-bold uppercase tracking-wide text-gold">Owner</span>
                            )}
                            <TimeLabel ts={first.createdAt} className="text-[11px] text-muted-foreground" />
                          </div>
                        )}
                        <div className={cn("flex w-full flex-col gap-1", isMine && "items-end")}>
                          {group.messages.map((m, i) => {
                            const parent = m.replyToId ? byId.get(m.replyToId) : undefined;
                            return (
                              <MessageItem
                                key={m.id}
                                message={m}
                                isMine={isMine}
                                isFirst={i === 0}
                                isLast={i === group.messages.length - 1}
                                replyTo={parent ? { message: parent, author: users[parent.userId] } : undefined}
                                active={activeId === m.id}
                                highlight={query || undefined}
                                onActivate={() => setActiveId((a) => (a === m.id ? null : m.id))}
                                onReact={(e) => {
                                  onReact(m.id, e);
                                  setActiveId(null);
                                }}
                                onReply={() => {
                                  onReply(m);
                                  setActiveId(null);
                                }}
                                onJumpTo={jumpTo}
                                users={users}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <TypingIndicator users={typingUsers} />
      </div>

      {(!atBottom || newCount > 0) && !query && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow animate-rise"
        >
          <ArrowDown className="size-3.5" />
          {newCount > 0 ? `${newCount} new message${newCount === 1 ? "" : "s"}` : "Jump to latest"}
        </button>
      )}
    </div>
  );
}
