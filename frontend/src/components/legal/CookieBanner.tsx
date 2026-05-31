"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Modal } from "@/components/motion";
import { useLegalModal } from "./LegalModalProvider";

/**
 * GDPR cookie banner.
 *
 * Shows once on first visit, persists the user's choice in localStorage.
 * Three actions: Accept all / Reject non-essential / Customize.
 *
 * Persisted shape (under STORAGE_KEY):
 *   {
 *     version: 1,
 *     essential: true,       // always on
 *     analytics: boolean,
 *     marketing: boolean,
 *     decidedAt: ISO string,
 *   }
 *
 * To rev the consent dialog (e.g. you add a new cookie category later),
 * bump CONSENT_VERSION, that re-prompts every user.
 */

const STORAGE_KEY = "affys.cookieConsent";
const CONSENT_VERSION = 1;

interface ConsentState {
  version: number;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(state: Omit<ConsentState, "version" | "decidedAt" | "essential">) {
  if (typeof window === "undefined") return;
  const next: ConsentState = {
    version: CONSENT_VERSION,
    essential: true,
    analytics: state.analytics,
    marketing: state.marketing,
    decidedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  // Inline "cookie policy" link opens the full policy modal in place.
  const { open: openLegal } = useLegalModal();

  // Decide whether to show on mount.
  // If existing consent is present, we don't show the banner, and we defer
  // hydrating the toggle states until the user opens the customize modal
  // (see `openSettings` below). This keeps the mount effect side-effect-free
  // when consent has already been recorded.
  useEffect(() => {
    const existing = readConsent();
    if (existing) return;
    // No existing consent, show banner after a tiny delay so it doesn't
    // pop in on first paint.
    const t = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(t);
  }, []);

  const openSettings = () => {
    // Hydrate the toggles from localStorage when the modal opens, so the
    // user sees their last choice.
    const existing = readConsent();
    if (existing) {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }
    setSettingsOpen(true);
  };

  const acceptAll = () => {
    writeConsent({ analytics: true, marketing: true });
    setAnalytics(true);
    setMarketing(true);
    setShow(false);
    setSettingsOpen(false);
  };

  const rejectNonEssential = () => {
    writeConsent({ analytics: false, marketing: false });
    setAnalytics(false);
    setMarketing(false);
    setShow(false);
    setSettingsOpen(false);
  };

  const saveCustom = () => {
    writeConsent({ analytics, marketing });
    setShow(false);
    setSettingsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6"
            role="dialog"
            aria-label="Cookie preferences"
            aria-live="polite"
          >
            <div className="mx-auto max-w-5xl rounded-2xl border border-gold/30 bg-espresso/95 p-5 text-ivory shadow-luxe backdrop-blur-md sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
                <div className="flex-1">
                  <p className="eyebrow inline-flex items-center text-gold">
                    <span className="gold-rule" />
                    Cookies &amp; privacy
                    <span className="gold-rule-after" />
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/80">
                    We use a few essential cookies to make Affy&rsquo;s work,
                    and (with your permission) some analytics and marketing
                    cookies to understand what&rsquo;s helpful and tell our
                    story. You can change your choice anytime in our{" "}
                    <button
                      type="button"
                      onClick={() => openLegal("cookies")}
                      className="font-semibold text-ivory underline decoration-gold underline-offset-4 hover:text-gold cursor-pointer"
                    >
                      cookie policy
                    </button>
                    .
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:shrink-0">
                  <button
                    type="button"
                    onClick={openSettings}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-ivory/30 px-5 text-sm font-semibold text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
                  >
                    Customize
                  </button>
                  <button
                    type="button"
                    onClick={rejectNonEssential}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-ivory/30 px-5 text-sm font-semibold text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
                  >
                    Reject non-essential
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-espresso shadow-sm transition-all hover:bg-gold-soft hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Accept all
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customize panel */}
      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} label="Cookie preferences" maxWidth="max-w-xl">
        <div className="px-7 pt-9 pb-7 sm:px-10 sm:pt-12 sm:pb-10">
          <p className="eyebrow inline-flex items-center">
            <span className="gold-rule" />
            Customize cookies
            <span className="gold-rule-after" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-espresso">
            Choose what you&rsquo;re happy with.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-muted">
            Toggle the categories below. Essential cookies are required for
            the site to work and can&rsquo;t be turned off.
          </p>

          <ul className="mt-7 space-y-3">
            <Toggle
              label="Essential"
              description="Cookies needed for the site to function, session, security, language. Always on."
              checked
              disabled
            />
            <Toggle
              label="Analytics"
              description="Anonymous data on which pages and dishes are most useful, helps us improve."
              checked={analytics}
              onChange={setAnalytics}
            />
            <Toggle
              label="Marketing"
              description="Used for personalized content and ads. Off by default."
              checked={marketing}
              onChange={setMarketing}
            />
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveCustom}
              className="btn-gold"
            >
              Save preferences
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="text-sm font-semibold text-foreground-muted underline decoration-gold underline-offset-4 hover:text-espresso"
            >
              Accept all
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}

function Toggle({ label, description, checked, onChange, disabled = false }: ToggleProps) {
  return (
    <li className="flex items-start justify-between gap-5 rounded-2xl border border-border bg-cream px-5 py-4">
      <div className="flex-1">
        <p className="font-display text-base font-semibold text-espresso">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${label} cookies`}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-forest" : "bg-border-strong"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm ${
            checked ? "ml-6" : "ml-1"
          }`}
        />
      </button>
    </li>
  );
}
