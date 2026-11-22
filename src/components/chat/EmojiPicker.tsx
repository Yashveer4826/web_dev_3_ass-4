import { useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const QUICK_REACTIONS = ["👍", "❤️", "😂", "🔥", "😮", "🙏"];

const CATEGORIES: { label: string; icon: string; emojis: string[] }[] = [
  { label: "Smileys", icon: "😀", emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😋", "😛", "😜", "🤪", "🤗", "🤭", "🤔", "🤐", "😐", "😏", "😒", "🙄", "😬", "😌", "😴", "🥳", "😎", "🤓", "🧐", "😮", "😲", "🥺", "😢", "😭", "😤", "😡", "🤯", "😳", "🥶", "😱", "💀", "👀"] },
  { label: "Gestures", icon: "👍", emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "✋", "👋", "🤚", "🖐️", "👏", "🙌", "🫶", "👐", "🤝", "🙏", "💪", "🫡", "🤌"] },
  { label: "Hearts", icon: "❤️", emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "✨", "⭐", "🌟", "💫", "🔥", "💯"] },
  { label: "Things", icon: "🎮", emojis: ["🎮", "🎧", "🎵", "🎸", "🎹", "📚", "💻", "⌨️", "🖥️", "📱", "☕", "🍕", "🍜", "🍿", "🎬", "📸", "🎨", "🚀", "🏆", "🎯", "🎉", "🎁", "💡", "📌", "🌧️", "🌙", "☀️", "🌈"] },
];

export function EmojiPicker({
  onSelect,
  children,
  align = "end",
  side = "top",
}: {
  onSelect: (emoji: string) => void;
  children: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState(0);
  const current = CATEGORIES[cat] ?? CATEGORIES[0]!;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align={align} side={side} sideOffset={10} className="w-[300px] rounded-2xl border-border bg-popover p-0 shadow-panel">
        <div className="flex items-center gap-1 border-b border-border p-2">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => setCat(i)}
              className={cn(
                "flex flex-1 items-center justify-center rounded-lg py-1.5 text-lg transition-colors hover:bg-accent",
                i === cat && "bg-accent",
              )}
              aria-label={c.label}
            >
              {c.icon}
            </button>
          ))}
        </div>
        <p className="px-3 pt-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{current.label}</p>
        <div className="grid max-h-56 grid-cols-8 gap-0.5 overflow-y-auto p-2 scrollbar-thin">
          {current.emojis.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                onSelect(e);
                setOpen(false);
              }}
              className="flex aspect-square items-center justify-center rounded-lg text-xl transition-transform hover:scale-125 hover:bg-accent"
            >
              {e}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
