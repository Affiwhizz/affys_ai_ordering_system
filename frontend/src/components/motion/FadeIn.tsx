"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileInView" | "viewport" | "transition"> {
  children: ReactNode;
  /** Delay before this element animates in, seconds. */
  delay?: number;
  /** Duration of the entry animation, seconds. */
  duration?: number;
  /** Y offset (px) the element travels upward as it fades in. */
  y?: number;
  /** Trigger only the first time the element enters the viewport. */
  once?: boolean;
}

/**
 * Wrap any block to give it a soft fade-up reveal when it scrolls into view.
 * Use this everywhere, paragraphs, cards, buttons, badges. Cheap and elegant.
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  y = 16,
  once = true,
  ...rest
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
