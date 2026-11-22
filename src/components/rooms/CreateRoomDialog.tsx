import { useNavigate } from "@tanstack/react-router";
import { Globe, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RoomIcon } from "@/components/common/RoomIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ROOM_CATEGORIES, ROOM_ICONS, ROOM_ICON_KEYS } from "@/lib/room-icons";
import { TONES, toneClass } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { useChat } from "@/store/chat-store";
import type { RoomCategory, RoomIconKey, Tone } from "@/types/chat";

const fieldClass = "rounded-xl border-input bg-surface focus-visible:ring-2 focus-visible:ring-ring";

export function CreateRoomDialog() {
  const { createRoomOpen, setCreateRoomOpen, createRoom } = useChat();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RoomCategory>("Technology");
  const [isPrivate, setIsPrivate] = useState(false);
  const [icon, setIcon] = useState<RoomIconKey>("rocket");
  const [tone, setTone] = useState<Tone>("violet");
  const [touched, setTouched] = useState(false);

  const nameError = touched && name.trim().length < 3 ? "Room name needs at least 3 characters" : null;

  const reset = () => {
    setName("");
    setDescription("");
    setCategory("Technology");
    setIsPrivate(false);
    setIcon("rocket");
    setTone("violet");
    setTouched(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (name.trim().length < 3) return;
    const room = createRoom({ name, description, category, isPrivate, icon, tone });
    setCreateRoomOpen(false);
    reset();
    toast.success(`${room.name} is live`, { description: "Invite people and start the conversation." });
    navigate({ to: "/rooms/$roomId", params: { roomId: room.id } });
  };

  return (
    <Dialog
      open={createRoomOpen}
      onOpenChange={(o) => {
        setCreateRoomOpen(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="max-h-[92dvh] overflow-y-auto rounded-2xl border-border bg-popover p-0 shadow-panel sm:max-w-xl scrollbar-thin">
        <div className="relative overflow-hidden rounded-t-2xl bg-hero px-6 pb-6 pt-7">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/30 blur-3xl" />
          <DialogHeader className="relative text-left">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="size-5 text-primary" /> Create a room
            </DialogTitle>
            <DialogDescription>Give your people a place to hang out.</DialogDescription>
          </DialogHeader>
          <div className="relative mt-5 flex items-center gap-4 rounded-2xl glass p-4">
            <RoomIcon room={{ icon, tone }} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-display font-semibold">{name.trim() || "Your room name"}</p>
              <p className="truncate text-sm text-muted-foreground">{description.trim() || "A short description goes here"}</p>
              <div className="mt-1.5 flex gap-1.5 text-[11px]">
                <span className="rounded-full bg-accent px-2 py-0.5 font-medium">{category}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-medium">
                  {isPrivate ? <Lock className="size-3" /> : <Globe className="size-3" />}
                  {isPrivate ? "Private" : "Public"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5 px-6 pb-6 pt-5">
          <div className="space-y-2">
            <Label htmlFor="room-name">Room name</Label>
            <Input
              id="room-name"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="e.g. Late Night Coders"
              className={cn(fieldClass, nameError && "border-destructive")}
              autoFocus
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-desc">Description</Label>
            <Textarea
              id="room-desc"
              value={description}
              maxLength={140}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this room about?"
              className={cn(fieldClass, "min-h-20 resize-none")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as RoomCategory)}>
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-popover">
                  {ROOM_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="rounded-lg">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-private">Visibility</Label>
              <label
                htmlFor="room-private"
                className="flex h-9 cursor-pointer items-center justify-between rounded-xl border border-input bg-surface px-3"
              >
                <span className="flex items-center gap-2 text-sm">
                  {isPrivate ? <Lock className="size-4 text-primary" /> : <Globe className="size-4 text-primary" />}
                  {isPrivate ? "Private — invite only" : "Public — anyone can join"}
                </span>
                <Switch id="room-private" checked={isPrivate} onCheckedChange={setIsPrivate} />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Room icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {ROOM_ICON_KEYS.map((key) => {
                const Icon = ROOM_ICONS[key];
                const active = key === icon;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setIcon(key)}
                    aria-label={`Icon ${key}`}
                    aria-pressed={active}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition-all hover:text-foreground hover:border-primary/40",
                      active && "glow-ring border-transparent bg-accent text-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2.5">
              {TONES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTone(t)}
                  aria-label={`Color ${t}`}
                  aria-pressed={t === tone}
                  className={cn(
                    "size-8 rounded-full transition-transform hover:scale-110",
                    toneClass[t],
                    t === tone && "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-popover",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => setCreateRoomOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" size="lg">
              <Sparkles /> Create Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
