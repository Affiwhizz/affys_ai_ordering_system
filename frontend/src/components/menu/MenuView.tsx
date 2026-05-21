"use client";

import { useMemo, useState } from "react";
import { Lock, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import {
  MENU_CATEGORIES,
  NORMAL_ORDERING_LOCKED,
  LOCK_MESSAGE,
  MIN_ORDER_NOTE,
  type MenuCategory,
  type MenuItem,
  type MenuVariant,
} from "./menu-data";

/**
 * Full daily ordering menu — all categories from Affy's PDF.
 *
 * Per category, dish cards show the monogram + name + description + a row
 * of variant pills (each pill = a portion size with price). Tapping a
 * variant adds it to the cart. When NORMAL_ORDERING_LOCKED is true, all
 * Add buttons are replaced with a "Locked during Portimão" notice.
 */

export default function MenuView({ items }: { items: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(MENU_CATEGORIES[0]);

  const itemsByCategory = useMemo(() => {
    const map = new Map<MenuCategory, MenuItem[]>();
    for (const c of MENU_CATEGORIES) {
      map.set(c, items.filter((i) => i.category === c));
    }
    return map;
  }, [items]);

  return (
    <>
      {/* Hero band */}
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
            Rice dishes, stews, soups, traditional plates, sides and small chops —
            all in 2L / 3L / 4L trays (or 5 / 10 / 15 pieces, depending on the
            dish). Tap a portion to add it to your cart.
          </p>
          <p className="mt-4 max-w-2xl text-xs text-foreground-subtle">
            {MIN_ORDER_NOTE}
          </p>
        </div>
      </section>

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
              className="inline-flex h-9 items-center rounded-full bg-espresso px-4 text-xs font-semibold text-ivory hover:bg-gold hover:text-espresso transition-colors"
            >
              See Portimão menu
            </Link>
          </div>
        </div>
      )}

      {/* Category nav (sticky) */}
      <nav
        aria-label="Menu categories"
        className="sticky top-[76px] z-20 border-b border-border bg-white/95 backdrop-blur-md md:top-[88px]"
      >
        <div className="container-x">
          <div className="flex gap-2 overflow-x-auto py-3 md:py-4">
            {MENU_CATEGORIES.map((c) => {
              const count = itemsByCategory.get(c)?.length ?? 0;
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
        {MENU_CATEGORIES.map((c) => {
          const items = itemsByCategory.get(c) ?? [];
          if (items.length === 0) return null;
          return (
            <section
              key={c}
              id={`cat-${slug(c)}`}
              className="mb-14 scroll-mt-[160px]"
            >
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
                  {c}
                </h2>
                <span className="text-xs uppercase tracking-wider text-foreground-subtle">
                  {items.length} {items.length === 1 ? "dish" : "dishes"}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((it) => (
                  <DishCard key={it.id} item={it} locked={NORMAL_ORDERING_LOCKED} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

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
    </>
  );
}

// ===========================================================================
// Dish card
// ===========================================================================

function DishCard({ item, locked }: { item: MenuItem; locked: boolean }) {
  const { add } = useCart();
  const [addedVariant, setAddedVariant] = useState<string | null>(null);

  const handleAdd = (variant: MenuVariant) => {
    if (locked) return;
    add({
      itemId: item.id,
      name: item.name,
      variant: variant.size,
      price: variant.price,
      channel: "normal",
      thumbnail: { initial: item.monogram, gradient: item.gradient },
    });
    setAddedVariant(variant.size);
    setTimeout(() => setAddedVariant(null), 1200);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-gold/50 hover:shadow-luxe">
      <div className="flex gap-4 p-5">
        {/* Visual */}
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}
          aria-hidden
        >
          <span className="font-display text-3xl text-gold/85">{item.monogram}</span>
        </div>

        {/* Copy */}
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold leading-tight text-espresso">
            {item.name}
          </h3>
          {item.namePt && (
            <p className="text-[11px] italic text-foreground-subtle">{item.namePt}</p>
          )}
          <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
            {item.description}
          </p>
        </div>
      </div>

      {/* Variants */}
      <div className="border-t border-border bg-cream/40 px-5 py-4">
        {locked ? (
          <p className="flex items-center gap-2 text-[12px] text-foreground-muted">
            <AlertCircle size={13} className="text-red" />
            Daily ordering is paused — see the Portimão menu instead.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-3">
            {item.variants.map((v) => {
              const just = addedVariant === v.size;
              return (
                <li key={v.size}>
                  <button
                    type="button"
                    onClick={() => handleAdd(v)}
                    className={`group flex w-full flex-col gap-0.5 rounded-xl border px-3 py-2 text-left transition-all ${
                      just
                        ? "border-forest bg-forest text-ivory"
                        : "border-border bg-white hover:border-espresso hover:bg-espresso hover:text-ivory"
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {v.size}
                    </span>
                    {v.serves && (
                      <span
                        className={`text-[10px] ${just ? "text-ivory/80" : "text-foreground-muted group-hover:text-ivory/80"}`}
                      >
                        {v.serves}
                      </span>
                    )}
                    <span
                      className={`mt-1 font-display text-sm font-semibold ${
                        just ? "text-gold" : "text-red group-hover:text-gold"
                      }`}
                    >
                      {just ? "✓ Added" : `€${v.price.toFixed(v.price % 1 === 0 ? 0 : 2)}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
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
