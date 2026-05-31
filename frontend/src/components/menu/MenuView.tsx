"use client";

import { useMemo, useState } from "react";
import { Lock, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import {
  MENU_CATEGORIES,
  NORMAL_ORDERING_LOCKED,
  LOCK_MESSAGE,
  MIN_ORDER_NOTE,
  type MenuItem,
} from "./menu-data";
import DishDetailModal from "./DishDetailModal";
import NotifyMeForm from "@/components/NotifyMeForm";

/**
 * Full daily ordering menu.
 *
 * Each dish is a large visual tile (looping video or photo, with the name and
 * "starts from €…" over it). Tapping a tile opens the rich detail modal where
 * the customer sees photos, ingredients, spice level, portions, and adds to
 * the cart. A search box at the top filters across all categories. Categories
 * and their order come from the database (with the canonical list as fallback).
 */

export default function MenuView({
  items,
  categories,
}: {
  items: MenuItem[];
  categories?: string[];
}) {
  // Categories to show, in order: prefer the DB list, fall back to canonical,
  // and always include any category present on items but missing from the list.
  const orderedCategories = useMemo(() => {
    const base =
      categories && categories.length > 0
        ? categories
        : (MENU_CATEGORIES as readonly string[]).slice();
    const present = Array.from(new Set(items.map((i) => i.category)));
    const extras = present.filter((c) => !base.includes(c));
    return [...base, ...extras];
  }, [categories, items]);

  const [activeCategory, setActiveCategory] = useState<string>(
    orderedCategories[0] ?? "",
  );
  const [openItem, setOpenItem] = useState<MenuItem | null>(null);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  // Live operator pause (set from the admin Portimão control).
  const { orderingPaused, resumeDate } = useCart();
  const resumeLabel = resumeDate
    ? new Date(`${resumeDate}T00:00:00`).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const c of orderedCategories) {
      map.set(c, items.filter((i) => i.category === c));
    }
    return map;
  }, [items, orderedCategories]);

  // Lookup for resolving "pairs well with" ids → dishes.
  const byDbId = useMemo(() => {
    const map = new Map<string, MenuItem>();
    for (const it of items) if (it.dbId) map.set(it.dbId, it);
    return map;
  }, [items]);

  const openItemPairings = useMemo(() => {
    if (!openItem) return [];
    return (openItem.pairingIds ?? [])
      .map((id) => byDbId.get(id))
      .filter((x): x is MenuItem => Boolean(x));
  }, [openItem, byDbId]);

  const searchResults = useMemo(() => {
    if (!q) return [];
    return items.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        (it.description ?? "").toLowerCase().includes(q) ||
        (it.ingredients ?? []).some((ing) => ing.toLowerCase().includes(q)) ||
        String(it.category).toLowerCase().includes(q),
    );
  }, [items, q]);

  return (
    <>
      {/* Hero band + search */}
      <section className="relative overflow-hidden border-b border-border bg-cream">
        <div className="container-x relative py-12 md:py-16">
          <span className="eyebrow inline-flex items-center">
            <span className="gold-rule" />
            Daily ordering · Full menu
            <span className="gold-rule-after" />
          </span>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl lg:text-6xl">
            Every dish, every portion.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
            Rice dishes, stews, soups, traditional plates, sides and small chops , 
            in 2-3 and 4 litres (or by the piece, depending on the dish). Tap any
            dish to see its photos, ingredients and spice options, and add it to
            your order.
          </p>

          {/* Search */}
          <div className="mt-6 flex max-w-md items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 shadow-sm focus-within:border-espresso">
            <Search size={16} className="shrink-0 text-foreground-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes or ingredients…"
              className="flex-1 bg-transparent text-sm text-espresso placeholder:text-foreground-subtle focus:outline-none"
              aria-label="Search the menu"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-foreground-muted hover:bg-cream"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <p className="mt-4 max-w-2xl text-xs text-foreground-subtle">{MIN_ORDER_NOTE}</p>
        </div>
      </section>

      {/* Live operator pause (admin-controlled) */}
      {orderingPaused && (
        <div className="border-b border-border bg-gold/10 px-4 py-4 md:px-8">
          <div className="container-x flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold text-espresso">
              <Lock size={14} />
            </span>
            <p className="flex-1 text-espresso">
              <strong className="font-semibold">
                We&rsquo;re at Afro Nation, daily Lisbon orders are paused.
              </strong>{" "}
              {resumeLabel
                ? `Browse the menu and come back, we resume on ${resumeLabel}.`
                : "Browse the menu and come back soon, we resume shortly."}
            </p>
            <Link
              href="/portimao"
              className="inline-flex h-9 items-center rounded-full bg-espresso px-4 text-xs font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso"
            >
              See Portimão menu
            </Link>
          </div>
          <div className="container-x mt-3">
            <p className="mb-1.5 text-xs text-foreground-muted">
              Want a nudge when we&rsquo;re back? Leave your email or number:
            </p>
            <NotifyMeForm source="daily-pause" compact buttonLabel="Notify me" />
          </div>
        </div>
      )}

      {/* Lock notice */}
      {NORMAL_ORDERING_LOCKED && (
        <div className="border-b border-border bg-red/5 px-4 py-4 md:px-8">
          <div className="container-x flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red text-ivory">
              <Lock size={14} />
            </span>
            <p className="flex-1 text-espresso">
              <strong className="font-semibold">Daily ordering paused.</strong>{" "}
              {LOCK_MESSAGE}
            </p>
            <Link
              href="/portimao"
              className="inline-flex h-9 items-center rounded-full bg-espresso px-4 text-xs font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso"
            >
              See Portimão menu
            </Link>
          </div>
        </div>
      )}

      {q ? (
        /* ---------------- Search results ---------------- */
        <div className="container-x py-12 md:py-16">
          <h2 className="mb-6 font-display text-2xl font-medium tracking-tight text-espresso">
            {searchResults.length} {searchResults.length === 1 ? "result" : "results"} for
            &ldquo;{query}&rdquo;
          </h2>
          {searchResults.length === 0 ? (
            <p className="text-sm text-foreground-muted">
              No dishes match that. Try another word, or clear the search to browse
              everything.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((it) => (
                <DishTile key={it.id} item={it} onOpen={() => setOpenItem(it)} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Category nav (sticky) */}
          <nav
            aria-label="Menu categories"
            className="sticky top-[76px] z-20 border-b border-border bg-white/95 backdrop-blur-md md:top-[88px]"
          >
            <div className="container-x">
              <div className="flex gap-2 overflow-x-auto py-3 md:py-4">
                {orderedCategories.map((c) => {
                  const count = itemsByCategory.get(c)?.length ?? 0;
                  if (count === 0) return null;
                  const active = activeCategory === c;
                  return (
                    <a
                      key={c}
                      href={`#cat-${slug(c)}`}
                      onClick={() => setActiveCategory(c)}
                      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        active
                          ? "border-espresso bg-espresso text-ivory"
                          : "border-border bg-white text-foreground-muted hover:border-espresso hover:text-espresso"
                      }`}
                    >
                      {c}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                          active ? "bg-gold text-espresso" : "bg-cream-deep text-foreground-muted"
                        }`}
                      >
                        {count}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Sections */}
          <div className="container-x py-12 md:py-16">
            {orderedCategories.map((c) => {
              const catItems = itemsByCategory.get(c) ?? [];
              if (catItems.length === 0) return null;
              return (
                <section key={c} id={`cat-${slug(c)}`} className="mb-14 scroll-mt-[160px]">
                  <div className="mb-6">
                    <h2 className="font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
                      {c}
                    </h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {catItems.map((it) => (
                      <DishTile key={it.id} item={it} onOpen={() => setOpenItem(it)} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-border bg-cream/40">
        <div className="container-x py-12 text-center">
          <p className="eyebrow inline-flex items-center justify-center">
            <span className="gold-rule" />
            Ready to order?
            <span className="gold-rule-after" />
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
            <span className="text-red">Cart</span> &middot; ready when you are
          </h2>
          <p className="mt-3 text-sm text-foreground-muted">
            Open the cart icon in the header to review and check out.
          </p>
          <CartShortcut />
        </div>
      </section>

      {openItem && (
        <DishDetailModal
          item={openItem}
          onClose={() => setOpenItem(null)}
          pairings={openItemPairings}
          onOpenPaired={(it) => setOpenItem(it)}
        />
      )}
    </>
  );
}

// ===========================================================================
// Dish tile, large visual card (video / photo / gradient) that opens the modal
// ===========================================================================

function DishTile({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  const lowest =
    item.variants.length > 0
      ? Math.min(...item.variants.map((v) => v.price))
      : null;
  const video = item.videoUrl;
  const img = item.images?.[0];

  const fmt = (n: number) => `€${n.toFixed(n % 1 === 0 ? 0 : 2)}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-cream-deep text-left transition-shadow hover:shadow-luxe sm:aspect-[4/3]"
    >
      {/* Media */}
      {video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={img?.url}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={video}
        />
      ) : img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.url}
          alt={img.alt ?? item.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${item.gradient}`}
          aria-hidden
        >
          <span className="font-display text-6xl text-gold/85">{item.monogram}</span>
        </div>
      )}

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/25 to-transparent" />

      {/* Text */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-ivory drop-shadow-sm sm:text-2xl">
          {item.name}
        </h3>
        {item.namePt && (
          <p className="text-[11px] italic text-ivory/75">{item.namePt}</p>
        )}
        {lowest !== null && (
          <p className="mt-1 text-sm font-medium text-gold">
            Starts from {fmt(lowest)}
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold text-espresso opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          View &amp; order →
        </span>
      </div>
    </button>
  );
}

// ===========================================================================
// Cart shortcut button (live count from context)
// ===========================================================================

function CartShortcut() {
  const { count, openDrawer } = useCart();
  return (
    <button
      type="button"
      onClick={openDrawer}
      className="btn-gold mx-auto mt-6 inline-flex items-center"
    >
      <ShoppingBag size={14} className="mr-2" />
      {count > 0 ? `Open cart (${count})` : "Open cart"}
    </button>
  );
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
