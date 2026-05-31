"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import CateringInquiryModal from "./CateringInquiryModal";

/**
 * Global provider that mounts a single CateringInquiryModal and exposes
 * openCateringModal(eventType?) so any nav item, footer link, or page can
 * trigger it without scrolling away from where the user already is.
 *
 * Mount once at the root (layout.tsx) and call useCateringModal() anywhere.
 */

interface CateringModalContextValue {
  open: (defaultEventType?: string) => void;
  close: () => void;
  isOpen: boolean;
}

const CateringModalContext = createContext<CateringModalContextValue | null>(null);

export function CateringModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultEventType, setDefaultEventType] = useState<string | undefined>();

  const open = useCallback((eventType?: string) => {
    setDefaultEventType(eventType);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <CateringModalContext.Provider value={{ open, close, isOpen }}>
      {children}
      <CateringInquiryModal
        open={isOpen}
        onClose={close}
        defaultEventType={defaultEventType}
      />
    </CateringModalContext.Provider>
  );
}

/** Hook to open/close the global catering modal from any client component. */
export function useCateringModal(): CateringModalContextValue {
  const ctx = useContext(CateringModalContext);
  if (!ctx) {
    // Be permissive, components are allowed to render outside the provider
    // (e.g. in storybook); the buttons just won't do anything in that case.
    return {
      open: () => {},
      close: () => {},
      isOpen: false,
    };
  }
  return ctx;
}
