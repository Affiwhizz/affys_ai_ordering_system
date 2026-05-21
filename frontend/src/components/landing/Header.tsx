"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Facebook, MessageCircle, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import CartIcon from "@/components/cart/CartIcon";

/**
 * Toggle the live Portimão campaign here. Wire to admin later.
 */
const PORTIMAO_ACTIVE = true;

interface NavLink {
  href: string;
  label: string;
  hot?: boolean;
}

const NAV_PRIMARY: NavLink[] = [
  { href: "/menu", label: "Menu" },
  { href: "/#catering", label: "Catering" },
  { href: "/portimao", label: "Portimão", hot: PORTIMAO_ACTIVE },
  { href: "/#story", label: "Our story" },
  { href: "/#udia", label: "Ask Udia" },
  { href: "/#blog", label: "From the kitchen" },
];

const NAV_ACTIONS: NavLink[] = [
  { href: "/#order", label: "Start an order" },
  { href: "/portimao", label: "Pre-order Portimão" },
  { href: "/#catering", label: "Request catering quote" },
];

const NAV_EMAIL = {
  href: "mailto:hello@atasteofaffys.com",
  label: "hello@atasteofaffys.com",
};

interface SocialIcon {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

const NAV_SOCIALS: SocialIcon[] = [
  { href: "https://instagram.com/_affys", label: "Instagram", icon: Instagram },
  { href: "https://tiktok.com/@_affys", label: "TikTok", icon: TikTokIcon },
  { href: "https://facebook.com/atasteofaffys", label: "Facebook", icon: Facebook },
  { href: "https://wa.me/351914145519", label: "WhatsApp", icon: MessageCircle },
];

/** Inline TikTok glyph — Lucide doesn't ship one. */
function TikTokIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 3v9a3.5 3.5 0 1 1-3.5-3.5h.5V12a1 1 0 1 0 1 1V3h2c.4 2 1.8 3.5 4 4v2c-1.6-.1-3-.6-4-1.4Z" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-border">
        <div className="container-x flex h-[76px] items-center justify-between md:h-[88px]">
          <Logo />

          <div className="flex items-center gap-2.5">
            <CartIcon />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-white text-espresso shadow-sm transition-all hover:border-espresso hover:bg-espresso hover:text-ivory"
            >
              {open ? <X size={18} strokeWidth={2.2} /> : <Menu size={18} strokeWidth={2.2} />}
            </button>
          </div>
        </div>
      </header>

      {/* Sheet menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 pt-[76px] md:pt-[88px]"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-espresso/40 backdrop-blur-sm cursor-default"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.2 }}
            />

            <motion.nav
              aria-label="Site"
              className="relative ml-auto h-[calc(100vh-76px)] w-full max-w-md overflow-y-auto bg-white shadow-luxe md:h-[calc(100vh-88px)]"
              variants={{
                hidden: { x: "100%" },
                visible: { x: 0 },
              }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="container-x py-10">
                {/* Primary nav */}
                <ul className="space-y-1">
                  {NAV_PRIMARY.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.04, duration: 0.35 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between border-b border-border py-4 font-display text-2xl font-medium text-espresso transition-colors hover:text-red"
                      >
                        <span className="flex items-center gap-3">
                          {link.label}
                          {link.hot && (
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-red opacity-80 animate-ping" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
                            </span>
                          )}
                        </span>
                        <span
                          className="inline-block opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                          aria-hidden
                        >
                          →
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="mt-10">
                  <p className="eyebrow">Quick actions</p>
                  <div className="mt-4 grid gap-2.5">
                    {NAV_ACTIONS.map((action, i) => (
                      <motion.div
                        key={action.href + action.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
                      >
                        <Link
                          href={action.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-2xl border border-border bg-cream px-5 py-4 text-sm font-semibold text-espresso transition-all hover:border-gold hover:bg-gold/10"
                        >
                          <span>{action.label}</span>
                          <span aria-hidden>→</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-10 border-t border-border pt-8">
                  <p className="eyebrow">Get in touch</p>

                  <Link
                    href={NAV_EMAIL.href}
                    onClick={() => setOpen(false)}
                    className="mt-4 inline-block text-sm text-foreground-muted transition-colors hover:text-espresso underline decoration-gold underline-offset-4"
                  >
                    {NAV_EMAIL.label}
                  </Link>

                  <ul className="mt-5 flex flex-wrap gap-3">
                    {NAV_SOCIALS.map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <motion.li
                          key={s.href}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + i * 0.06, duration: 0.3 }}
                        >
                          <Link
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            onClick={() => setOpen(false)}
                            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-espresso transition-all hover:border-gold hover:bg-gold/10 hover:-translate-y-0.5"
                          >
                            <Icon size={18} strokeWidth={1.8} />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
