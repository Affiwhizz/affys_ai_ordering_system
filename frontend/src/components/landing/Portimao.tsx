"use client";

import { useState } from "react";
import Link from "next/link";
import { AzulejoTile } from "./Azulejo";
import { FadeIn, RevealHeading, MotionCard } from "@/components/motion";
import AddToCartButton from "@/components/cart/AddToCartButton";
import PortimaoPreorderModal from "./modals/PortimaoPreorderModal";
import type { PortimaoStatus } from "@/lib/store/types";

function priceFromLabel(s: string): number {
  const match = s.match(/€\s*([\d,.]+)/);
  return match ? Number(match[1].replace(",", ".")) : 0;
}

/**
 * Portimão campaign block.
 *
 * Toggle visibility / urgency from one place. Wire this to admin later.
 * Driven by the admin Portimão control (store_settings → portimao status):
 *   live      → loud, urgent preorder block
 *   sold-out  → compact sold-out / waitlist strip
 *   off-season→ hidden from the homepage entirely
 */
const CAMPAIGN_DELIVERY_START = "Thursday (2 July) · 10:00 WET";
const CAMPAIGN_PICKUP = "Thurs (2 July), Mon (6 July) · Rua da Pedra";
const CAMPAIGN_SLOTS_LEFT = 28;

const FESTIVAL_BOWLS: { name: string; from: string; tag: string }[] = [
  { name: "Jollof + jerk chicken bowl", from: "From €12", tag: "Most ordered" },
  { name: "Suya skewers + dodo", from: "From €11", tag: "Spicy" },
  { name: "Pepper rice + fried fish", from: "From €13", tag: "Hearty" },
  { name: "Small chops platter", from: "From €9", tag: "Sharing" },
];

