import { FileText, Image as ImageIcon, BarChart3, Paperclip, SendHorizonal, Smile, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CURRENT_USER_ID } from "@/data/mock";
import { shouldSendOnKey } from "@/lib/chat-utils";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/chat-service";
import type { Message, User } from "@/types/chat";
import { EmojiPicker } from "./EmojiPicker";

interface Props {
  roomId: string;
  roomName: string;
  replyTo: Message | null;
  replyAuthor?: User;
  onCancelReply: () => void;
  onSend: (text: string) => void;
}

const ATTACH_OPTIONS = [
  { label: "Photo or video", icon: ImageIcon },
  { label: "Document", icon: FileText },
  { label: "Poll", icon: BarChart3 },
];

export function MessageInput({ roomId, roomName, replyTo, replyAuthor, onCancelReply, onSend }: Props) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-grow the textarea up to a max height.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  useEffect(() => {
    if (replyTo) ref.current?.focus();
  }, [replyTo]);

  useEffect(() => {
    setText("");
  }, [roomId]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
    chatService.setTyping(roomId, false);
    ref.current?.focus();
  };

  const handleChange = (value: string) => {
    setText(value);
    chatService.setTyping(roomId, true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => chatService.setTyping(roomId, false), 1500);
  };

  const insertEmoji = (emoji: string) => {
    const el = ref.current;
    if (!el) return setText((t) => t + emoji);
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + emoji + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const canSend = text.trim().length > 0;

  return (
    <div className="shrink-0 px-3 pb-3 pt-1 sm:px-4 md:px-6 md:pb-5">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl glass shadow-soft transition-shadow focus-within:glow-ring">
          {replyTo && (
            <div className="flex items-center gap-3 border-b border-border px-4 py-2.5 animate-msg-in">
              <span className="h-8 w-1 rounded-full bg-gradient-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-primary">
                  Replying to {replyTo.userId === CURRENT_USER_ID ? "yourself" : (replyAuthor?.name ?? "message")}
                </p>
                <p className="truncate text-xs text-muted-foreground">{replyTo.text}</p>
              </div>
              <button type="button" onClick={onCancelReply} className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Cancel reply">
                <X className="size-4" />
              </button>
            </div>
          )}
          <div className="flex items-end gap-1 p-2">
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Add attachment">
                  <Paperclip className="size-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" sideOffset={10} className="w-52 rounded-xl border-border bg-popover p-1.5 shadow-panel">
                {ATTACH_OPTIONS.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toast("Attachments coming soon", { description: `${label} sharing will work once the server is connected.` })}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm hover:bg-accent"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-primary-soft text-primary">
                      <Icon className="size-4" />
                    </span>
                    {label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <textarea
              ref={ref}
              rows={1}
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (shouldSendOnKey({ key: e.key, shiftKey: e.shiftKey, isComposing: e.nativeEvent.isComposing })) {
                  e.preventDefault();
                  send();
                } else if (e.key === "Escape" && replyTo) {
                  onCancelReply();
                }
              }}
              placeholder={`Message #${roomName}`}
              aria-label="Message"
              className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-normal outline-none placeholder:text-muted-foreground scrollbar-thin"
            />

            <EmojiPicker onSelect={insertEmoji}>
              <button type="button" className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Insert emoji">
                <Smile className="size-5" />
              </button>
            </EmojiPicker>

            <button
              type="button"
              onClick={send}
              disabled={!canSend}
              aria-label="Send message"
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl transition-all",
                canSend
                  ? "bg-gradient-primary text-primary-foreground shadow-glow hover:scale-105 active:scale-95"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <SendHorizonal className="size-[18px]" />
            </button>
          </div>
        </div>
        <p className="mt-1.5 hidden px-2 text-[11px] text-muted-foreground md:block">
          <kbd className="font-sans font-semibold text-foreground/80">Enter</kbd> to send ·{" "}
          <kbd className="font-sans font-semibold text-foreground/80">Shift + Enter</kbd> for a new line
        </p>
      </div>
    </div>
  );
}
