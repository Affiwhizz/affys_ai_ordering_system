"use client";

import { useLegalModal } from "./LegalModalProvider";
import type { LegalTopic } from "./legal-content";

/**
 * The bottom-of-footer legal-links row. The modal itself lives in
 * LegalModalProvider (mounted at the layout root) so opening it never
 * causes a hash-navigation scroll-to-top. See LegalModalProvider for the
 * context API.
 */
export default function FooterLegal() {
  const { open } = useLegalModal();
  const click = (t: LegalTopic) => (e: React.MouseEvent) => {
    e.preventDefault();
    open(t);
  };

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ivory/55">
      <button type="button" onClick={click("privacy")} className="cursor-pointer transition-colors hover:text-ivory">
        Privacy
      </button>
      <button type="button" onClick={click("terms")} className="cursor-pointer transition-colors hover:text-ivory">
        Terms
      </button>
      <button type="button" onClick={click("cookies")} className="cursor-pointer transition-colors hover:text-ivory">
        Cookies
      </button>
      <button type="button" onClick={click("accessibility")} className="cursor-pointer transition-colors hover:text-ivory">
        Accessibility
      </button>
    </div>
  );
}
