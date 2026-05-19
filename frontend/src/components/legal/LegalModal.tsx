"use client";

import { Modal } from "@/components/motion";
import { LEGAL_DOCS, type LegalTopic } from "./legal-content";

interface LegalModalProps {
  topic: LegalTopic | null;
  onClose: () => void;
}

/**
 * Modal that renders one of three legal documents — privacy, terms, or
 * cookies — pulled from `legal-content.ts`. Pass null for `topic` to close.
 */
export default function LegalModal({ topic, onClose }: LegalModalProps) {
  const doc = topic ? LEGAL_DOCS[topic] : null;

  return (
    <Modal
      open={Boolean(doc)}
      onClose={onClose}
      label={doc?.title ?? "Legal"}
      maxWidth="max-w-3xl"
    >
      {doc && (
        <div className="px-7 pt-9 pb-7 sm:px-10 sm:pt-12 sm:pb-10">
          <p className="eyebrow inline-flex items-center">
            <span className="gold-rule" />
            {doc.updated}
            <span className="gold-rule-after" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
            {doc.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground-muted">
            {doc.intro}
          </p>

          <div className="mt-8 space-y-7">
            {doc.sections.map((s) => (
              <section key={s.heading}>
                <h3 className="font-display text-xl font-semibold tracking-tight text-espresso">
                  {s.heading}
                </h3>
                <div className="mt-2.5 space-y-3 text-base leading-relaxed text-foreground-muted">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-9 border-t border-border pt-6 text-sm text-foreground-subtle">
            Questions? Reach us at{" "}
            <a
              href="mailto:hello@atasteofaffy.com"
              className="font-semibold text-espresso underline decoration-gold underline-offset-4"
            >
              hello@atasteofaffy.com
            </a>
            .
          </p>
        </div>
      )}
    </Modal>
  );
}
