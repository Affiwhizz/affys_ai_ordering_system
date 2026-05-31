"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, MapPin, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchStoreFlags } from "@/lib/store/actions";
import type { PortimaoStatus } from "@/lib/store/types";

/**
 * Mobile sticky bottom dock.
 *
 * Only visible on mobile / narrow viewports (lg:hidden). Provides instant
 * access to the four most important actions: Order, Ask Udia, Portimão
 * (when the campaign is live), and WhatsApp contact.
 *
 * Portimão visibility is driven by the live store_flags (admin /admin/portimao).
 */
const WHATSAPP_HREF = "https://wa.me/351914145519";

interface DockItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  /** Highlight = primary action, gets the gold pill treatment. */
  highlight?: boolean;
  /** Hot = active campaign indicator, gets a pulsing red dot. */
  hot?: boolean;
  /** Open external links in new tab. */
  external?: boolean;
}

function buildItems(status: PortimaoStatus): DockItem[] {
  const isLive = status === "live";
  const showPortimao = status !== "off-season";
  return [
    // "Order" now points to the real menu (where the cart lives) instead of
    // an in-page anchor that doesn't actually start an order.
    { href: "/menu", label: "Order", icon: ShoppingBag, highlight: true },
    { href: "/#udia", label: "Udia", icon: Sparkles },
    ...(showPortimao
      ? [{ href: "/portimao", label: "Portimão", icon: MapPin, hot: isLive } satisfies DockItem]
      : []),
    { href: WHATSAPP_HREF, label: "WhatsApp", icon: MessageCircle, external: true },
  ];
}

export default function MobileDock() {
  const [portimaoStatus, setPortimaoStatus] = useState<PortimaoStatus>("off-season");

  useEffect(() => {
    let active = true;
    fetchStoreFlags()
      .then((f) => active && setPortimaoStatus(f.portimaoStatus))
      .catch(() => {
        /* keep default, Portimão hidden from the dock */
      });
    return () => {
      active = false;
    };
  }, []);

  const ITEMS = useMemo(() => buildItems(portimaoStatus), [portimaoStatus]);

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
    >
      {/* Soft fade above the dock so content scrolls cleanly behind it */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-3 max-w-md px-3"
      >
        <div className="flex items-stretch gap-1 rounded-2xl border border-gold/30 bg-espresso/95 p-1.5 shadow-luxe backdrop-blur-md">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const target = item.external ? "_blank" : undefined;
            const rel = item.external ? "noopener noreferrer" : undefined;
            return (
              <motion.div
                key={item.label}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="flex-1"
              >
                <Link
                  href={item.href}
                  target={target}
                  rel={rel}
                  className={`relative flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                    item.highlight
                      ? "bg-gold text-espresso"
                      : "text-ivory/85 hover:bg-ivory/10"
                  }`}
                  aria-label={item.label}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.label}</span>
                  {item.hot && (
                    <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red opacity-80 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}
