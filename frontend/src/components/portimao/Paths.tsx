import Link from "next/link";
import { FadeIn, RevealHeading } from "@/components/motion";
import { PORTIMAO } from "./config";

const PATHS = [
  {
    id: "direct",
    eyebrow: "Path 1 · Pickup only",
    title: "Preorder direct via Affy’s",
    description:
      "Choose your bowls, leave a phone and email, and we lock your slot. Best for groups, large orders, and specific pickup times.",
    steps: [
      "Submit the form (or Ask Udia to build it for you)",
      "We confirm by email and phone within 24 hours",
      "Pay your secure Stripe link to lock your slot",
      "Pick up at the festival window — your name on the list",
    ],
    cta: { label: "Preorder a slot", href: "#preorder" },
    secondary: { label: "Or ask Udia", href: "/#udia" },
    style: "primary" as const,
  },
  {
    id: "uber-eats",
    eyebrow: `Path 2 · Live ${PORTIMAO.uberEatsHours}`,
    title: "Order on Uber Eats during festival hours",
    description:
      "Walk-up ordering with delivery options around Praia da Rocha. Native Uber Eats flow — fastest if you're already on the strip.",
    steps: [
      "Open the Affy’s store on Uber Eats",
      "Order direct in-app",
      "Pickup or delivery via Uber",
      "We see it instantly in our kitchen",
    ],
    cta: { label: "Open on Uber Eats", href: PORTIMAO.uberEatsHref, external: true },
    secondary: { label: "What's on the menu", href: "#menu" },
    style: "ghost" as const,
  },
];

export default function PortimaoPaths() {
  return (
    <section id="how" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn delay={0.05} y={12}>
            <span className="eyebrow inline-flex items-center justify-center">
              <span className="gold-rule" />
              Two ways to order
              <span className="gold-rule-after" />
            </span>
          </FadeIn>
          <RevealHeading
            as="h2"
            delay={0.15}
            className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl"
            tokens={[
              "Pick",
              "the",
              <span key="ital" className="italic text-red">
                path
              </span>,
              "that",
              "fits",
              "your",
              "day.",
            ]}
          />
          <FadeIn delay={0.4}>
            <p className="mt-5 text-lg text-foreground-muted">
              Affy&rsquo;s direct is best for planned, larger, or specific-time orders.
              Uber Eats is best for walk-up speed during festival hours.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {PATHS.map((p, i) => (
            <FadeIn key={p.id} delay={0.5 + i * 0.12} y={24}>
              <article
                className={`relative h-full overflow-hidden rounded-[1.6rem] p-8 md:p-10 transition-transform hover:-translate-y-1 ${
                  p.style === "primary"
                    ? "border border-gold/40 bg-gradient-to-br from-espresso via-espresso to-red/70 text-ivory shadow-luxe"
                    : "border border-border bg-surface text-espresso shadow-luxe"
                }`}
              >
                {p.style === "primary" && (
                  <>
                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" aria-hidden />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-forest/40 blur-3xl" aria-hidden />
                  </>
                )}

                <div className="relative">
                  <span className={`eyebrow inline-flex items-center ${p.style === "primary" ? "text-gold" : ""}`}>
                    <span className="gold-rule" />
                    {p.eyebrow}
                    <span className="gold-rule-after" />
                  </span>
                  <h3 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                    {p.title}
                  </h3>
                  <p
                    className={`mt-4 max-w-md text-base leading-relaxed ${
                      p.style === "primary" ? "text-ivory/80" : "text-foreground-muted"
                    }`}
                  >
                    {p.description}
                  </p>

                  <ol className="mt-7 space-y-2.5">
                    {p.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span
                          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            p.style === "primary"
                              ? "bg-gold text-espresso"
                              : "bg-espresso text-ivory"
                          }`}
                          aria-hidden
                        >
                          {idx + 1}
                        </span>
                        <span className={p.style === "primary" ? "text-ivory/85" : "text-foreground-muted"}>
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <Link
                      href={p.cta.href}
                      target={p.cta.external ? "_blank" : undefined}
                      rel={p.cta.external ? "noopener noreferrer" : undefined}
                      className={`inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold transition-all active:scale-[0.98] ${
                        p.style === "primary"
                          ? "bg-gold text-espresso hover:bg-gold-soft hover:-translate-y-0.5 shadow-luxe"
                          : "btn-gold"
                      }`}
                    >
                      {p.cta.label}
                      <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                    <Link
                      href={p.secondary.href}
                      className={`text-sm font-semibold underline decoration-gold underline-offset-4 transition-colors ${
                        p.style === "primary" ? "text-ivory/85 hover:text-ivory" : "text-foreground-muted hover:text-espresso"
                      }`}
                    >
                      {p.secondary.label}
                    </Link>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
