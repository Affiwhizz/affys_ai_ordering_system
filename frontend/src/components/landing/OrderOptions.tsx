import Link from "next/link";
import { FadeIn, RevealHeading } from "@/components/motion";

export default function OrderOptions() {
  return (
    <section id="order" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto">
          <FadeIn delay={0.05} y={12}>
            <span className="eyebrow inline-flex items-center justify-center">
              <span className="gold-rule" />
              How to order
              <span className="gold-rule-after" />
            </span>
          </FadeIn>
          <RevealHeading
            as="h2"
            delay={0.15}
            className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl"
            tokens={[
              "Two",
              "ways.",
              "Both",
              <span key="ital" className="italic text-red">
                easy
              </span>,
              ".",
            ]}
          />
          <FadeIn delay={0.4}>
            <p className="mt-5 text-lg text-foreground-muted">
              Chat with Udia for tailored picks, or use the quick form if
              you already know exactly what you want.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Udia card */}
          <FadeIn delay={0.55} y={20}>
          <article className="group relative h-full overflow-hidden rounded-[1.6rem] border border-gold/40 bg-gradient-to-br from-espresso via-espresso to-red/80 p-8 text-ivory shadow-luxe md:p-10 transition-transform hover:-translate-y-1">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" aria-hidden />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-forest/40 blur-3xl" aria-hidden />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-espresso/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gold backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                Guided
              </span>

              <h3 className="mt-5 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                Order with{" "}
                <span className="gold-shimmer italic">Udia</span>
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ivory/80">
                Tell Udia what you&rsquo;re craving, your budget, group size,
                or event type — Udia builds the right order, asks the right
                questions, and confirms every detail.
              </p>

              <ul className="mt-7 space-y-3 text-sm text-ivory/85">
                {[
                  "Suggests dishes based on craving, occasion or budget",
                  "Asks for pickup vs delivery, date, time, and contact",
                  "Returns a clean summary before you pay",
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

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="#udia"
                  className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft active:scale-[0.98]"
                >
                  Ask Udia
                  <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <span className="text-[10px] uppercase tracking-[0.22em] text-emerald-400">(coming soon)</span>
              </div>
            </div>
          </article>
          </FadeIn>

          {/* Quick form card */}
          <FadeIn delay={0.7} y={20}>
          <article className="group relative h-full overflow-hidden rounded-[1.6rem] border border-border bg-surface p-8 shadow-luxe md:p-10 transition-transform hover:-translate-y-1">
            <span className="eyebrow inline-flex items-center">
              <span className="gold-rule" />
              Direct
              <span className="gold-rule-after" />
            </span>

            <h3 className="mt-3 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
              Quick order form
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-foreground-muted">
              Pick your dishes, choose a date and pickup time — we follow
              up with the final details and your payment link.
            </p>

            {/* Mock form preview */}
            <div className="mt-7 rounded-2xl border border-border bg-surface-warm p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Your name", value: "e.g. Tomi A." },
                  { label: "Phone", value: "+351 9·· ··· ···" },
                  { label: "Pickup or delivery", value: "Pickup · Lisboa", isSelect: true },
                  { label: "Date & time", value: "Sat · 19:30" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                      {f.label}
                    </label>
                    <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground-muted">
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

              <div className="mt-3">
                <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                  Your order
                </label>
                <div className="mt-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground-muted">
                  Smoky party jollof &times; 2 · Suya &times; 1 · Plantain &times; 2…
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/menu" className="btn-gold">
                Open the full form
                <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <span className="text-xs text-foreground-subtle">Calendar shows real availability · Payment link follows confirmation</span>
            </div>
          </article>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
