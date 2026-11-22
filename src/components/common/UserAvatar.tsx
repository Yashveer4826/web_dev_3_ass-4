import { cn } from "@/lib/utils";
import { initials } from "@/lib/chat-utils";
import { statusDot, toneClass } from "@/lib/tones";
import type { User } from "@/types/chat";

const sizes = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-20 text-2xl",
} as const;

const dotSizes = {
  xs: "size-2 ring-[1.5px]",
  sm: "size-2.5 ring-2",
  md: "size-3 ring-2",
  lg: "size-3.5 ring-[3px]",
  xl: "size-5 ring-4",
} as const;

interface Props {
  user: Pick<User, "name" | "tone" | "status">;
  size?: keyof typeof sizes;
  showStatus?: boolean;
  className?: string;
  ringClassName?: string;
}

export function UserAvatar({ user, size = "md", showStatus = false, className, ringClassName = "ring-background" }: Props) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full font-display font-semibold text-primary-foreground select-none",
          toneClass[user.tone],
          sizes[size],
        )}
        aria-hidden
      >
        {initials(user.name)}
      </span>
      {showStatus && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full",
            statusDot[user.status],
            dotSizes[size],
            ringClassName,
            user.status === "online" && "animate-pulse-ring",
          )}
          aria-label={user.status}
        />
      )}
    </span>
  );
}
