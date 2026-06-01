"use client";

import { useMemo, useState } from "react";
import { X, ChevronLeft, Plus, Minus, Flame, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import {
  SPICE_LEVELS,
  SPICE_HEAT,
  NORMAL_ORDERING_LOCKED,
  type MenuItem,
  type MenuVariant,
  type SpiceLevel,
} from "./menu-data";

/**
 * Rich dish detail modal, opens when a dish card is clicked. Shows photos
 * (carousel) or a gradient placeholder, an optional video, the description,
 * ingredients, a spice-level picker (preference only), a portion + quantity
 * selector, and an add-to-cart button. Everything degrades gracefully when a
 * field is empty, so it looks right even before photos/ingredients are added.
 */
export default function DishDetailModal({
  item,
  onClose,
  pairings,
  onOpenPaired,
  stackDepth = 1,
}: {
  item: MenuItem;
  onClose: () => void;
  pairings?: MenuItem[];
  onOpenPaired?: (item: MenuItem) => void;
  /** How deep we are in the "pairs well" stack. > 1 means the close X
   *  should look like a back-arrow ("back to <previous dish>"). */
  stackDepth?: number;
}) {
  const { add } = useCart();

  // Combine the gallery with the legacy single-thumbnail column. If only
  // image_url is set (older uploads), use it as the sole image so the modal
  // still shows a hero photo instead of the placeholder.
  const images = useMemo(() => {
    const gallery = item.images ?? [];
    if (gallery.length > 0) return gallery;
    if (item.imageUrl) return [{ url: item.imageUrl, alt: item.name }];
    return [];
  }, [item.images, item.imageUrl, item.name]);
  const spiceOptions = (item.spiceLevels ?? []).filter((s): s is SpiceLevel =>
    (SPICE_LEVELS as readonly string[]).includes(s),
  );
  // keep canonical order
  const orderedSpice = SPICE_LEVELS.filter((s) => spiceOptions.includes(s));

  const [imgIndex, setImgIndex] = useState(0);
  const [variant, setVariant] = useState<MenuVariant | null>(
    item.variants[0] ?? null,
  );
  const [spice, setSpice] = useState<SpiceLevel | null>(orderedSpice[0] ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const ingredients = item.ingredients ?? [];

  const handleAdd = () => {
    if (NORMAL_ORDERING_LOCKED || !variant) return;
    add({
      itemId: item.id,
      name: item.name,
      variant: variant.size,
      spice: spice ?? undefined,
      price: variant.price,
      qty,
      channel: "normal",
      thumbnail: { initial: item.monogram, gradient: item.gradient },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const fmt = (n: number) => `€${n.toFixed(n % 1 === 0 ? 0 : 2)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-espresso/50 backdrop-blur-sm"
      />

      {/*
        Panel.
        Mobile: max-h uses dynamic viewport (100dvh) so iOS Safari's address
        bar doesn't eat the bottom; the panel anchors to items-end so it
        slides up from the bottom; we also leave 4vh at the top so the
        sticky close header is always visible BELOW the Safari chrome.
      */}
      <div className="relative z-10 flex max-h-[calc(100dvh-4vh)] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-luxe sm:max-h-[92vh] sm:rounded-3xl">
        {/* Sticky close header — guarantees the X stays reachable on
            mobile no matter how tall the photo is. */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-white/95 px-3 py-2 backdrop-blur sm:bg-transparent sm:border-transparent sm:py-0">
          {/* Drag handle hint on mobile */}
          <span
            aria-hidden
            className="mx-auto block h-1 w-10 rounded-full bg-foreground-subtle/30 sm:hidden"
          />
          <button
            type="button"
            aria-label={stackDepth > 1 ? "Back to previous dish" : "Close"}
            onClick={onClose}
            className="absolute right-3 top-2 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-espresso shadow-sm backdrop-blur hover:bg-white sm:top-3"
          >
            {stackDepth > 1 ? <ChevronLeft size={18} /> : <X size={18} />}
          </button>
        </div>

        {/*
          Scroll area.
          - flex-1 + min-h-0 is the iOS-safe pattern for nested scroll inside
            a flex column. Without min-h-0 the child refuses to shrink and
            content below the fold (spice picker, portions) becomes
            unreachable on Safari.
          - WebkitOverflowScrolling enables momentum scrolling on older iOS.
        */}
        <div
          className="flex-1 min-h-0 overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Visual: carousel or gradient placeholder.
              h-56 fallback on mobile guarantees the image area renders even
              if Safari fails to compute aspect-ratio inside the flex column.
              flex-shrink-0 stops the flex parent from squashing it to zero. */}
          <div className="relative h-56 w-full shrink-0 bg-cream-deep sm:h-auto sm:aspect-[16/10]">
            {images.length > 0 ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[imgIndex]?.url}
                  alt={images[imgIndex]?.alt ?? item.name}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={(e) => {
                    // If the image fails to load (CORS, 404, malformed URL),
                    // log it so the next debug can see the actual src that
                    // failed. Hide the broken img icon by zeroing height.
                    console.warn("[menu] image failed to load:", e.currentTarget.src);
                    e.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Photo ${i + 1}`}
                        onClick={() => setImgIndex(i)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          i === imgIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div
                className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${item.gradient}`}
                aria-hidden
              >
                <span className="font-display text-7xl text-gold/85">
                  {item.monogram}
                </span>
                {/* TEMP DEBUG — remove once the mobile image bug is solved.
                    Shows what data the modal actually received on this device
                    so we can tell whether the gallery is empty (data problem)
                    vs. the image is failing to render (display problem). */}
                <span className="mt-3 rounded-full bg-black/30 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-ivory">
                  imgs:{item.images?.length ?? 0} url:{item.imageUrl ? "y" : "n"} spice:{item.spiceLevels?.length ?? 0}
                </span>
              </div>
            )}
          </div>

          <div className="px-5 py-5 sm:px-7 sm:py-6">
            {/* Title */}
            <h2 className="font-display text-2xl font-semibold leading-tight text-espresso sm:text-3xl">
              {item.name}
            </h2>
            {item.namePt && (
              <p className="mt-0.5 text-sm italic text-foreground-subtle">
                {item.namePt}
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
              {item.longDescription || item.description}
            </p>

            {/* Ingredients */}
            {ingredients.length > 0 && (
              <div className="mt-5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle">
                  What&rsquo;s in it
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-border bg-cream px-2.5 py-1 text-xs text-espresso"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Spice picker */}
            {orderedSpice.length > 0 && (
              <div className="mt-5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle">
                  Spice level
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {orderedSpice.map((lvl) => {
                    const active = spice === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSpice(lvl)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border px-4 py-2.5 transition-colors ${
                          active
                            ? "border-red bg-red text-ivory"
                            : "border-border bg-white text-espresso hover:border-red"
                        }`}
                      >
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Flame
                              key={i}
                              size={13}
                              className={
                                i < SPICE_HEAT[lvl]
                                  ? active
                                    ? "text-ivory"
                                    : "text-red"
                                  : active
                                    ? "text-ivory/35"
                                    : "text-foreground-subtle/40"
                              }
                              fill={i < SPICE_HEAT[lvl] ? "currentColor" : "none"}
                            />
                          ))}
                        </span>
                        <span className="text-[11px] font-semibold capitalize">{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Portion selector */}
            {item.variants.length > 0 && (
              <div className="mt-5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle">
                  Portion
                </h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {item.variants.map((v) => {
                    const active = variant?.size === v.size;
                    return (
                      <button
                        key={v.size}
                        type="button"
                        onClick={() => setVariant(v)}
                        className={`flex flex-col gap-0.5 rounded-xl border px-3 py-2 text-left transition-colors ${
                          active
                            ? "border-espresso bg-espresso text-ivory"
                            : "border-border bg-white hover:border-espresso"
                        }`}
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                          {v.size}
                        </span>
                        {v.serves && (
                          <span
                            className={`text-[10px] ${active ? "text-ivory/80" : "text-foreground-muted"}`}
                          >
                            {v.serves}
                          </span>
                        )}
                        <span
                          className={`mt-0.5 font-display text-sm font-semibold ${active ? "text-gold" : "text-red"}`}
                        >
                          {fmt(v.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pairs well with */}
            {pairings && pairings.length > 0 && (
              <div className="mt-6 border-t border-border pt-5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle">
                  Pairs well with
                </h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {pairings.map((p) => {
                    const lo =
                      p.variants.length > 0
                        ? Math.min(...p.variants.map((v) => v.price))
                        : null;
                    const pimg = p.images?.[0];
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onOpenPaired?.(p)}
                        className="group flex items-center gap-3 rounded-xl border border-border p-2 text-left transition-colors hover:border-gold"
                      >
                        {pimg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={pimg.url}
                            alt={pimg.alt ?? p.name}
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <span
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${p.gradient}`}
                          >
                            <span className="font-display text-lg text-gold/85">
                              {p.monogram}
                            </span>
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-espresso">
                            {p.name}
                          </span>
                          {lo !== null && (
                            <span className="text-xs font-medium text-red">
                              Add from {fmt(lo)}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="border-t border-border bg-white px-5 py-4 sm:px-7">
          {NORMAL_ORDERING_LOCKED ? (
            <p className="text-center text-sm text-foreground-muted">
              Daily ordering is paused, see the Portimão menu.
            </p>
          ) : (
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1.5">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-espresso hover:bg-cream"
                >
                  <Minus size={14} />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-espresso">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-espresso hover:bg-cream"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={!variant}
                className={`btn-gold flex flex-1 items-center justify-center ${
                  !variant ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                {added ? (
                  <>
                    <Check size={15} className="mr-2" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} className="mr-2" />
                    Add{variant ? ` · ${fmt(variant.price * qty)}` : ""}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
