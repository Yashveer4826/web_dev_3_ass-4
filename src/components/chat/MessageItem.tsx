import { Reply, SmilePlus } from "lucide-react";
import { TimeLabel } from "@/components/common/Hydrated";
import { CURRENT_USER_ID } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Message, User } from "@/types/chat";
import { EmojiPicker, QUICK_REACTIONS } from "./EmojiPicker";

interface Props {
  message: Message;
  isMine: boolean;
  isFirst: boolean;
  isLast: boolean;
  replyTo?: { message: Message; author?: User };
  active: boolean;
  highlight?: string;
  onActivate: () => void;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onJumpTo: (id: string) => void;
  users: Record<string, User>;
}

function Highlighted({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-gold/35 px-0.5 text-inherit">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function MessageItem({ message, isMine, isFirst, isLast, replyTo, active, highlight, onActivate, onReact, onReply, onJumpTo, users }: Props) {
  const reactions = Object.entries(message.reactions);

  return (
    <div
      id={`msg-${message.id}`}
      className={cn("group/msg relative flex flex-col animate-msg-in", isMine ? "items-end" : "items-start")}
    >
      <div className={cn("relative flex max-w-[min(85%,560px)] items-end gap-2", isMine && "flex-row-reverse")}>
        <div
          role="button"
          tabIndex={0}
          onClick={onActivate}
          onKeyDown={(e) => e.key === "Enter" && onActivate()}
          className={cn(
            "relative whitespace-pre-wrap break-words px-3.5 py-2 text-[14.5px] leading-relaxed outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring",
            isMine
              ? "bg-gradient-primary text-primary-foreground shadow-glow"
              : "bg-surface-raised text-foreground",
            "rounded-2xl",
            isMine ? !isFirst && "rounded-tr-md" : !isFirst && "rounded-tl-md",
            isMine ? !isLast && "rounded-br-md" : !isLast && "rounded-bl-md",
          )}
        >
          {replyTo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onJumpTo(replyTo.message.id);
              }}
              className={cn(
                "mb-1.5 block w-full rounded-lg border-l-2 px-2.5 py-1.5 text-left text-xs transition-opacity hover:opacity-90",
                isMine ? "border-primary-foreground/70 bg-primary-foreground/15" : "border-primary bg-background/40",
              )}
            >
              <span className={cn("block font-semibold", isMine ? "text-primary-foreground" : "text-primary")}>
                {replyTo.message.userId === CURRENT_USER_ID ? "You" : (replyTo.author?.name ?? "Someone")}
              </span>
              <span className={cn("line-clamp-1", isMine ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {replyTo.message.text}
              </span>
            </button>
          )}
          <Highlighted text={message.text} query={highlight} />
        </div>

        {/* Hover / tap toolbar */}
        <div
          className={cn(
            "absolute -top-9 z-10 flex items-center gap-0.5 rounded-full glass p-1 shadow-soft transition-all",
            isMine ? "right-0" : "left-0",
            active ? "visible opacity-100" : "invisible opacity-0 md:group-hover/msg:visible md:group-hover/msg:opacity-100",
          )}
        >
          {QUICK_REACTIONS.slice(0, 5).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onReact(e)}
              className="flex size-7 items-center justify-center rounded-full text-base transition-transform hover:scale-125 hover:bg-accent"
              aria-label={`React ${e}`}
            >
              {e}
            </button>
          ))}
          <EmojiPicker onSelect={onReact} align={isMine ? "end" : "start"}>
            <button type="button" className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="More reactions">
              <SmilePlus className="size-4" />
            </button>
          </EmojiPicker>
          <button type="button" onClick={onReply} className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Reply">
            <Reply className="size-4" />
          </button>
        </div>
      </div>

      {reactions.length > 0 && (
        <div className={cn("mt-1 flex flex-wrap gap-1", isMine && "justify-end")}>
          {reactions.map(([emoji, ids]) => {
            const mine = ids.includes(CURRENT_USER_ID);
            const names = ids.map((id) => (id === CURRENT_USER_ID ? "You" : users[id]?.name.split(" ")[0])).join(", ");
            return (
              <button
                key={emoji}
                type="button"
                title={names}
                onClick={() => onReact(emoji)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold transition-all hover:scale-105",
                  mine ? "border-primary/60 bg-primary/20 text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-sm">{emoji}</span>
                {ids.length}
              </button>
            );
          })}
        </div>
      )}

      {isLast && isMine && <TimeLabel ts={message.createdAt} className="mt-1 text-[11px] text-muted-foreground" />}
    </div>
  );
}
