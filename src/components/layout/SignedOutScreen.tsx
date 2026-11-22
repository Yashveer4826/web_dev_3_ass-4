import { LogIn } from "lucide-react";
import { LogoMark } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { useChat } from "@/store/chat-store";

export function SignedOutScreen() {
  const { signIn, me } = useChat();
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute left-1/4 top-1/4 size-72 rounded-full bg-primary/25 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-primary-glow/25 blur-[100px] animate-float-slow" />
      <div className="relative w-full max-w-sm rounded-3xl glass p-8 text-center shadow-panel animate-rise">
        <LogoMark className="mx-auto size-14 rounded-2xl" />
        <h1 className="mt-6 text-2xl font-bold">See you soon, {me.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">You've been signed out of VibeRooms. Your rooms will be right where you left them.</p>
        <Button variant="hero" size="xl" className="mt-8 w-full" onClick={signIn}>
          <LogIn /> Sign back in
        </Button>
      </div>
    </div>
  );
}
