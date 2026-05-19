import Link from "next/link";
import { Accordion, FadeIn, RevealHeading } from "@/components/motion";
import { PORTIMAO_FAQS, PORTIMAO } from "./config";

export default function PortimaoFAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32 bg-surface-warm border-y border-border">
      <div className="container-x">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* Header column */}
          <div className="lg:sticky lg:top-28">
            <FadeIn delay={0.05} y={12}>
              <span className="eyebrow inline-flex items-center">
                <span className="gold-rule" />
                Festival FAQ
                <span className="gold-rule-after" />
              </span>
            </FadeIn>
            <RevealHeading
              as="h2"
              delay={0.15}
              className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl"
              tokens={[
                "The",
                "small",
                <span key="ital" className="italic text-red">
                  print,
                </span>,
                "without",
                "the",
                "small",
                "print.",
              ]}
            />
            <FadeIn delay={0.4}>
              <p className="mt-5 text-foreground-muted">
                Everything most people ask before placing a Portimão order.
                Got something we didn&rsquo;t cover?
              </p>
            </FadeIn>
            <FadeIn delay={0.5}>
              <Link
                href={PORTIMAO.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-espresso underline decoration-gold underline-offset-4 transition-colors hover:text-red"
              >
                Message us on WhatsApp →
              </Link>
            </FadeIn>
          </div>

          {/* Accordion */}
          <FadeIn delay={0.3}>
            <Accordion
              items={PORTIMAO_FAQS.map((faq, i) => ({
                id: `faq-${i}`,
                q: faq.q,
                a: faq.a,
              }))}
              defaultOpenIds={["faq-0"]}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
