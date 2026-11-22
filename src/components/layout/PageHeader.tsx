import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/store/chat-store";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  const { setMobileNavOpen } = useChat();
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/75 px-4 py-3.5 backdrop-blur-xl md:px-8 md:py-5">
      <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
        <Menu />
      </Button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold md:text-2xl">{title}</h1>
        {subtitle && <p className="hidden truncate text-sm text-muted-foreground sm:block">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
