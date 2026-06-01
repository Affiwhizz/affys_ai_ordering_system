import Link from "next/link";
import { AzulejoBlock, AzulejoStrip } from "./Azulejo";
import { FadeIn } from "@/components/motion";

/**
 * Hero video.
 *
 * Set NEXT_PUBLIC_HERO_VIDEO_URL in Vercel env vars (Production) to a direct
 * MP4 / WEBM URL (Cloudflare Stream, Mux, Vimeo direct file, or even a file
 * uploaded to Supabase Storage) and the hero will autoplay it muted + looped
 * with the Affy's logo and nav overlaid on top — Breakfast Alley style.
 *
 * Leave the env var unset and the hero falls back to the brand-gradient
 * placeholder so the site never looks broken.
 *
 * Optional: NEXT_PUBLIC_HERO_POSTER_URL → a still-frame shown until the
 * video buffers (recommended; uses ~1 fewer second of perceived load time).
 */
const HERO_VIDEO_SRC = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || null;
const HERO_POSTER_SRC = process.env.NEXT_PUBLIC_HERO_POSTER_URL || null;

export default function Hero() {
  return (
    <section className="relative py-8 md:py-12 lg:py-16">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[1.8rem] border border-gold/30 shadow-luxe">
          {/* Background, video or warm fallback */}
          {HERO_VIDEO_SRC ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
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
              className="absolute inset-0 bg-gradient-to-br from-forest via-espresso to-red"
              aria-hidden
            >
              {/* Subtle azulejo wash so the placeholder looks intentional */}
              <AzulejoBlock
                size={500}
                cols={5}
                rows={5}
                tone="forest"
                className="absolute inset-0 h-full w-full opacity-20"
              />
              <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.4),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(148,37,26,0.5),transparent_60%)]" />
            </div>
          )}

          {/* Dimming overlay, keeps copy readable over any video */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/60 to-espresso/35"
            aria-hidden
          />

          {/* Content */}
          <div className="relative max-w-3xl px-8 py-8 md:px-12 md:py-28 lg:px-16 lg:py-36">
            <FadeIn delay={0.1} y={12}>
              <span className="inline-flex items-center text-[11px] font-mono uppercase tracking-[0.22em] text-ivory/70">
                <span className="mr-3 inline-block h-px w-7 bg-gold align-middle" />
                Bold West-African flavours · Made in Portugal
                <span className="ml-3 inline-block h-px w-7 bg-gold align-middle" />
              </span>
            </FadeIn>

            <FadeIn delay={0.25} duration={0.8}>
              <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight text-ivory sm:text-6xl lg:text-7xl">
                A taste of{" "}
                <span className="italic gold-shimmer">home,</span>
                <br className="hidden sm:block" /> served with care.
              </h1>
            </FadeIn>

            <FadeIn delay={0.5}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/85">
                Bold, comforting, home-style Nigerian meals, preordered,
                delivered, catered, and brought to life at pop-ups across
                Portugal. Slow-cooked the way it should be.
              </p>
            </FadeIn>

            <FadeIn delay={0.7} className="mt-9">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <Link
                  href="/menu"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <span>Start an order</span>
                  <svg
                    className="ml-2"
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
                <div className="flex flex-col items-start gap-1.5">
                  <Link
                    href="#udia"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-ivory/40 bg-ivory/5 px-7 text-sm font-semibold text-ivory backdrop-blur transition-all hover:border-ivory hover:bg-ivory/15 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <span className="relative mr-2 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                    </span>
                    Ask Udia
                  </Link>
                  <span className="ml-3 text-[10px] uppercase tracking-[0.22em] text-emerald-400">
                    (coming soon)
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Bottom azulejo divider */}
      <AzulejoStrip className="mt-12 w-full md:mt-16" height={48} tone="ivory" />
    </section>
  );
}
