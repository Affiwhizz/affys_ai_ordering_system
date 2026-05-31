"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PORTIMAO } from "./config";

/**
 * Portimão page hero, cinematic, full-bleed, simple.
 *
 * Drop a hero video URL here when ready; gradient fallback below works fine
 * until then.
 */
const PORTIMAO_HERO_VIDEO_SRC: string | null = null;
const PORTIMAO_HERO_POSTER_SRC: string | null = null;

export default function PortimaoHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background, video or warm fallback */}
      {PORTIMAO_HERO_VIDEO_SRC ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={PORTIMAO_HERO_VIDEO_SRC}
          poster={PORTIMAO_HERO_POSTER_SRC ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-red via-espresso to-forest"
          aria-hidden
        >
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.5),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(148,37,26,0.6),transparent_60%)]" />
          </div>
        </div>
      )}

      {/* Dimming overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-espresso/30 via-espresso/45 to-espresso/85"
        aria-hidden
      />

      {/* Back to Affy's */}
      <div className="container-x absolute top-24 left-0 right-0 md:top-28 z-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ivory/70 transition-colors hover:text-ivory"
          >
            <span aria-hidden>←</span>
            Back to Affy&rsquo;s
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container-x relative flex min-h-screen flex-col justify-end pb-24 pt-32 md:pb-32 md:pt-40">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 self-start rounded-full border border-red-soft/60 bg-red/15 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-ivory backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red opacity-80 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
          </span>
          {PORTIMAO.campaignName} · Live
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[0.98] tracking-tight text-ivory sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        >
          Affy&rsquo;s in{" "}
          <span className="italic gold-shimmer">Portim&atilde;o.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/85 sm:text-xl"
        >
          Pop-up preorder for {PORTIMAO.campaignWindow} ·{" "}
          {PORTIMAO.pickupLocation}. Bowls from {PORTIMAO.bowlPriceFrom}. Pick a
          slot from the calendar, we follow up with the final details.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="#preorder"
            className="inline-flex h-14 items-center justify-center rounded-full bg-gold px-8 text-base font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Preorder a slot
            <span className="ml-2" aria-hidden>→</span>
          </Link>
          <Link
            href="#menu"
            className="inline-flex h-14 items-center justify-center rounded-full border border-ivory/40 bg-ivory/5 px-8 text-base font-semibold text-ivory backdrop-blur transition-all hover:border-ivory hover:bg-ivory/15 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            See festival menu
            <span className="ml-2" aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
