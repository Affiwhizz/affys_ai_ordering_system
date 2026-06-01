"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { FadeIn } from "@/components/motion";
import DishDetailModal from "@/components/menu/DishDetailModal";
import type { MenuItem } from "@/components/menu/menu-data";

/**
 * "This week at Affy's", features ONE weekly special (the first one flagged in
 * admin) in the hero spot, with a modal listing the rest. Each special opens
 * the full dish detail so visitors can order it. If nothing is flagged, shows
 * sensible default copy so the section never looks empty.
 */

const PICKUP_WINDOW = "Mon to Sat · Lisbon";
const DEADLINE = "Preorders close every Friday · 18:00 WET";

export default function ThisWeek({ specials }: { specials: MenuItem[] }) {
  const [listOpen, setListOpen] = useState(false);
  const [detail, setDetail] = useState<MenuItem | null>(null);

  const featured = specials[0] ?? null;
  const rest = specials.slice(1);
  const fmt = (n: number) => `€${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
  const lowestOf = (d: MenuItem) =>
    d.variants.length > 0 ? Math.min(...d.variants.map((v) => v.price)) : null;

  const headline = featured
    ? featured.name
    : "Bold, comforting Nigerian plates, fresh every week.";
  const sub = featured
    ? rest.length > 0
      ? `Also this week: ${rest.map((d) => d.name).join(", ")}.`
      : featured.description
    : "Smoky party jollof, suya skewers, pepper sauce, and soft plantain.";

  const featImg = featured?.images?.[0];

  const openDetail = (d: MenuItem) => {
    setListOpen(false);
    setDetail(d);
  };

  return (
    <section id="this-week" className="relative py-6 md:py-20">
      <div className="container-x">
        <FadeIn>
          <article className="relative overflow-hidden rounded-[1.6rem] border border-border bg-surface shadow-luxe">
            <div className="grid items-stretch md:grid-cols-[0.9fr_1fr]">
              {/* Visual */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-red via-espresso to-forest md:aspect-auto md:min-h-[360px]">
                {featured?.videoUrl ? (
                  <video
                    src={featured.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : featImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featImg.url}
                    alt={featImg.alt ?? featured?.name ?? "This week's dish"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-display text-[12rem] leading-none text-gold/85 drop-shadow-lg"
                      aria-hidden
                    >
                      {featured?.monogram ?? "J"}
                    </span>
                  </div>
                )}

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
                  This week at Affy&rsquo;s
                  <span className="gold-rule-after" />
                </span>

                <h2 className="mt-4 font-display text-3xl font-medium leading-[1.1] tracking-tight text-espresso sm:text-4xl">
                  {headline}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{sub}</p>

                <dl className="mt-7 grid max-w-md grid-cols-2 gap-5">
                  <div className="border-l border-gold/40 pl-4">
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-foreground-subtle">
                      Pickup &amp; Delivery window
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold text-espresso">{PICKUP_WINDOW}</dd>
                  </div>
                  <div className="border-l border-gold/40 pl-4">
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-foreground-subtle">
                      Order deadline
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold text-red">{DEADLINE}</dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {specials.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setListOpen(true)}
                      className="btn-gold"
                    >
                      See this week&rsquo;s menu
                      {specials.length > 1 ? ` (${specials.length})` : ""}
                    </button>
                  ) : (
                    <Link href="/menu" className="btn-gold">
                      See this week&rsquo;s menu
                    </Link>
                  )}
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

      {/* Weekly specials list modal */}
      {listOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setListOpen(false)}
            className="absolute inset-0 bg-espresso/50 backdrop-blur-sm"
          />
          <div className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-luxe sm:rounded-3xl">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-display text-lg font-semibold text-espresso">
                This week&rsquo;s specials
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setListOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-cream"
              >
                <X size={16} />
              </button>
            </header>
            <div className="grid max-h-[70vh] gap-3 overflow-y-auto p-5 sm:grid-cols-2">
              {specials.map((d) => {
                const lo = lowestOf(d);
                const im = d.images?.[0];
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => openDetail(d)}
                    className="group flex items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:border-gold"
                  >
                    {im ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={im.url}
                        alt={im.alt ?? d.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <span
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${d.gradient}`}
                      >
                        <span className="font-display text-2xl text-gold/85">{d.monogram}</span>
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate font-display text-base font-semibold text-espresso">
                        {d.name}
                      </span>
                      {lo !== null && (
                        <span className="text-sm font-medium text-red">From {fmt(lo)}</span>
                      )}
                      <span className="mt-0.5 block text-xs font-semibold text-espresso group-hover:text-red">
                        View &amp; order →
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {detail && (
        <DishDetailModal item={detail} onClose={() => setDetail(null)} />
      )}
    </section>
  );
}
