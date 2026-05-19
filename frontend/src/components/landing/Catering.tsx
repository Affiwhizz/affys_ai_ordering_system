"use client";

import { useState } from "react";
import Link from "next/link";
import { AzulejoTile } from "./Azulejo";
import { FadeIn, MotionCard, RevealHeading } from "@/components/motion";

/**
 * Image that gracefully hides itself when the file isn't there.
 * Reveals the gradient + monogram fallback behind it. Once Affy drops real
 * photos at /catering/{slug}.jpg, this fades them in automatically.
 */
function CateringImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

/**
 * Each occasion has an `image` slot — drop a real photo at the path shown
 * (e.g. /catering/weddings.jpg in frontend/public/catering/) and it'll
 * appear behind the card content. Until then a brand-gradient placeholder
 * with a serif initial reads as intentional, not broken.
 */
const OCCASIONS = [
  {
    title: "Weddings",
    body: "Full-spread Nigerian buffets, party jollof for hundreds, drinks station.",
    image: "/catering/weddings.jpg",
    initial: "W",
    gradient: "from-red via-red-soft to-espresso",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 21s-7-4.5-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-7 10-7 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Birthdays & naming ceremonies",
    body: "Small chops, suya stations, soft drinks — sized to your guest list.",
    image: "/catering/birthdays.jpg",
    initial: "B",
    gradient: "from-gold via-gold-deep to-espresso",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v4M5 5l3 3M2 12h4M5 19l3-3M12 22v-4M19 19l-3-3M22 12h-4M19 5l-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    title: "Corporate",
    body: "Office lunches, away-days, launches — clean delivery, clear invoicing.",
    image: "/catering/corporate.jpg",
    initial: "C",
    gradient: "from-forest via-forest-soft to-espresso",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    title: "Pop-ups",
    body: "Affy&rsquo;s on the road. Watch our IG for the next pop-up location.",
    image: "/catering/popups.jpg",
    initial: "P",
    gradient: "from-espresso via-red to-gold",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 4 9v12h6v-6h4v6h6V9l-8-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Catering() {
  return (
    <section
      id="catering"
      className="relative py-24 md:py-32 bg-surface-warm border-y border-border"
    >
      <div className="container-x">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Showpiece */}
          <FadeIn y={20} duration={0.8}>
            <div className="relative overflow-hidden rounded-[1.6rem] border border-border bg-red text-ivory shadow-luxe">
              <div className="absolute inset-0 opacity-25" aria-hidden>
                <div className="grid h-full w-full grid-cols-4 grid-rows-5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <AzulejoTile key={i} tone="forest" size={120} />
                  ))}
                </div>
              </div>
              <div className="relative p-10 md:p-12">
                <span className="eyebrow inline-flex items-center text-gold">
                  <span className="gold-rule" />
                  Catering & events
                  <span className="gold-rule-after" />
                </span>

                <RevealHeading
                  as="h2"
                  delay={0.15}
                  className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl"
                  tokens={[
                    "Feed",
                    "the",
                    "room.",
                    <span key="ital" className="italic text-gold">
                      All of it.
                    </span>,
                  ]}
                />
                <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/80">
                  From intimate dinners of 5 to celebrations of 500 — Affy&rsquo;s
                  caters with the same care, same hands, same kitchen.
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-6 max-w-sm">
                  <div className="border-l border-gold/40 pl-4">
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-ivory/60">From</dt>
                    <dd className="mt-1 font-display text-2xl text-ivory">5 guests</dd>
                  </div>
                  <div className="border-l border-gold/40 pl-4">
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-ivory/60">Up to</dt>
                    <dd className="mt-1 font-display text-2xl text-ivory">500 guests</dd>
                  </div>
                </dl>

                <Link
                  href="#order"
                  className="mt-9 inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-espresso transition-all hover:bg-gold-soft active:scale-[0.98]"
                >
                  Request catering quote
                  <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Occasions list */}
          <div>
            <FadeIn delay={0.1} y={12}>
              <span className="eyebrow inline-flex items-center">
                <span className="gold-rule" />
                We cater
                <span className="gold-rule-after" />
              </span>
            </FadeIn>
            <RevealHeading
              as="h3"
              delay={0.2}
              className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-espresso sm:text-4xl"
              tokens="Every kind of gathering — done the way it should be."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2" role="list">
              {OCCASIONS.map((o, i) => (
                <FadeIn key={o.title} delay={0.5 + i * 0.1} y={16}>
                  <MotionCard
                    lift={-4}
                    className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-gold/60 hover:shadow-luxe"
                  >
                    {/* Image header — falls back to gradient + monogram if file missing */}
                    <div className={`relative h-32 overflow-hidden bg-gradient-to-br ${o.gradient}`}>
                      <CateringImage src={o.image} />
                      <span
                        className="absolute inset-0 flex items-center justify-center font-display text-[5rem] leading-none text-gold/85"
                        aria-hidden
                      >
                        {o.initial}
                      </span>
                      <span
                        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-red shadow-sm backdrop-blur-sm"
                        aria-hidden
                      >
                        {o.icon}
                      </span>
                    </div>
                    <div className="p-5">
                      <h4 className="font-display text-lg font-semibold text-espresso">
                        {o.title}
                      </h4>
                      <p
                        className="mt-2 text-sm leading-relaxed text-foreground-muted"
                        dangerouslySetInnerHTML={{ __html: o.body }}
                      />
                    </div>
                  </MotionCard>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={1.05}>
              <p className="mt-8 text-sm text-foreground-muted">
                Got an event Udia hasn&rsquo;t seen before?{" "}
                <Link href="#order" className="font-semibold text-espresso underline decoration-gold underline-offset-4 hover:text-red">
                  Request a catering quote
                </Link>{" "}
                — we&rsquo;ll come back with a tailored menu and a real number.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
