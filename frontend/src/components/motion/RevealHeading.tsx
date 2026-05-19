"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Animates each "token" of a heading into view with a smooth, staggered y-rise.
 * Tokens can be plain strings (split on whitespace into words) or JSX nodes
 * (e.g. <span className="italic gold-shimmer">home</span>) which animate as a unit.
 *
 * Usage:
 *   <RevealHeading
 *     tokens={["A taste of", <span key="h" className="italic">home,</span>, "served with care."]}
 *     className="font-display text-6xl"
 *   />
 *
 * For pure-text headings, just pass a string:
 *   <RevealHeading tokens="Plates that tell stories." />
 */

interface RevealHeadingProps {
  tokens: string | ReactNode[];
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  className?: string;
  /** Delay before the first word animates, seconds. */
  delay?: number;
  /** Stagger between successive tokens, seconds. */
  stagger?: number;
}

const container: Variants = {
  hidden: {},
  visible: ({ stagger, delay }: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: stagger, delayChildren: delay },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function RevealHeading({
  tokens,
  as = "h2",
  className = "",
  delay = 0,
  stagger = 0.07,
}: RevealHeadingProps) {
  const items: ReactNode[] = typeof tokens === "string" ? tokens.split(/(\s+)/).filter((w) => w.trim().length > 0) : tokens;
  const Tag = motion[as] as typeof motion.h2;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      custom={{ stagger, delay }}
    >
      {items.map((tok, i) => (
        <motion.span
          key={i}
          variants={word}
          style={{ display: "inline-block", marginRight: i < items.length - 1 ? "0.25em" : 0 }}
        >
          {tok}
        </motion.span>
      ))}
    </Tag>
  );
}
