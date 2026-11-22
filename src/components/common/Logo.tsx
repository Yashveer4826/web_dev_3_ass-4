import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow", className)}>
      <svg viewBox="0 0 32 32" className="size-5 text-primary-foreground" fill="none" aria-hidden>
        <path d="M6 9.5c0-1.9 1.6-3.5 3.5-3.5h13c1.9 0 3.5 1.6 3.5 3.5v8c0 1.9-1.6 3.5-3.5 3.5H15l-5.2 4.2c-.7.5-1.6 0-1.6-.8V21h-.7C6.7 21 6 20.3 6 19.5v-10Z" fill="currentColor" fillOpacity=".28" />
        <path d="M10.5 11.5 14 17l2-3.2L18 17l3.5-5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark />
      {!collapsed && (
        <span className="font-display text-lg font-bold tracking-tight">
          Vibe<span className="text-gradient">Rooms</span>
        </span>
      )}
    </div>
  );
}
