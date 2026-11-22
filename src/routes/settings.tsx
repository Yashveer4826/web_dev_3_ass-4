import { createFileRoute } from "@tanstack/react-router";
import { Bell, LogOut, Pencil, Shield, Sparkles, Volume2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/common/UserAvatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { statusLabel } from "@/lib/tones";
import { useChat } from "@/store/chat-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — VibeRooms" },
      { name: "description", content: "Manage your VibeRooms profile, notifications and privacy." },
      { property: "og:title", content: "Settings — VibeRooms" },
      { property: "og:description", content: "Manage your profile, notifications and privacy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function Section({ icon: Icon, title, children }: { icon: typeof Bell; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card animate-rise">
      <h2 className="flex items-center gap-2 border-b border-border px-5 py-4 text-base font-semibold">
        <Icon className="size-4 text-primary" /> {title}
      </h2>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

function ToggleRow({ label, hint, defaultOn }: { label: string; hint: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <Switch
        checked={on}
        onCheckedChange={(v) => {
          setOn(v);
          toast(`${label} ${v ? "on" : "off"}`);
        }}
      />
    </label>
  );
}

function SettingsPage() {
  const { me, setProfileOpen, signOut } = useChat();
  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <PageHeader title="Settings" subtitle="Make VibeRooms feel like yours" />
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 md:px-8 md:py-8">
        <section className="flex flex-col items-start gap-4 rounded-2xl bg-hero p-5 sm:flex-row sm:items-center sm:p-6 animate-rise">
          <UserAvatar user={me} size="xl" showStatus ringClassName="ring-card" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold">{me.name}</p>
            <p className="text-sm text-muted-foreground">
              @{me.handle} · {statusLabel[me.status]}
            </p>
            <p className="mt-1 text-sm text-foreground/80">{me.bio}</p>
          </div>
          <Button variant="glass" onClick={() => setProfileOpen(true)}>
            <Pencil /> Edit profile
          </Button>
        </section>

        <Section icon={Bell} title="Notifications">
          <ToggleRow label="Desktop notifications" hint="Get notified when someone mentions you" defaultOn />
          <ToggleRow label="Unread badges" hint="Show unread counts in the sidebar" defaultOn />
          <ToggleRow label="Friend requests" hint="Notify me about new friend requests" defaultOn />
        </Section>

        <Section icon={Volume2} title="Chat">
          <ToggleRow label="Message sounds" hint="Play a soft sound for new messages" />
          <ToggleRow label="Enter to send" hint="Shift + Enter always adds a new line" defaultOn />
          <ToggleRow label="Show typing indicators" hint="Let others see when you're typing" defaultOn />
        </Section>

        <Section icon={Shield} title="Privacy">
          <ToggleRow label="Show online status" hint="Friends can see when you're online" defaultOn />
          <ToggleRow label="Allow room invites from anyone" hint="Otherwise only friends can invite you" />
        </Section>

        <Section icon={Sparkles} title="About">
          <div className="flex items-center justify-between px-5 py-4 text-sm">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium">VibeRooms 1.0 · demo mode</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-muted-foreground">Signed in as {me.name}</span>
            <Button variant="destructive" size="sm" onClick={signOut}>
              <LogOut /> Log out
            </Button>
          </div>
        </Section>
      </div>
    </div>
  );
}
