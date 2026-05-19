import Link from "next/link";
import { AzulejoTile } from "./Azulejo";
import { FadeIn, MotionCard, RevealHeading } from "@/components/motion";
import AddToCartButton from "@/components/cart/AddToCartButton";

/**
 * Helper — parse a "From €28" string to a number for cart pricing.
 * Falls back to 0 if the format changes.
 */
function priceFromLabel(s: string): number {
  const match = s.match(/€\s*([\d,.]+)/);
  return match ? Number(match[1].replace(",", ".")) : 0;
}

/**
 * Placeholder menu data — replace with the real Affy's menu (with proper
 * 2L / 3L / 4L portion options, Portimão bowl prices, per-tray, per-pack
 * variants) when the menu is finalized.
 */

interface Dish {
  initial: string;
  name: string;
  tagline: string;
  portion: string;       // serving size hint
  origin: string;        // small italic culture line
  priceFrom: string;     // "From €__"
  tag: string;
  tagTone: "gold" | "forest" | "red";
  gradient: string;
}

const DISHES: Dish[] = [
  {
    initial: "J",
    name: "Smoky Party Jollof",
    tagline: "Open-fire rice, scotch bonnet, slow-built tomato base.",
    portion: "2L · serves 3–4",
    origin: "Signature",
    priceFrom: "From €28",
    tag: "Most ordered",
    tagTone: "gold",
    gradient: "from-[#94251A] via-[#B33A2D] to-[#1E1A17]",
  },
  {
    initial: "E",
    name: "Egusi & Pounded Yam",
    tagline: "Melon-seed stew, leafy greens, hand-pounded yam.",
    portion: "Single · serves 1",
    origin: "West African classic",
    priceFrom: "From €16",
    tag: "Comfort",
    tagTone: "forest",
    gradient: "from-[#12372A] via-[#1E5A45] to-[#1E1A17]",
  },
  {
    initial: "S",
    name: "Suya Skewers",
    tagline: "Yaji-spiced beef, charcoal-grilled, onions & lime.",
    portion: "Per 4 skewers",
    origin: "Northern Nigeria",
    priceFrom: "From €14",
    tag: "Spicy",
    tagTone: "red",
    gradient: "from-[#1E1A17] via-[#3A3430] to-[#94251A]",
  },
  {
    initial: "A",
    name: "Asun (Peppered Goat)",
    tagline: "Smoked goat, peppers, onions — bar-snack royalty.",
    portion: "Pack · serves 1–2",
    origin: "Pop-up favourite",
    priceFrom: "From €16",
    tag: "Editor's pick",
    tagTone: "gold",
    gradient: "from-[#94251A] via-[#1E1A17] to-[#12372A]",
  },
  {
    initial: "P",
    name: "Pepper Soup",
    tagline: "Goat or catfish, fragrant herbs, healing broth.",
    portion: "Bowl · serves 1",
    origin: "Eat slow",
    priceFrom: "From €15",
    tag: "Warming",
    tagTone: "forest",
    gradient: "from-[#12372A] via-[#1E1A17] to-[#3A3430]",
  },
  {
    initial: "C",
    name: "Small Chops Platter",
    tagline: "Puff puff, gizdodo, spring rolls, samosas.",
    portion: "Platter · serves 4–6",
    origin: "For sharing",
    priceFrom: "From €28",
    tag: "Sharing",
    tagTone: "red",
    gradient: "from-[#1E1A17] via-[#94251A] to-[#D4AF37]",
  },
];

const tagStyle: Record<Dish["tagTone"], string> = {
  gold: "bg-gold text-espresso",
  forest: "bg-forest text-ivory",
  red: "bg-red text-ivory",
};

export default function SignatureDishes() {
  return (
    <section id="menu" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <FadeIn delay={0.05} y={12}>
              <span className="eyebrow inline-flex items-center">
                <span className="gold-rule" />
                The signatures
                <span className="gold-rule-after" />
              </span>
            </FadeIn>
            <RevealHeading
              as="h2"
              delay={0.15}
              className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl"
              tokens={[
                "Plates",
                "that",
                <span key="ital" className="italic text-red">
                  tell stories
                </span>,
                ".",
              ]}
            />
            <FadeIn delay={0.35}>
              <p className="mt-5 text-lg text-foreground-muted">
                A taste of the menu. Full preorder list updates weekly —
                specials drop on Fridays.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.45}>
            <Link
              href="/menu"
              className="group inline-flex items-center gap-3 text-sm font-semibold text-espresso transition-colors hover:text-red"
            >
              See the full menu
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-surface transition-all group-hover:bg-gold group-hover:border-gold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {DISHES.map((d, i) => (
            <FadeIn
              key={d.name}
              delay={0.05 + (i % 3) * 0.08}
              y={20}
            >
              <MotionCard
                lift={-6}
                tap={0.99}
                className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface transition-colors hover:border-gold/50 hover:shadow-luxe"
              >
              {/* Header / visual */}
              <div
                className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${d.gradient}`}
              >
                {/* Subtle azulejo overlay */}
                <div className="absolute inset-0 opacity-15">
                  <div className="grid h-full w-full grid-cols-3 grid-rows-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <AzulejoTile key={i} tone="forest" size={120} className="opacity-40" />
                    ))}
                  </div>
                </div>

                {/* Display monogram */}
                <span className="relative font-display text-[8rem] leading-none text-gold/85 drop-shadow-lg">
                  {d.initial}
                </span>

                {/* Tag */}
                <span
                  className={`absolute left-4 top-4 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${tagStyle[d.tagTone]}`}
                >
                  {d.tag}
                </span>

                {/* Origin chip */}
                <span className="absolute bottom-4 left-4 right-4 text-[11px] uppercase tracking-[0.2em] text-ivory/80">
                  {d.origin}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-espresso">
                    {d.name}
                  </h3>
                  <span className="font-display text-lg font-semibold text-red whitespace-nowrap">
                    {d.priceFrom}
                  </span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                  {d.portion}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                  {d.tagline}
                </p>
                <div className="mt-5">
                  <AddToCartButton
                    itemId={d.name.toLowerCase().replace(/\s+/g, "-")}
                    name={d.name}
                    variant={d.portion}
                    price={priceFromLabel(d.priceFrom)}
                    channel="normal"
                    thumbnail={{ initial: d.initial, gradient: d.gradient }}
                  />
                </div>
              </div>
              </MotionCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
