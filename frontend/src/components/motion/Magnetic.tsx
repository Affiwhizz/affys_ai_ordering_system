"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  /** 0–1: how strongly the cursor pulls the element. 0.3 = subtle, 0.6 = strong. */
  strength?: number;
  /** Activation radius in pixels around the element's center. */
  range?: number;
  className?: string;
  /** Disable on touch devices to avoid jitter. */
  disableOnTouch?: boolean;
}

/**
 * Magnetic — premium tactile hover effect.
 * The wrapped element follows the cursor smoothly when within `range` px,
 * easing back to center when the cursor leaves. Uses spring physics.
 *
 * Use sparingly — best on a single hero element + primary CTAs, not everywhere.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  range = 140,
  className = "",
  disableOnTouch = true,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (disableOnTouch && typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > range) {
        x.set(0);
        y.set(0);
        return;
      }
      const falloff = 1 - dist / range;
      x.set(dx * strength * falloff);
      y.set(dy * strength * falloff);
    };

    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, range, x, y, disableOnTouch]);

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} className={className}>
      {children}
    </motion.div>
  );
}
