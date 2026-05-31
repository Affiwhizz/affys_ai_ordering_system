"use client";

import { useState } from "react";
import LegalModal from "./LegalModal";
import type { LegalTopic } from "./legal-content";

/**
 * The bottom-of-footer legal-links row. Also exposes the trigger for
 * Allergy notice and Refund policy from the Help column up above (via the
 * legal-link hash convention, see Footer.tsx).
 *
 * Kept as a client component so the Footer itself can stay a server
 * component.
 */
export default function FooterLegal() {
  const [topic, setTopic] = useState<LegalTopic | null>(null);

  const open = (t: LegalTopic) => (e: React.MouseEvent) => {
    e.preventDefault();
    setTopic(t);
  };

  return (
    <>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ivory/55">
        <button type="button" onClick={open("privacy")} className="cursor-pointer transition-colors hover:text-ivory">
          Privacy
        </button>
        <button type="button" onClick={open("terms")} className="cursor-pointer transition-colors hover:text-ivory">
          Terms
        </button>
        <button type="button" onClick={open("cookies")} className="cursor-pointer transition-colors hover:text-ivory">
          Cookies
        </button>
        <button type="button" onClick={open("accessibility")} className="cursor-pointer transition-colors hover:text-ivory">
          Accessibility
        </button>
      </div>

      <LegalModal topic={topic} onClose={() => setTopic(null)} />
    </>
  );
}
