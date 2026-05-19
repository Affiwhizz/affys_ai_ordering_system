"use client";

import Link from "next/link";
import { Sparkles, ClipboardList, Utensils } from "lucide-react";
import { Modal } from "@/components/motion";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
}

interface Choice {
  id: "udia" | "form" | "catering";
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  /** Visual treatment for the card. */
  tone: "primary" | "ghost";
}

const CHOICES: Choice[] = [
  {
    id: "udia",
    icon: Sparkles,
    eyebrow: "AI guided",
    title: "Ask Udia",
    body: "Tell Udia what you’re craving, your group size, your budget, your event. Udia builds the order.",
    href: "/#udia",
    cta: "Open Udia",
    tone: "primary",
  },
  {
    id: "form",
    icon: ClipboardList,
    eyebrow: "Direct",
    title: "Quick order form",
    body: "Pick your dishes, choose a date and pickup time from the calendar — we follow up with the final details and a payment link.",
    href: "/#order",
    cta: "Open the form",
    tone: "ghost",
  },
  {
    id: "catering",
    icon: Utensils,
    eyebrow: "Events",
    title: "Catering inquiry",
    body: "Weddings, naming ceremonies, corporate, private dinners. Tell us your event — we come back with a tailored menu and quote.",
    href: "/#catering",
    cta: "Request a quote",
    tone: "ghost",
  },
];

export default function OrderModal({ open, onClose }: OrderModalProps) {
  return (
    <Modal open={open} onClose={onClose} label="Choose how to order" maxWidth="max-w-2xl">
      <div className="px-7 pt-9 pb-7 sm:px-10 sm:pt-12 sm:pb-10">
        <span className="eyebrow inline-flex items-center">
          <span className="gold-rule" />
          How would you like to order?
          <span className="gold-rule-after" />
        </span>
        <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
          Three ways. Pick the one that fits.
        </h2>

        <ul className="mt-8 space-y-3">
          {CHOICES.map((choice) => {
            const Icon = choice.icon;
            return (
              <li key={choice.id}>
                <Link
                  href={choice.href}
                  onClick={onClose}
                  className={`group flex items-start gap-5 rounded-2xl border p-5 transition-all ${
                    choice.tone === "primary"
                      ? "border-gold/40 bg-gradient-to-br from-espresso to-red/70 text-ivory hover:border-gold hover:-translate-y-0.5 hover:shadow-luxe"
                      : "border-border bg-cream hover:border-gold/60 hover:bg-white hover:-translate-y-0.5 hover:shadow-luxe"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      choice.tone === "primary"
                        ? "bg-gold text-espresso"
                        : "bg-espresso text-gold"
                    }`}
                    aria-hidden
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </span>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-[10px] uppercase tracking-[0.22em] ${
                        choice.tone === "primary" ? "text-gold" : "text-foreground-subtle"
                      }`}
                    >
                      {choice.eyebrow}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
                      {choice.title}
                    </h3>
                    <p
                      className={`mt-1.5 text-sm leading-relaxed ${
                        choice.tone === "primary" ? "text-ivory/80" : "text-foreground-muted"
                      }`}
                    >
                      {choice.body}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 self-center text-xl transition-transform group-hover:translate-x-1 ${
                      choice.tone === "primary" ? "text-gold" : "text-foreground-muted"
                    }`}
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-7 text-xs text-foreground-subtle">
          Prefer a person? Message us on{" "}
          <Link
            href="https://wa.me/351914145519"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-espresso underline decoration-gold underline-offset-4"
          >
            WhatsApp
          </Link>
          .
        </p>
      </div>
    </Modal>
  );
}
