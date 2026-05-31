"use client";

import { Bell, ShoppingBag, Utensils, BellRing } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AdminUserPill from "./AdminUserPill";
import { getNewOrdersCount } from "@/app/admin/orders/actions";
import { getNewCateringCount } from "@/app/admin/catering/actions";
import { getRecentNotifyCount } from "@/app/admin/notify/actions";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

interface BellState {
  newOrders: number;
  newCatering: number;
  recentSignups: number;
}

const ZERO_BELL: BellState = { newOrders: 0, newCatering: 0, recentSignups: 0 };

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [panel, setPanel] = useState(false);
  const [bell, setBell] = useState<BellState>(ZERO_BELL);
  // ISO timestamp the operator last opened the bell panel, persisted in
  // localStorage so it survives reloads + survives across tabs/sessions on
  // the same device.
  const SEEN_KEY = "affys_admin_bell_seen_at";
  const [seenAt, setSeenAt] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Hydrate seenAt from localStorage once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeenAt(window.localStorage.getItem(SEEN_KEY));
  }, []);

  // Poll the counts every minute, filtered by seenAt so the badge only
  // reflects items that arrived AFTER the operator last opened the panel.
  useEffect(() => {
    let active = true;
    const since = seenAt ?? undefined;
    const load = async () => {
      const [orders, catering, signups] = await Promise.all([
        getNewOrdersCount(since).catch(() => 0),
        getNewCateringCount(since).catch(() => 0),
        getRecentNotifyCount(since).catch(() => 0),
      ]);
      if (!active) return;
      setBell({ newOrders: orders, newCatering: catering, recentSignups: signups });
    };
    load();
    const t = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [seenAt]);

  // Close the panel on outside click / Escape.
  useEffect(() => {
    if (!panel) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPanel(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  // Open the panel + mark everything as seen at this moment.
  const togglePanel = () => {
    setPanel((open) => {
      const willOpen = !open;
      if (willOpen) {
        const now = new Date().toISOString();
        try {
          window.localStorage.setItem(SEEN_KEY, now);
        } catch {
          /* private mode / quota, silently ignore */
        }
        setSeenAt(now);
      }
      return willOpen;
    });
  };

  const total = bell.newOrders + bell.newCatering + bell.recentSignups;

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
          {/* Search hidden until the actual search backend is wired, was a
              non-functional placeholder that confused testers. */}

          {/* Bell + popover panel */}
          <div ref={wrapRef} className="relative">
            <button
              type="button"
              aria-label={`Notifications${total > 0 ? ` (${total} new)` : ""}`}
              aria-expanded={panel}
              onClick={togglePanel}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-espresso transition-all hover:border-espresso"
            >
              <Bell size={16} strokeWidth={1.8} />
              {total > 0 && (
                <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red px-1 text-[9px] font-bold leading-none text-ivory">
                  {total > 9 ? "9+" : total}
                </span>
              )}
            </button>

            {panel && (
              <div className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-luxe">
                <div className="border-b border-border bg-espresso px-4 py-3 text-ivory">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Inbox</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {total === 0 ? "Nothing new, you're all caught up." : `${total} new ${total === 1 ? "item" : "items"}`}
                  </p>
                </div>

                <ul className="divide-y divide-border">
                  <NotifRow
                    icon={ShoppingBag}
                    label="Orders awaiting status"
                    count={bell.newOrders}
                    href="/admin/orders"
                    emptyText="No new orders"
                    onClick={() => setPanel(false)}
                  />
                  <NotifRow
                    icon={Utensils}
                    label="New catering inquiries"
                    count={bell.newCatering}
                    href="/admin/catering"
                    emptyText="No new inquiries"
                    onClick={() => setPanel(false)}
                  />
                  <NotifRow
                    icon={BellRing}
                    label="Waitlist signups (7 days)"
                    count={bell.recentSignups}
                    href="/admin/notify"
                    emptyText="No recent signups"
                    onClick={() => setPanel(false)}
                  />
                </ul>

                <div className="border-t border-border bg-cream/40 px-4 py-2 text-[11px] text-foreground-subtle">
                  Counts refresh every minute.
                </div>
              </div>
            )}
          </div>

          {/* User pill (self-fetches from Supabase) */}
          <AdminUserPill />
        </div>
      </div>
    </header>
  );
}

function NotifRow({
  icon: Icon,
  label,
  count,
  href,
  emptyText,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  count: number;
  href: string;
  emptyText: string;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream/60"
      >
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${
            count > 0 ? "border-gold/60 bg-gold/10 text-gold-deep" : "border-border bg-white text-foreground-subtle"
          }`}
        >
          <Icon size={15} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-espresso">{label}</p>
          <p className="text-xs text-foreground-muted">
            {count > 0 ? `${count} ${count === 1 ? "item" : "items"}` : emptyText}
          </p>
        </div>
        <span className="shrink-0 text-xs text-foreground-subtle" aria-hidden>
          →
        </span>
      </Link>
    </li>
  );
}
