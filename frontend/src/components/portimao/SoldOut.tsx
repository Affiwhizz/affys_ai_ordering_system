import Link from "next/link";
import { FadeIn, RevealHeading } from "@/components/motion";
import { AzulejoTile } from "../landing/Azulejo";
import { PORTIMAO } from "./config";
import NotifyMeForm from "@/components/NotifyMeForm";

/**
 * SOLD OUT state, campaign is live, daily slots are full.
 * Pushes user toward (a) Uber Eats walk-up and (b) waitlist.
 */
export default function PortimaoSoldOut() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-espresso text-ivory">
        <div className="absolute inset-0 bg-gradient-to-br from-forest/40 via-espresso to-red/40" aria-hidden />
        <div className="absolute -top-20 -right-20 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-3xl" aria-hidden />

        <div className="container-x relative pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn delay={0.1} y={12}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ivory/60 transition-colors hover:text-ivory"
              >
                <span aria-hidden>←</span>
                Back to Affy&rsquo;s
              </Link>
            </FadeIn>

            <FadeIn delay={0.2}>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-gold backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Today is sold out
              </span>
            </FadeIn>

            <RevealHeading
              as="h1"
              delay={0.35}
              className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
              tokens={[
                "Every",
                "Portimão",
                <span key="ital" className="italic text-gold">
                  slot is full
                </span>,
                "today.",
              ]}
            />

            <FadeIn delay={0.6}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">
                We&rsquo;re cooking flat-out. There are still two ways to eat
                Affy&rsquo;s today, drop into Uber Eats during festival
                hours, or join the waitlist and we&rsquo;ll message the
                moment a slot opens (cancellations happen).
              </p>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={PORTIMAO.uberEatsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Open on Uber Eats
                  <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  href="#waitlist"
                  className="inline-flex h-12 items-center rounded-full border border-ivory/30 px-6 text-sm font-semibold text-ivory transition-colors hover:bg-ivory/10"
                >
                  Join the waitlist
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Waitlist + Uber Eats hours */}
      <section id="waitlist" className="relative py-24 md:py-32">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.1} y={16}>
              <article className="relative h-full overflow-hidden rounded-[1.6rem] border border-border bg-surface p-8 shadow-luxe md:p-10">
                <span className="eyebrow inline-flex items-center">
                  <span className="gold-rule" />
                  Waitlist
                  <span className="gold-rule-after" />
                </span>
                <h3 className="mt-3 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
                  Drop your number, we&rsquo;ll message you first.
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-foreground-muted">
                  Cancellations open up slots most days. We send waitlist
                  guests a quick WhatsApp the moment one opens.
                </p>
                <div className="mt-6 rounded-2xl border border-border bg-cream p-5">
                  <NotifyMeForm
                    source="portimao-waitlist"
                    buttonLabel="Join the waitlist"
                  />
                </div>
              </article>
            </FadeIn>

            <FadeIn delay={0.2} y={16}>
              <article className="relative h-full overflow-hidden rounded-[1.6rem] border border-gold/40 bg-gradient-to-br from-espresso via-espresso to-red/70 p-8 text-ivory shadow-luxe md:p-10">
                <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" aria-hidden />
                <div className="absolute inset-0 opacity-15" aria-hidden>
                  <div className="grid h-full w-full grid-cols-3 grid-rows-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <AzulejoTile key={i} tone="forest" size={120} />
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <span className="eyebrow inline-flex items-center text-gold">
                    <span className="gold-rule" />
                    Walk-up
                    <span className="gold-rule-after" />
                  </span>
                  <h3 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                    Order direct on Uber Eats, live now.
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-ivory/80">
                    Our store is open during festival hours.
                  </p>
                  <dl className="mt-7 grid grid-cols-2 gap-6 max-w-sm">
                    <div className="border-l border-gold/40 pl-4">
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory/55">Hours</dt>
                      <dd className="mt-1.5 font-display text-lg text-ivory">
                        {PORTIMAO.uberEatsHours}
                      </dd>
                    </div>
                    <div className="border-l border-gold/40 pl-4">
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory/55">Pickup or delivery</dt>
                      <dd className="mt-1.5 font-display text-lg text-ivory">
                        Both available
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-7">
                    <Link
                      href={PORTIMAO.uberEatsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-espresso transition-all hover:bg-gold-soft active:scale-[0.98]"
                    >
                      Open the Uber Eats store
                    </Link>
                  </div>
                </div>
              </article>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
