import type { ReactNode } from "react";
import { CreateRoomDialog } from "@/components/rooms/CreateRoomDialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useChat } from "@/store/chat-store";
import { ProfileDialog } from "./ProfileDialog";
import { Sidebar, SidebarContent } from "./Sidebar";
import { SignedOutScreen } from "./SignedOutScreen";

export function AppShell({ children }: { children: ReactNode }) {
  const { mobileNavOpen, setMobileNavOpen, signedOut } = useChat();

  if (signedOut) return <SignedOutScreen />;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar />
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-[86vw] max-w-[300px] border-sidebar-border bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>
      <main className="relative flex min-w-0 flex-1 flex-col">{children}</main>
      <CreateRoomDialog />
      <ProfileDialog />
    </div>
  );
}
