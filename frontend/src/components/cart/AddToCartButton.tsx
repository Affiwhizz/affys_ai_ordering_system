"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "./CartContext";

interface AddToCartButtonProps {
  itemId: string;
  name: string;
  variant?: string;
  price: number;
  channel?: "normal" | "portimao";
  thumbnail?: { initial: string; gradient: string };
  /** Button label override. Default: "Add to order" / "Add to cart". */
  label?: string;
  className?: string;
  /** Smaller variant for compact menu cards. */
  size?: "md" | "sm";
}

/**
 * Client-side "Add to cart" button. Use anywhere a dish/bowl is shown.
 * Briefly shows a "✓ Added" confirmation; the actual cart pulse is driven
 * by the CartIcon in the header (via the pulseSeed in context).
 */
export default function AddToCartButton({
  itemId,
  name,
  variant,
  price,
  channel = "normal",
  thumbnail,
  label,
  className = "",
  size = "md",
}: AddToCartButtonProps) {
  const { add, orderingPaused, resumeDate } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const paused = orderingPaused && channel === "normal";

  const handleAdd = () => {
    if (paused) return;
    add({ itemId, name, variant, price, channel, thumbnail });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const base =
    size === "sm"
      ? "h-9 text-xs"
      : "h-11 text-sm";

  if (paused) {
    const resume = resumeDate
      ? new Date(`${resumeDate}T00:00:00`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
        })
      : null;
    return (
      <button
        type="button"
        disabled
        title={
          resume
            ? `Ordering paused — we're back ${resume}`
            : "Ordering paused — back soon"
        }
        className={`inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-border bg-cream/60 font-semibold text-foreground-muted ${base} ${className}`}
      >
        {resume ? `Paused · back ${resume}` : "Ordering paused"}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleAdd}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border font-semibold transition-colors ${base} ${
        justAdded
          ? "border-forest bg-forest text-ivory"
          : "border-border bg-cream text-espresso hover:bg-espresso hover:text-ivory hover:border-espresso"
      } ${className}`}
    >
      {justAdded ? (
        <>
          <Check size={size === "sm" ? 12 : 14} strokeWidth={2.4} />
          Added
        </>
      ) : (
        <>
          {label ?? "Add to order"}
          <Plus size={size === "sm" ? 12 : 14} strokeWidth={2.4} />
        </>
      )}
    </motion.button>
  );
}
