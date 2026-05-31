"use client";

import { useEffect, useState } from "react";
import LegalModal from "./LegalModal";
import type { LegalTopic } from "./legal-content";

/**
 * Hash convention shared with Footer.tsx's Help column. Clicking those links
 * sets the URL hash; this component watches for it and opens the matching
 * legal modal.
 */
const HASH_TO_TOPIC: Record<string, LegalTopic> = {
  "#legal-privacy": "privacy",
  "#legal-terms": "terms",
  "#legal-cookies": "cookies",
  "#legal-accessibility": "accessibility",
  "#legal-refunds": "refunds",
  "#legal-allergy": "allergy",
};

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

  // Pick up the Help-column links (Allergy notice, Refund policy) which set
  // the URL hash. When matched, open the matching legal modal and clear the
  // hash so refresh doesn't re-open it unexpectedly.
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash;
      const t = HASH_TO_TOPIC[h];
      if (t) {
        setTopic(t);
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

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
