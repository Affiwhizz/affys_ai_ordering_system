import Link from "next/link";
import { FadeIn } from "@/components/motion";

/**
 * Compact "This week at Affy's" announcement card.
 * One section, one job: tell the visitor what's cooking this week and when
 * the preorder window closes. Drop the real image into THIS_WEEK_IMAGE_SRC.
 */
const THIS_WEEK = {
  // Header copy
  eyebrow: "This week at Affy’s",
  // Body — what's on
  dishes: "Smoky party jollof, suya skewers, pepper sauce, and soft plantain.",
  pickupWindowLabel: "Pickup & Delivery window",
  pickupWindow: "Mon — Sat · Lisbon",
  deadlineLabel: "Order deadline",
  deadline: "Preorders close every Friday · 18:00 WET",
  ctaHref: "#menu",
  ctaLabel: "See this week’s menu",
  // Featured initials shown in placeholder gradient if no image yet
  initial: "J",
};

const THIS_WEEK_IMAGE_SRC: string | null = null; // swap in real food image

export default function ThisWeek() {
  return (
    <section id="this-week" className="relative py-16 md:py-20">
      <div className="container-x">
        <FadeIn>
          <article className="relative overflow-hidden rounded-[1.6rem] border border-border bg-surface shadow-luxe">
            <div className="grid items-stretch md:grid-cols-[0.9fr_1fr]">
              {/* Visual */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-red via-espresso to-forest md:aspect-auto md:min-h-[360px]">
                {THIS_WEEK_IMAGE_SRC ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={THIS_WEEK_IMAGE_SRC}
                    alt="This week's featured dish at Affy's"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-display text-[12rem] leading-none text-gold/85 drop-shadow-lg"
                      aria-hidden
                    >
                      {THIS_WEEK.initial}
                    </span>
                  </div>
                )}

                {/* Floating "Live" pill */}
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-espresso/40 px-2.5 py-1 backdrop-blur">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-80 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ivory">
                    Daily preorders open
                  </span>
                </div>
              </div>

              {/* Copy */}
              <div className="p-8 md:p-10 lg:p-12">
                <span className="eyebrow inline-flex items-center">
                  <span className="gold-rule" />
                  {THIS_WEEK.eyebrow}
                  <span className="gold-rule-after" />
                </span>

                <h2 className="mt-4 font-display text-3xl font-medium leading-[1.1] tracking-tight text-espresso sm:text-4xl">
                  {THIS_WEEK.dishes}
                </h2>

                <dl className="mt-7 grid grid-cols-2 gap-5 max-w-md">
                  <div className="border-l border-gold/40 pl-4">
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-foreground-subtle">
                      {THIS_WEEK.pickupWindowLabel}
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold text-espresso">
                      {THIS_WEEK.pickupWindow}
                    </dd>
                  </div>
                  <div className="border-l border-gold/40 pl-4">
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-foreground-subtle">
                      {THIS_WEEK.deadlineLabel}
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold text-red">
                      {THIS_WEEK.deadline}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={THIS_WEEK.ctaHref} className="btn-gold">
                    {THIS_WEEK.ctaLabel}
                    <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <Link
                    href="#udia"
                    className="text-sm font-semibold text-foreground-muted underline decoration-gold underline-offset-4 transition-colors hover:text-espresso"
                  >
                    Or ask Udia what to order
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}
