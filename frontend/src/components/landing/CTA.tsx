"use client";

import Link from "next/link";
import { useCateringModal } from "./modals/CateringModalProvider";

export default function CTA() {
  const { open: openCateringModal } = useCateringModal();
  return (
    <section className="relative py-8 md:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-forest text-ivory shadow-luxe">
          {/* Azulejo bands */}
          
          

          {/* Glow */}
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-oxblood/30 blur-3xl" aria-hidden />

          <div className="relative grid items-center gap-10 px-8 py-6 md:grid-cols-[1.1fr_1fr] md:px-14 md:py-20 lg:px-20">
            <div>
              <span className="eyebrow inline-flex items-center text-gold">
                <span className="gold-rule" />
                Hungry? Let&rsquo;s sort it.
                <span className="gold-rule-after" />
              </span>
              <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
                Real food, made fresh , {" "}
                <span className="italic gold-shimmer">at your door.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/80">
                Preorder for the week, plan your event, or ask Udia to help
                you build the right order.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {/* Direct path: take them straight to the menu. */}
                <Link
                  href="/menu"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft active:scale-[0.98]"
                >
                  Start an order
                </Link>
                {/* Scrolls to the MeetUdia section which explains coming-soon. */}
                <Link
                  href="#udia"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-ivory/30 px-6 text-sm font-semibold text-ivory transition-colors hover:bg-ivory/10"
                >
                  <span className="relative mr-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  Ask Udia
                </Link>
                {/* Real Portimão page (not the homepage section). */}
                <Link
                  href="/portimao"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-gold/40 bg-espresso/30 px-6 text-sm font-semibold text-ivory backdrop-blur transition-colors hover:border-gold hover:bg-espresso/50"
                >
                  Preorder for Portim&atilde;o
                </Link>
                {/* Opens the catering modal in place, no scroll. */}
                <button
                  type="button"
                  onClick={() => openCateringModal()}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-ivory/20 px-6 text-sm font-semibold text-ivory/90 transition-colors hover:bg-ivory/10 hover:text-ivory"
                >
                  Request catering quote
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[1.6rem] border border-ivory/15 bg-espresso/40 p-6 backdrop-blur-sm">
                <p className="eyebrow text-ivory/60">Try saying to Udia</p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Sunday dinner for 4, something with jollof.",
                    "Office lunch for 25, halal, around €15 a head.",
                    "Naming ceremony Saturday, the works.",
                  ].map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-3 rounded-2xl border border-ivory/10 bg-ivory/5 px-4 py-3 text-sm text-ivory"
                    >
                      <span
                        className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/60"
                        aria-hidden
                      >
                        <span className="absolute inset-1 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep" />
                        <span className="relative font-display text-[10px] font-semibold text-espresso">U</span>
                      </span>
                      <span className="italic">&ldquo;{s}&rdquo;</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
