"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

/**
 * Cart icon for the header. Shows the item count in a red badge and
 * pulses briefly each time an item is added (driven by pulseSeed in
 * the cart context).
 */
export default function CartIcon() {
  const { count, pulseSeed, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      // id used by the flying-item animation in DishDetailModal as the
      // destination target of the "add to cart" zoom effect.
      id="cart-fly-target"
      aria-label={count > 0 ? `Open cart (${count} item${count === 1 ? "" : "s"})` : "Open cart"}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-white text-espresso transition-all hover:border-espresso hover:bg-espresso hover:text-ivory"
    >
      <motion.span
        key={pulseSeed}
        initial={{ scale: 1 }}
        animate={pulseSeed > 0 ? { scale: [1, 1.18, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex"
      >
        <ShoppingBag size={18} strokeWidth={2.2} />
      </motion.span>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="count"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 480, damping: 22 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-forest px-1 text-[10px] font-bold text-ivory leading-none"
            aria-hidden
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
