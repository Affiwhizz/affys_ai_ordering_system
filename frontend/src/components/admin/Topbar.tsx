import { Bell, Search } from "lucide-react";
import AdminUserPill from "./AdminUserPill";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-6 px-6 md:px-8">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold leading-tight text-espresso md:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-foreground-subtle">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search (placeholder) */}
          <div className="hidden h-10 items-center gap-2 rounded-full border border-border bg-cream px-3 text-sm text-foreground-subtle md:flex md:w-72">
            <Search size={14} />
            <span>Search orders, customers, dishes…</span>
            <span className="ml-auto rounded-md border border-border-strong bg-white px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-foreground-subtle">
              ⌘K
            </span>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-espresso transition-all hover:border-espresso"
          >
            <Bell size={16} strokeWidth={1.8} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red" />
          </button>

          {/* User pill (self-fetches from Supabase) */}
          <AdminUserPill />
        </div>
      </div>
    </header>
  );
}
