"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import LegalModal from "./LegalModal";
import type { LegalTopic } from "./legal-content";

/**
 * Global provider that owns the single LegalModal instance. Any nav link,
 * footer item, or page can call `openLegal(topic)` to surface a doc without
 * the browser doing a hash navigation that scrolls the page to the top.
 *
 * This replaces the older "set the URL hash, listen for changes" trick which
 * worked but caused a visible scroll-to-top jolt before the modal opened.
 *
 * Mounted once at the root (layout.tsx). Use `useLegalModal()` from any
 * client component to open or close it.
 */

interface LegalModalContextValue {
  open: (topic: LegalTopic) => void;
  close: () => void;
  current: LegalTopic | null;
}

const LegalModalContext = createContext<LegalModalContextValue | null>(null);

export function LegalModalProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<LegalTopic | null>(null);
  const open = useCallback((topic: LegalTopic) => setCurrent(topic), []);
  const close = useCallback(() => setCurrent(null), []);

  return (
    <LegalModalContext.Provider value={{ open, close, current }}>
      {children}
      <LegalModal topic={current} onClose={close} />
    </LegalModalContext.Provider>
  );
}

/** Hook to open/close the global legal modal from any client component. */
export function useLegalModal(): LegalModalContextValue {
  const ctx = useContext(LegalModalContext);
  if (!ctx) {
    // Be permissive — components can render outside the provider during
    // tests or storybook; the buttons just won't do anything.
    return {
      open: () => {},
      close: () => {},
      current: null,
    };
  }
  return ctx;
}
