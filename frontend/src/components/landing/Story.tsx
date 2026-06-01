import { AzulejoTile, AzulejoBlock } from "./Azulejo";
import { FadeIn, RevealHeading } from "@/components/motion";

const PILLARS = [
  {
    title: "Roots",
    body: "Recipes carried from home, cooked for life in Portugal.",
  },
  {
    title: "Slow-built flavour",
    body: "Stews, stocks, spices, and sauces cooked properly, not rushed.",
  },
  {
    title: "Hosted with care",
    body: "From small dinners to 500-guest events, the food arrives planned and ready.",
  },
];

const APOS = "’";

export default function Story() {
  return (
    <section
      id="story"
      className="relative py-10 md:py-32 bg-surface-warm border-y border-border"
    >
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Image / decorative column */}
          <FadeIn y={20} duration={0.8}>
            <div className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] border border-border bg-forest shadow-luxe">
                {/* Decorative azulejo wash inside the frame */}
                <AzulejoBlock
                  size={500}
                  cols={5}
                  rows={6}
                  tone="forest"
                  className="absolute inset-0 opacity-35"
                />
                {/* Centered emblem */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-ivory">
                  <span className="font-display text-7xl text-gold drop-shadow-md">A</span>
                  <span className="mt-3 eyebrow text-ivory/80">Est. 2023 · Portugal</span>
                </div>
              </div>

              {/* Floating azulejo tile */}
              <div className="absolute -bottom-6 -right-6 hidden md:block rounded-2xl border border-border bg-surface p-2 shadow-luxe">
                <AzulejoTile size={120} tone="ivory" />
              </div>
            </div>
          </FadeIn>

          {/* Story column */}
          <div>
            <FadeIn delay={0.1} y={12}>
              <span className="eyebrow inline-flex items-center">
                <span className="gold-rule" />
                Our story
                <span className="gold-rule-after" />
              </span>
            </FadeIn>

            <RevealHeading
              as="h2"
              delay={0.2}
              stagger={0.08}
              className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl"
              tokens={[
                "From",
                "her",
                `mother${APOS}s`,
                "kitchen,",
                <span key="ital" className="italic text-red">
                  to your table
                </span>,
                "in",
                "Portugal.",
              ]}
            />

            <FadeIn delay={0.5}>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-foreground-muted">
                <p>
                  Affy&rsquo;s is the work of Affiong, born in{" "}
                  <span className="text-espresso font-medium">Port Harcourt</span>,
                  with roots in{" "}
                  <span className="text-espresso font-medium">Akwa Ibom, Nigeria</span>,
                  and now cooking in Portugal. The recipes started where most
                  good food starts: in her mother&rsquo;s restaurant, where
                  stews simmered all afternoon and nobody left hungry.
                </p>
                <p>
                  Today the same hands and the same recipes find their way to
                  you, slow-built stews, smoky party jollof, suya off the
                  skewer, small chops that disappear too fast. We cook to
                  order. We cater your weddings, naming ceremonies, pop-ups,
                  and quiet weeknight dinners. Every plate carries a piece of
                  home with it.
                </p>
              </div>
            </FadeIn>

            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {PILLARS.map((p, i) => (
                <FadeIn
                  key={p.title}
                  delay={0.7 + i * 0.12}
                  y={20}
                >
                  <li className="group h-full rounded-2xl border border-border bg-surface p-5 transition-all hover:border-gold/60 hover:shadow-luxe hover:-translate-y-1">
                    <span className="block h-px w-8 bg-gold transition-all group-hover:w-12" />
                    <h3 className="mt-3 font-display text-lg font-semibold text-espresso">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                      {p.body}
                    </p>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