export default function Portimao({
  status = "live",
}: {
  status?: PortimaoStatus;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  // Campaign over, remove the block from the homepage entirely.
  if (status === "off-season") return null;

  // Sold out, compact strip pointing to the waitlist on the campaign page.
  if (status === "sold-out") {
    return (
      <section
        id="portimao"
        aria-label="Portimão campaign, sold out"
        className="relative border-y border-border bg-surface py-16 md:py-20"
      >
        <div className="container-x">
          <FadeIn>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="eyebrow inline-flex items-center">
                  <span className="gold-rule" />
                  Portimão · Sold out
                  <span className="gold-rule-after" />
                </span>
                <p className="mt-2 max-w-md text-base text-foreground-muted">
                  Today&rsquo;s Portimão slots are fully booked. Join the
                  waitlist and we&rsquo;ll message you the moment a slot opens.
                </p>
              </div>
              <Link href="/portimao" className="btn-ghost">
                Join the waitlist
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section
      id="portimao"
      aria-label="Portimão preorder campaign, live now"
      className="relative overflow-hidden bg-espresso text-ivory"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-forest/40 via-espresso to-red/30"
        aria-hidden
      />
      <div
        className="absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -left-32 h-[26rem] w-[26rem] rounded-full bg-red/20 blur-3xl"
        aria-hidden
      />

      {/* Gold hairline top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" aria-hidden />

      <div className="container-x relative py-20 md:py-28">
        <div className="grid items-start gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Copy / urgency column */}
          <div>
            <FadeIn delay={0.1} y={12}>
              <span className="inline-flex items-center gap-2 rounded-full border border-red-soft/60 bg-red/15 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-ivory backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red opacity-80 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
                </span>
                Festival mode is now live
              </span>
            </FadeIn>

            <RevealHeading
              as="h2"
              delay={0.25}
              className="mt-5 font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
              tokens={[
                <span key="affys" className="text-ivory">
                  Affy&rsquo;s in
                </span>,
                <span key="port" className="italic gold-shimmer">
                  Portimão.
                </span>,
              ]}
            />

            <FadeIn delay={0.55}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">
                Pop-up preorder for Jul 2, Jul 7, 2026 · Rua da Pedra,
                Portimão. Bowls from €19. Pick a slot from the calendar and
                we will follow up with the final details.
              </p>
            </FadeIn>

            {/* Urgency strip */}
            <FadeIn delay={0.75}>
              <dl className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-3 max-w-lg">
                <div className="border-l border-gold/40 pl-4">
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory/55">Delivery starts</dt>
                  <dd className="mt-1.5 font-display text-xl text-ivory">
                    {CAMPAIGN_DELIVERY_START}
                  </dd>
                </div>
                <div className="border-l border-gold/40 pl-4">
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory/55">Pickup</dt>
                  <dd className="mt-1.5 font-display text-xl text-ivory">
                    {CAMPAIGN_PICKUP}
                  </dd>
                </div>
                <div className="border-l border-gold/40 pl-4 col-span-2 sm:col-span-1">
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory/55">Slots left</dt>
                  <dd className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-display text-2xl text-gold gold-shimmer">
                      {CAMPAIGN_SLOTS_LEFT}
                    </span>
                    <span className="text-xs text-ivory/55">today</span>
                  </dd>
                </div>
              </dl>
            </FadeIn>

            <FadeIn delay={0.95}>
              <div className="mt-9 flex flex-wrap items-start gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Preorder for Portimão
                  <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="flex flex-col items-start gap-1.5">
                  <Link
                    href="#udia"
                    className="inline-flex h-12 items-center rounded-full border border-ivory/30 px-6 text-sm font-semibold text-ivory transition-colors hover:bg-ivory/10"
                  >
                    <span className="relative mr-2 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                    </span>
                    Ask Udia for festival picks
                  </Link>
                  <span className="ml-3 text-[10px] uppercase tracking-[0.22em] text-emerald-400">
                    (coming soon)
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={1.1}>
              <p className="mt-6 max-w-md text-xs text-ivory/50">
                Two ways to preorder: through Affy&rsquo;s site (pickup only,
                confirmation by email & phone) or via Uber Eats during festival
                hours.
              </p>
            </FadeIn>
          </div>

          {/* Festival bowls grid */}
          <FadeIn delay={0.5} y={20}>
            <div className="relative">
              {/* Decorative azulejo wash behind bowls */}
              <div className="pointer-events-none absolute inset-0 -z-0 opacity-25" aria-hidden>
                <div className="grid h-full w-full grid-cols-3 grid-rows-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <AzulejoTile key={i} tone="forest" size={110} />
                  ))}
                </div>
              </div>

              <div className="relative rounded-[1.6rem] border border-gold/30 bg-espresso/60 p-5 backdrop-blur-md sm:p-6">
                <div className="flex items-center justify-between border-b border-ivory/10 pb-3">
                  <p className="eyebrow text-gold">Festival menu</p>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ivory/55">
                    Bowls · €9-€13
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {FESTIVAL_BOWLS.map((b, i) => (
                    <FadeIn key={b.name} delay={0.65 + i * 0.08} y={12}>
                      <MotionCard
                        lift={-4}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ivory/10 bg-espresso/70 p-4 transition-colors hover:border-gold/40"
                      >
                        <div className="relative h-24 -mx-4 -mt-4 mb-3 overflow-hidden rounded-t-2xl bg-gradient-to-br from-red via-espresso to-forest">
                          <span className="absolute inset-0 flex items-center justify-center font-display text-5xl text-gold/85">
                            {b.name.charAt(0)}
                          </span>
                          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-espresso">
                            {b.tag}
                          </span>
                        </div>
                        <p className="font-display text-sm font-semibold leading-tight text-ivory">
                          {b.name}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gold">
                          {b.from}
                        </p>
                        <div className="mt-3">
                          <AddToCartButton
                            itemId={b.name.toLowerCase().replace(/\s+/g, "-")}
                            name={b.name}
                            variant="Festival bowl"
                            price={priceFromLabel(b.from)}
                            channel="portimao"
                            thumbnail={{
                              initial: b.name.charAt(0),
                              gradient: "from-red via-espresso to-forest",
                            }}
                            label="Add to order"
                            size="sm"
                          />
                        </div>
                      </MotionCard>
                    </FadeIn>
                  ))}
                </div>

                <Link
                  href="/portimao#menu"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 bg-espresso/40 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso hover:border-gold"
                >
                  See full festival menu
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Gold hairline bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" aria-hidden />

      <PortimaoPreorderModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
