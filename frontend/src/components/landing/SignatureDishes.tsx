import Link from "next/link";
import { FadeIn, RevealHeading } from "@/components/motion";
import type { MenuItem } from "@/components/menu/menu-data";

/**
 * "Plates that tell stories" — a showcase of real menu dishes (the ones flagged
 * "featured" in admin, or the first few otherwise). Each card links straight to
 * the full menu. Fully editable from the menu manager.
 */
export default function SignatureDishes({ dishes }: { dishes: MenuItem[] }) {
  if (!dishes || dishes.length === 0) return null;

  const fmt = (n: number) => `€${n.toFixed(n % 1 === 0 ? 0 : 2)}`;

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
                A taste of the menu — tap any plate to see the full list, photos,
                portions and spice options.
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
                  <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {dishes.map((d, i) => {
            const lowest =
              d.variants.length > 0
                ? Math.min(...d.variants.map((v) => v.price))
                : null;
            const img = d.images?.[0];
            return (
              <FadeIn key={d.id} delay={0.05 + (i % 3) * 0.08} y={20}>
                <Link
                  href="/menu"
                  className="group block h-full overflow-hidden rounded-3xl border border-border bg-surface transition-all hover:border-gold/50 hover:shadow-luxe"
                >
                  {/* Visual */}
                  <div className="relative h-48 overflow-hidden">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt={img.alt ?? d.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${d.gradient}`}
                        aria-hidden
                      >
                        <span className="font-display text-[7rem] leading-none text-gold/85 drop-shadow-lg">
                          {d.monogram}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-xl font-semibold tracking-tight text-espresso">
                        {d.name}
                      </h3>
                      {lowest !== null && (
                        <span className="whitespace-nowrap font-display text-lg font-semibold text-red">
                          From {fmt(lowest)}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground-muted">
                      {d.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-espresso transition-colors group-hover:text-red">
                      View on menu →
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
