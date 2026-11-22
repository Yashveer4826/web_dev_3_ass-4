import { UserAvatar } from "@/components/common/UserAvatar";
import type { User } from "@/types/chat";

export function TypingIndicator({ users }: { users: User[] }) {
  if (users.length === 0) return null;
  const first = users[0]!;
  const label =
    users.length === 1
      ? `${first.name.split(" ")[0]} is typing`
      : users.length === 2
        ? `${first.name.split(" ")[0]} and ${users[1]!.name.split(" ")[0]} are typing`
        : "Several people are typing";
  return (
    <div className="flex items-center gap-2.5 px-4 pb-1 pt-2 animate-msg-in md:px-6" aria-live="polite">
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((u) => (
          <UserAvatar key={u.id} user={u} size="xs" className="rounded-full ring-2 ring-background" />
        ))}
      </div>
      <div className="flex items-center gap-1 rounded-full bg-surface-raised px-3 py-2">
        <span className="size-1.5 rounded-full bg-primary typing-dot" />
        <span className="size-1.5 rounded-full bg-primary typing-dot [animation-delay:150ms]" />
        <span className="size-1.5 rounded-full bg-primary typing-dot [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-muted-foreground">{label}…</span>
    </div>
  );
}
