"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";

interface AccordionItem {
  id: string;
  q: ReactNode;
  a: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple panels open at once. Default: only one open. */
  multiple?: boolean;
  /** Optional default-open id(s). */
  defaultOpenIds?: string[];
  className?: string;
}

/**
 * Accessible accordion with smooth height animation via framer-motion.
 * Use for FAQ-style sections.
 */
export default function Accordion({
  items,
  multiple = false,
  defaultOpenIds = [],
  className = "",
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return multiple ? [...prev, id] : [id];
    });
  };

  return (
    <ul className={`divide-y divide-border ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors group"
            >
              <span className="font-display text-lg font-medium text-espresso group-hover:text-red transition-colors sm:text-xl">
                {item.q}
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-espresso transition-all ${
                  isOpen ? "bg-gold border-gold rotate-45" : "bg-surface group-hover:border-gold/60"
                }`}
                aria-hidden
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-panel-${item.id}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 pr-12 text-base leading-relaxed text-foreground-muted">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
