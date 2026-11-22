import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TONES, toneClass, statusLabel } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { useChat, useJoinedRooms } from "@/store/chat-store";
import type { Tone } from "@/types/chat";

export function ProfileDialog() {
  const { me, profileOpen, setProfileOpen, updateProfile, friends } = useChat();
  const joined = useJoinedRooms();
  const [name, setName] = useState(me.name);
  const [bio, setBio] = useState(me.bio);
  const [tone, setTone] = useState<Tone>(me.tone);

  useEffect(() => {
    if (profileOpen) {
      setName(me.name);
      setBio(me.bio);
      setTone(me.tone);
    }
  }, [profileOpen, me]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), bio: bio.trim(), tone });
    setProfileOpen(false);
    toast.success("Profile updated");
  };

  return (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogContent className="rounded-2xl border-border bg-popover p-0 shadow-panel sm:max-w-md">
        <div className="relative h-24 rounded-t-2xl bg-hero" />
        <div className="-mt-12 px-6">
          <UserAvatar user={{ ...me, name: name || me.name, tone }} size="xl" showStatus ringClassName="ring-popover" className="rounded-full ring-4 ring-popover" />
        </div>
        <form onSubmit={save} className="space-y-4 px-6 pb-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl">{me.name}</DialogTitle>
            <DialogDescription>
              @{me.handle} · {statusLabel[me.status]} · {joined.length} rooms · {friends.filter((f) => !f.pending).length} friends
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="p-name">Display name</Label>
            <Input id="p-name" value={name} maxLength={32} onChange={(e) => setName(e.target.value)} className="rounded-xl bg-surface" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-bio">Bio</Label>
            <Textarea id="p-bio" value={bio} maxLength={120} onChange={(e) => setBio(e.target.value)} className="min-h-20 resize-none rounded-xl bg-surface" />
          </div>
          <div className="space-y-2">
            <Label>Avatar color</Label>
            <div className="flex flex-wrap gap-2.5">
              {TONES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTone(t)}
                  aria-label={`Avatar color ${t}`}
                  className={cn(
                    "size-7 rounded-full transition-transform hover:scale-110",
                    toneClass[t],
                    t === tone && "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-popover",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setProfileOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
