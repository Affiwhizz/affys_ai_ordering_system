import Link from "next/link";
import { FadeIn } from "@/components/motion";

/**
 * Hero — FULL-BLEED video/photo banner.
 *
 * No container padding, no rounded card, no border. The video (or gradient
 * fallback) fills the entire viewport width edge-to-edge and stretches to
 * ~85vh on mobile / 100vh on tablet+. The fixed transparent Header from
 * Header.tsx floats directly on top of this, so the logo + nav sit OVER
 * the video with no white rectangle between them.
 *
 * Set NEXT_PUBLIC_HERO_VIDEO_URL in Vercel (Production env) to a direct
 * MP4 / WEBM URL (Cloudflare Stream, Mux, Vimeo direct file, or even a
 * file uploaded to Supabase Storage) and the hero autoplays muted+looped.
 * Optional: NEXT_PUBLIC_HERO_POSTER_URL is shown as the poster frame.
 */
const HERO_VIDEO_SRC = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || null;
const HERO_POSTER_SRC = process.env.NEXT_PUBLIC_HERO_POSTER_URL || null;

export default function Hero() {
  return (
    // -mt-[76px] / -mt-[88px] cancels the top padding the page reserves
    // for the fixed Header so the video starts at the very top of the
    // viewport. Header floats over the hero with no white seam.
    <section className="relative -mt-[76px] h-[85vh] min-h-[560px] w-full overflow-hidden md:-mt-[88px] md:h-screen">
      {/* Background layer (z-0): video or brand-gradient fallback */}
      {HERO_VIDEO_SRC ? (
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={HERO_VIDEO_SRC}
          poster={HERO_POSTER_SRC ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : (
        <div
          className="absolute inset-0 z-0 bg-gradient-to-br from-forest via-espresso to-red"
          aria-hidden
        >
          <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.4),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(148,37,26,0.5),transparent_60%)]" />
        </div>
      )}

      {/* Dimming overlay (z-10) — readability over any video frame */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/65"
        aria-hidden
      />

      {/* Foreground content (z-20) */}
      <div className="relative z-20 flex h-full w-full flex-col justify-end px-6 pb-12 pt-[100px] sm:px-10 sm:pt-[120px] md:items-start md:justify-center md:px-16 md:pb-0 md:pt-[110px] lg:px-24">
        <FadeIn delay={0.1} y={12}>
          <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.22em] text-ivory/85 sm:text-[11px]">
            <span className="mr-3 inline-block h-px w-7 bg-gold align-middle" />
            Bold West-African flavours · Made in Portugal
            <span className="ml-3 inline-block h-px w-7 bg-gold align-middle" />
          </span>
        </FadeIn>

        <FadeIn delay={0.25} duration={0.8}>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.02] tracking-tight text-ivory sm:text-5xl md:text-6xl lg:text-7xl">
            A taste of{" "}
            <span className="italic gold-shimmer">home,</span>{" "}
            served with care.
          </h1>
        </FadeIn>

        {/* Body paragraph: visible on desktop, hidden on mobile per request
            (mobile homepage stays tight — body copy is repeated in OrderOptions). */}
        <FadeIn delay={0.5}>
          <p className="mt-5 hidden max-w-xl text-base leading-relaxed text-ivory/90 sm:block sm:text-lg">
            Bold, comforting, home-style Nigerian meals, preordered,
            delivered, catered, and brought to life at pop-ups across
            Portugal. Slow-cooked the way it should be.
          </p>
        </FadeIn>

        <FadeIn delay={0.7} className="mt-6 md:mt-9">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <Link
              href="/menu"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft hover:-translate-y-0.5 active:scale-[0.98] sm:px-7"
            >
              <span>Start an order</span>
              <svg
                className="ml-2 hidden sm:block"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M5 12h14m0 0-5-5m5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="#udia"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ivory/40 bg-ivory/10 px-5 text-sm font-semibold text-ivory backdrop-blur transition-all hover:border-ivory hover:bg-ivory/20 hover:-translate-y-0.5 active:scale-[0.98] sm:px-7"
            >
              <span className="relative mr-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              Ask Udia
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
