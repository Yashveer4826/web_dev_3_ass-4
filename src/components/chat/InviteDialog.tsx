import { Check, Copy, Link2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useChat } from "@/store/chat-store";
import type { Room } from "@/types/chat";

export function InviteDialog({ room, open, onOpenChange }: { room: Room; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { friends, users } = useChat();
  const [invited, setInvited] = useState<string[]>([]);
  const link = `viberooms.app/join/${room.id}`;
  const candidates = friends.filter((f) => !f.pending && !room.memberIds.includes(f.userId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border bg-popover shadow-panel sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" /> Invite to {room.name}
          </DialogTitle>
          <DialogDescription>Share the link or invite friends directly.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1.5 pl-3">
          <Link2 className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-sm">{link}</span>
          <Button
            size="sm"
            variant="hero"
            onClick={() => {
              navigator.clipboard?.writeText(`https://${link}`).catch(() => {});
              toast.success("Invite link copied");
            }}
          >
            <Copy /> Copy
          </Button>
        </div>
        <div className="space-y-1">
          <p className="pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Friends</p>
          {candidates.length === 0 && <p className="py-3 text-sm text-muted-foreground">All your friends are already here 🎉</p>}
          {candidates.map((f) => {
            const u = users[f.userId];
            if (!u) return null;
            const done = invited.includes(u.id);
            return (
              <div key={u.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-accent/60">
                <UserAvatar user={u} size="sm" showStatus ringClassName="ring-popover" />
                <span className="flex-1 text-sm font-medium">{u.name}</span>
                <Button
                  size="sm"
                  variant={done ? "ghost" : "soft"}
                  disabled={done}
                  onClick={() => {
                    setInvited((i) => [...i, u.id]);
                    toast.success(`Invite sent to ${u.name.split(" ")[0]}`);
                  }}
                >
                  {done ? (
                    <>
                      <Check /> Sent
                    </>
                  ) : (
                    "Invite"
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
