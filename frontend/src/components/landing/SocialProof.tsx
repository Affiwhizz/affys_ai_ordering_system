import Link from "next/link";
import { FadeIn, MotionCard, RevealHeading } from "@/components/motion";

/**
 * Social Proof — Instagram-style grid + a featured guest quote.
 *
 * Why no fake testimonials:
 *   Affy explicitly asked for honest stats only. So this section ships
 *   with one optional hero quote slot (filled with a clearly-flagged
 *   placeholder until a real one arrives) and 6 IG-style image slots
 *   that Affy populates with real Instagram content.
 *
 * To replace the placeholder quote, edit FEATURED_QUOTE below.
 * To plug real IG images, add { src, alt, href } objects to IG_TILES.
 */

const FEATURED_QUOTE = {
  // Set isPlaceholder to false and fill with a real review when one comes in
  isPlaceholder: true,
  text: "We took the jollof to my brother’s naming ceremony — every guest asked for the recipe. The trays came on time, hot, and packed properly.",
  author: "Replace with a real guest quote",
  context: "Naming ceremony · 80 guests",
};

interface IGTile {
  // src/href left null for now — drop in real IG post URLs / images
  src: string | null;
  alt: string;
  href: string | null;
  // visual fallback
  initial: string;
  bg: string;
}

const IG_TILES: IGTile[] = [
  { src: null, href: null, alt: "Smoky party jollof tray", initial: "J", bg: "from-red via-red-soft to-espresso" },
  { src: null, href: null, alt: "Suya skewers off the grill", initial: "S", bg: "from-espresso via-red to-gold" },
  { src: null, href: null, alt: "Catering setup at a Lisbon event", initial: "C", bg: "from-forest via-forest-soft to-espresso" },
  { src: null, href: null, alt: "Small chops platter", initial: "P", bg: "from-gold via-gold-deep to-espresso" },
  { src: null, href: null, alt: "Egusi soup with pounded yam", initial: "E", bg: "from-forest via-espresso to-red" },
  { src: null, href: null, alt: "Pop-up service moment", initial: "A", bg: "from-red via-espresso to-forest" },
];

export default function SocialProof() {
  return (
    <section
      id="social"
      aria-label="From the table"
      className="relative py-24 md:py-32"
    >
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn delay={0.05} y={12}>
            <span className="eyebrow inline-flex items-center justify-center">
              <span className="gold-rule" />
              From the table
              <span className="gold-rule-after" />
            </span>
          </FadeIn>
          <RevealHeading
            as="h2"
            delay={0.15}
            className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl"
            tokens={[
              "Real",
              "people.",
              <span key="ital" className="italic text-red">
                Real plates.
              </span>,
            ]}
          />
          <FadeIn delay={0.4}>
            <p className="mt-5 text-lg text-foreground-muted">
              Tag us on your socials, on{" "}
              <a
                href="https://instagram.com/_affys"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-espresso underline decoration-gold underline-offset-4 hover:text-red"
              >
                IG
              </a>{" "}
              and{" "}
              <a
                href="https://tiktok.com/@_affys"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-espresso underline decoration-gold underline-offset-4 hover:text-red"
              >
                TikTok
              </a>{" "}
              <span className="font-semibold text-espresso">@_affys</span>,
              when you order from us — we love seeing where Affy&rsquo;s
              ends up!
            </p>
          </FadeIn>
        </div>

        {/* Instagram-style grid */}
        <div className="mt-14 grid gap-3 sm:grid-cols-3 lg:grid-cols-6" role="list">
          {IG_TILES.map((tile, i) => (
            <FadeIn key={i} delay={0.05 + i * 0.06} y={16}>
              <MotionCard
                lift={-4}
                tap={0.99}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface"
              >
                {tile.src ? (
                  <Link href={tile.href ?? "#"} aria-label={tile.alt} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tile.src}
                      alt={tile.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${tile.bg} transition-transform duration-500 group-hover:scale-105`}
                  >
                    <span className="font-display text-5xl text-gold/85" aria-hidden>
                      {tile.initial}
                    </span>
                  </div>
                )}

                {/* IG hover overlay */}
                <div
                  className="pointer-events-none absolute inset-0 flex items-end justify-between p-3 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                >
                  <span className="rounded-full bg-espresso/70 px-2 py-1 text-[10px] uppercase tracking-wider text-ivory backdrop-blur">
                    @atasteofaffy
                  </span>
                  <span className="rounded-full bg-gold p-1.5 text-espresso">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.75-1.25a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
                    </svg>
                  </span>
                </div>
              </MotionCard>
            </FadeIn>
          ))}
        </div>

        {/* Featured guest quote */}
        <FadeIn delay={0.4}>
          <figure className="mx-auto mt-16 max-w-3xl rounded-3xl border border-border bg-surface p-10 text-center shadow-luxe md:p-14">
            {FEATURED_QUOTE.isPlaceholder && (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-strong bg-cream px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Placeholder · replace with a real review
              </span>
            )}
            <span
              className="block font-display text-5xl leading-none text-gold"
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote className="mt-2 font-display text-2xl font-medium leading-snug tracking-tight text-espresso sm:text-3xl">
              {FEATURED_QUOTE.text}
            </blockquote>
            <figcaption className="mt-6 flex flex-col items-center gap-1 text-sm">
              <span className="font-semibold text-espresso">{FEATURED_QUOTE.author}</span>
              <span className="text-xs uppercase tracking-[0.18em] text-foreground-subtle">
                {FEATURED_QUOTE.context}
              </span>
            </figcaption>
          </figure>
        </FadeIn>
      </div>
    </section>
  );
}
