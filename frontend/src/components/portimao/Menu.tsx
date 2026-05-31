import { FadeIn, MotionCard, RevealHeading } from "@/components/motion";
import { FESTIVAL_MENU, type FestivalItem } from "./config";

const CATEGORIES: { id: FestivalItem["category"]; label: string }[] = [
  { id: "Bowl", label: "Bowls" },
  { id: "Side", label: "Sides" },
  { id: "Snack box", label: "Snack boxes" },
];

const tagStyle: Record<string, string> = {
  "Most ordered": "bg-gold text-espresso",
  Premium: "bg-red text-ivory",
  "On the go": "bg-forest text-ivory",
  Sharing: "bg-espresso text-ivory",
};

export default function PortimaoMenu() {
  return (
    <section
      id="menu"
      className="relative py-24 md:py-32 bg-surface-warm border-y border-border"
    >
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <FadeIn delay={0.05} y={12}>
              <span className="eyebrow inline-flex items-center">
                <span className="gold-rule" />
                Festival menu
                <span className="gold-rule-after" />
              </span>
            </FadeIn>
            <RevealHeading
              as="h2"
              delay={0.15}
              className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl"
              tokens={[
                "Bowls,",
                "sides,",
                "and",
                <span key="ital" className="italic text-red">
                  small chops
                </span>,
                "for",
                "the",
                "weekend.",
              ]}
            />
            <FadeIn delay={0.4}>
              <p className="mt-5 text-lg text-foreground-muted">
                One spice level, gentle enough for everyone. Want heat? Add our
                pepper sauce on the side. Each dish lists exactly what&rsquo;s in
                it, so you can pick what works for you.
              </p>
            </FadeIn>
          </div>
        </div>

        {CATEGORIES.map((cat) => {
          const items = FESTIVAL_MENU.filter((i) => i.category === cat.id);
          if (items.length === 0) return null;
          return (
            <div key={cat.id} className="mt-14">
              <FadeIn delay={0.05} y={10}>
                <h3 className="mb-6 font-display text-xl font-semibold tracking-tight text-espresso">
                  {cat.label}
                  <span className="ml-3 text-xs font-normal uppercase tracking-[0.22em] text-foreground-subtle">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </h3>
              </FadeIn>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {items.map((item, i) => (
                  <FadeIn key={item.name} delay={0.1 + (i % 3) * 0.06} y={14}>
                    <MotionCard
                      lift={-4}
                      className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-gold/50 hover:shadow-luxe"
                    >
                      <div className="flex items-start gap-4">
                        {/* Mini visual */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-red via-espresso to-forest">
                          <span
                            className="absolute inset-0 flex items-center justify-center font-display text-3xl text-gold/85"
                            aria-hidden
                          >
                            {item.initial}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className="font-display text-base font-semibold leading-tight text-espresso">
                              {item.name}
                            </h4>
                            <span className="font-display text-sm font-semibold text-red whitespace-nowrap">
                              {item.priceFrom}
                            </span>
                          </div>
                          {item.tag && (
                            <span
                              className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagStyle[item.tag] ?? "bg-espresso text-ivory"}`}
                            >
                              {item.tag}
                            </span>
                          )}
                          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </MotionCard>
                  </FadeIn>
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
