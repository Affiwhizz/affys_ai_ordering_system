"use client";

import { useLegalModal } from "./LegalModalProvider";
import type { LegalTopic } from "./legal-content";

/**
 * Inline button styled to look like a Footer link. Opens the legal modal
 * via the global provider (no URL hash change, no scroll-to-top).
 */
export default function LegalLink({
  topic,
  label,
  className,
}: {
  topic: LegalTopic;
  label: string;
  className?: string;
}) {
  const { open } = useLegalModal();
  return (
    <button
      type="button"
      onClick={() => open(topic)}
      className={
        className ??
        "text-sm text-ivory/75 transition-colors hover:text-ivory cursor-pointer"
      }
    >
      {label}
    </button>
  );
}
