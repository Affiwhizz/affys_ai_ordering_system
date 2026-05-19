"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "./CartContext";
import { FREE_DELIVERY_THRESHOLD, formatEuro } from "./delivery-zones";

/**
 * Slide-in cart drawer (right side). Lists items with qty controls, shows
 * subtotal + free-delivery progress, and a checkout button that opens the
 * Checkout modal.
 */
export default function CartDrawer() {
  const {
    items,
    update,
    remove,
    clear,
    subtotal,
    count,
    drawerOpen,
    closeDrawer,
    openCheckout,
  } = useCart();

  // Lock body scroll while open
  useEffect(() => {
    if (!drawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [drawerOpen]);

  // Close on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const isPortimao = items.some((it) => it.channel === "portimao");

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Your cart"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={closeDrawer}
            className="absolute inset-0 cursor-default bg-espresso/50 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.2 }}
          />

          {/* Panel */}
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-luxe"
            variants={{ hidden: { x: "100%" }, visible: { x: 0 } }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="eyebrow inline-flex items-center">
                  <span className="gold-rule" />
                  Your cart
                  <span className="gold-rule-after" />
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-espresso">
                  {count === 0 ? "Nothing yet" : `${count} item${count === 1 ? "" : "s"}`}
                </h2>
                {isPortimao && (
                  <p className="mt-1 text-[11px] font-mono uppercase tracking-wider text-red">
                    Portimão festival order
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground-muted transition-colors hover:border-espresso hover:bg-espresso hover:text-ivory"
              >
                <X size={14} />
              </button>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-foreground-muted">
                    <ShoppingBag size={22} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-espresso">
                    Your cart is empty
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-foreground-muted">
                    Add a dish from the menu — or jump to Portimão for festival bowls.
                  </p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="btn-gold mt-6"
                  >
                    Browse the menu
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((it) => (
                    <li key={it.id} className="flex gap-4 px-6 py-4">
                      {/* Thumbnail */}
                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                          it.thumbnail?.gradient ?? "from-red via-espresso to-forest"
                        }`}
                        aria-hidden
                      >
                        <span className="font-display text-2xl text-gold/85">
                          {it.thumbnail?.initial ?? it.name.charAt(0)}
                        </span>
                      </div>

                      {/* Main */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-display text-base font-semibold leading-tight text-espresso">
                            {it.name}
                          </p>
                          <span className="font-semibold text-espresso whitespace-nowrap">
                            {formatEuro(it.price * it.qty)}
                          </span>
                        </div>
                        {it.variant && (
                          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-foreground-subtle">
                            {it.variant}
                          </p>
                        )}

                        {/* Qty controls + remove */}
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-border bg-cream">
                            <button
                              type="button"
                              onClick={() => update(it.id, it.qty - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-8 w-8 items-center justify-center text-foreground-muted hover:text-espresso"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-espresso">
                              {it.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => update(it.id, it.qty + 1)}
                              aria-label="Increase quantity"
                              className="flex h-8 w-8 items-center justify-center text-foreground-muted hover:text-espresso"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(it.id)}
                            aria-label={`Remove ${it.name}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground-subtle hover:text-red"
                          >
                            <Trash2 size={11} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <footer className="border-t border-border bg-cream/40 p-6">
                {/* Free delivery progress */}
                {!isPortimao && (
                  <div className="mb-4 rounded-xl border border-border bg-white p-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono uppercase tracking-wider text-foreground-muted">
                        {remaining === 0 ? "Free delivery unlocked" : `Free delivery at ${formatEuro(FREE_DELIVERY_THRESHOLD)}`}
                      </span>
                      <span className="font-semibold text-espresso">
                        {remaining === 0 ? "✓" : `${formatEuro(remaining)} to go`}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream-deep">
                      <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                        className="h-full rounded-full bg-gradient-to-r from-red via-gold to-forest"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4 flex items-baseline justify-between text-sm">
                  <span className="text-foreground-muted">Subtotal</span>
                  <span className="font-display text-xl font-semibold text-espresso">
                    {formatEuro(subtotal)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={openCheckout}
                  className="btn-gold w-full"
                >
                  Checkout
                  <span aria-hidden className="ml-2">→</span>
                </button>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={clear}
                    className="text-foreground-subtle underline decoration-gold underline-offset-4 hover:text-espresso"
                  >
                    Clear cart
                  </button>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="text-foreground-subtle hover:text-espresso"
                  >
                    Keep shopping
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
