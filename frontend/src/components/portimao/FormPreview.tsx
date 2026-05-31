import Link from "next/link";
import { FadeIn, RevealHeading } from "@/components/motion";
import { PORTIMAO } from "./config";

/**
 * On-page form *preview*, the full multi-step form lives at /portimao/order
 * (built in a future phase). This card communicates what fields the customer
 * will fill and gives them a clear next step.
 */
export default function PortimaoFormPreview() {
  const fields = [
    { label: "Your name", value: "e.g. Tomi A." },
    { label: "Phone", value: "+351 9·· ··· ···" },
    { label: "Email", value: "you@example.com" },
    { label: "Pickup day", value: "Sat · 14:30", isSelect: true },
    { label: "How many people?", value: "4, 6 guests", isSelect: true },
    { label: "Allergies / dietary", value: "e.g. nut allergy, dairy-free" },
  ];

  const items = [
    "Smoky party jollof, 2× large bowl",
    "Suya skewers, 6 sticks",
    "Plantain (dodo), 4 portions",
    "Small chops platter, 1×",
  ];

  return (
    <section
      id="preorder"
      className="relative py-24 md:py-32"
    >
      <div className="container-x">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Copy column */}
          <div>
            <FadeIn delay={0.05} y={12}>
              <span className="eyebrow inline-flex items-center">
                <span className="gold-rule" />
                Preorder · Direct
                <span className="gold-rule-after" />
              </span>
            </FadeIn>
            <RevealHeading
              as="h2"
              delay={0.15}
              className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl"
              tokens={[
                "Lock",
                "your",
                <span key="ital" className="italic text-red">
                  Portimão slot.
                </span>,
              ]}
            />
            <FadeIn delay={0.4}>
              <p className="mt-5 text-lg text-foreground-muted">
                Pick your bowls and a slot from the available pickup dates
                and times, we follow up with the final details and your
                secure payment link.
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <ul className="mt-8 space-y-3 text-sm text-foreground-muted">
                {[
                  "Pick a slot from the calendar, only open slots are bookable",
                  "Festival pickup runs Thurs 2, Mon 7 July",
                  "Slot is locked with your name once paid",
                  `Or skip the form, Ask Udia and we'll build it`,
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span
                      className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold text-espresso"
                      aria-hidden
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.7}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="#"
                  className="inline-flex h-12 items-center rounded-full bg-espresso px-7 text-sm font-semibold text-ivory shadow-luxe transition-all hover:bg-gold hover:text-espresso hover:-translate-y-0.5 active:scale-[0.98] border border-gold-deep"
                >
                  Open the full form
                  <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  href="/#udia"
                  className="text-sm font-semibold text-foreground-muted underline decoration-gold underline-offset-4 transition-colors hover:text-espresso"
                >
                  Ask Udia instead
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.9}>
              <p className="mt-6 max-w-sm text-xs text-foreground-subtle">
                Prefer to message? We&rsquo;re also on{" "}
                <Link
                  href={PORTIMAO.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-espresso underline decoration-gold underline-offset-4"
                >
                  WhatsApp
                </Link>{" "}
                during festival days.
              </p>
            </FadeIn>
          </div>

          {/* Form preview */}
          <FadeIn delay={0.5} y={20}>
            <div className="relative rounded-[1.6rem] border border-border bg-surface p-6 shadow-luxe md:p-8">
              <div className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-br from-gold/15 via-transparent to-red/15 blur-md -z-10" aria-hidden />

              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="eyebrow text-foreground-muted">Preview</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-foreground-subtle">
                  6 fields · 1 min
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.label}>
                    <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                      {f.label}
                    </label>
                    <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-foreground-muted">
                      <span>{f.value}</span>
                      {f.isSelect && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                  Your order
                </label>
                <ul className="mt-1 rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-foreground-muted divide-y divide-border">
                  {items.map((it) => (
                    <li key={it} className="py-1.5 first:pt-0 last:pb-0">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disabled mock CTA inside the preview */}
              <div className="mt-5 rounded-full border border-border-strong bg-cream-deep px-5 py-3 text-center text-sm font-semibold text-foreground-subtle">
                Submit preorder · opens the real form
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
