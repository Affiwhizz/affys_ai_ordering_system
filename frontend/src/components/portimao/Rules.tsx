import Link from "next/link";
import { FadeIn, RevealHeading } from "@/components/motion";
import { PORTIMAO } from "./config";

const RULES = [
  {
    title: "Calendar shows real availability",
    body:
      "The calendar only displays slots that are actually open — pick one and it's yours to lock. The festival weekend is 3 days, but preorder dates extend before and after.",
  },
  {
    title: "Pickup only for direct preorders",
    body:
      "Direct preorders through this site are pickup-only at our Praia da Rocha point. For delivery, use Uber Eats during festival hours.",
  },
  {
    title: "Booking deadlines",
    body: `Same-weekend cut-off: ${PORTIMAO.preorderDeadline}. Earlier dates have more flexibility — the calendar shows what's bookable.`,
  },
  {
    title: "Cancellations",
    body:
      "Cancel 24h before your pickup window for a full refund. After that, we'll do our best to reschedule your slot.",
  },
];

export default function PortimaoRules() {
  return (
    <section id="rules" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Pickup card */}
          <FadeIn y={20}>
            <div className="relative overflow-hidden rounded-[1.6rem] border border-border bg-forest text-ivory shadow-luxe">
              <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl" aria-hidden />
              <div className="relative p-10 md:p-12">
                <span className="eyebrow inline-flex items-center text-gold">
                  <span className="gold-rule" />
                  Pickup details
                  <span className="gold-rule-after" />
                </span>

                <h3 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                  Praia da Rocha,{" "}
                  <span className="italic text-gold">Portimão.</span>
                </h3>

                <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/80">
                  {PORTIMAO.pickupNote}
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-6">
                  <div className="border-l border-gold/40 pl-4">
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory/55">Window</dt>
                    <dd className="mt-1.5 font-display text-lg text-ivory">
                      {PORTIMAO.pickupWindow}
                    </dd>
                  </div>
                  <div className="border-l border-gold/40 pl-4">
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory/55">Dates</dt>
                    <dd className="mt-1.5 font-display text-lg text-ivory">
                      {PORTIMAO.campaignWindow}
                    </dd>
                  </div>
                </dl>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href={PORTIMAO.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-espresso transition-all hover:bg-gold-soft active:scale-[0.98]"
                  >
                    Contact us on WhatsApp
                    <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.4 13.6c-.3.7-1.4 1.3-2 1.4-.5.1-1.2.2-3.6-.7a13 13 0 0 1-5.5-4.5c-.4-.6-1.1-1.7-1.1-3.2 0-1.5.8-2.2 1.1-2.5.3-.3.6-.4 1-.4h.6c.3 0 .6 0 .8.6l1 2.4c.1.2.1.4 0 .6l-.4.4-.4.4c-.1.1-.3.2-.1.5.2.3.9 1.5 2 2.5 1.4 1.2 2.6 1.6 2.9 1.7.3.1.5.1.7-.1l.9-1c.2-.3.5-.2.8-.1l2.3 1.1c.3.1.6.2.7.4.1.2.1.9-.1 1.5Z"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Rules + payment */}
          <div>
            <FadeIn delay={0.1} y={12}>
              <span className="eyebrow inline-flex items-center">
                <span className="gold-rule" />
                Order rules &amp; payment
                <span className="gold-rule-after" />
              </span>
            </FadeIn>

            <RevealHeading
              as="h2"
              delay={0.2}
              className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-espresso sm:text-4xl"
              tokens="So you know exactly what to expect."
            />

            <ul className="mt-10 space-y-5">
              {RULES.map((r, i) => (
                <FadeIn key={r.title} delay={0.4 + i * 0.08} y={12}>
                  <li className="flex items-start gap-4">
                    <span
                      className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-deep font-mono text-[10px] font-bold text-red"
                      aria-hidden
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <h4 className="font-display text-lg font-semibold text-espresso">
                        {r.title}
                      </h4>
                      <p className="mt-1.5 text-base leading-relaxed text-foreground-muted">
                        {r.body}
                      </p>
                    </div>
                  </li>
                </FadeIn>
              ))}
            </ul>

            {/* Payment instructions */}
            <FadeIn delay={0.85}>
              <div className="mt-10 rounded-2xl border border-border bg-cream p-6">
                <span className="eyebrow text-foreground-muted">
                  How payment works
                </span>
                <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                  Once we confirm your order, we send a secure Stripe link by
                  email. Pay there to lock your slot — your name goes on the
                  pickup list immediately. We accept all major cards plus
                  Apple Pay and Google Pay.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
