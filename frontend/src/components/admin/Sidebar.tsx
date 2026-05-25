"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getNewOrdersCount } from "@/app/admin/orders/actions";
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  MapPin,
  BookOpen,
  CalendarDays,
  Truck,
  Ticket,
  Users,
  PenSquare,
  BarChart3,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/catering", label: "Catering", icon: Utensils },
  { href: "/admin/portimao", label: "Portimão", icon: MapPin },
  { href: "/admin/menu", label: "Menu", icon: BookOpen },
  { href: "/admin/availability", label: "Availability", icon: CalendarDays },
  { href: "/admin/delivery", label: "Delivery & Pay", icon: Truck },
  { href: "/admin/promos", label: "Promo codes", icon: Ticket },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/content", label: "Content", icon: PenSquare },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [newOrders, setNewOrders] = useState(0);

  // Poll the count of orders awaiting a status (refreshes on navigation too).
  useEffect(() => {
    let active = true;
    const load = () =>
      getNewOrdersCount()
        .then((n) => {
          if (active) setNewOrders(n);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore — still redirect
    }
    router.push("/admin/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-espresso text-ivory lg:flex">
      {/* Brand */}
      <div className="flex h-[88px] items-center gap-3 border-b border-ivory/10 px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-espresso font-display text-xl font-bold">
          A
        </span>
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-semibold">Affy&rsquo;s</span>
          <span className="mt-1 text-[9px] uppercase tracking-[0.22em] text-ivory/55">Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav aria-label="Admin" className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {NAV.map((n) => {
            const isActive = n.exact ? pathname === n.href : pathname?.startsWith(n.href);
            const Icon = n.icon;
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gold text-espresso"
                      : "text-ivory/70 hover:bg-ivory/5 hover:text-ivory"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {n.label}
                  {n.href === "/admin/orders" && newOrders > 0 && (
                    <span
                      className={`ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                        isActive ? "bg-espresso text-gold" : "bg-forest text-ivory"
                      }`}
                    >
                      {newOrders}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="border-t border-ivory/10 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-ivory/55 transition-colors hover:bg-ivory/5 hover:text-ivory"
        >
          <ExternalLink size={14} />
          View public site
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-ivory/55 transition-colors hover:bg-ivory/5 hover:text-ivory"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
