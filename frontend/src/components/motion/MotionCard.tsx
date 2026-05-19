"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface MotionCardProps extends Omit<HTMLMotionProps<"div">, "whileHover" | "whileTap" | "transition"> {
  children: ReactNode;
  /** How far the card lifts on hover (px). */
  lift?: number;
  /** Tap scale-down effect (e.g. 0.98). */
  tap?: number;
}

/**
 * Card wrapper with a tactile lift-on-hover and a tiny tap-press.
 * The actual card content (border, image, padding) is user-supplied
 * so this composes cleanly with any existing card markup.
 */
export default function MotionCard({
  children,
  lift = -6,
  tap = 0.99,
  ...rest
}: MotionCardProps) {
  return (
    <motion.div
      whileHover={{ y: lift }}
      whileTap={{ scale: tap }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
