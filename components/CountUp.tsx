"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Renders a string like "81,000+" or "<50% → 80%+" and, the first time it
 * scrolls into view, counts every number in it up from zero. The final text is
 * in the markup from the start, so it reads correctly without JavaScript.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const parts = value.split(/(\d[\d,]*)/);
    const targets = parts.map((part) => (/^\d/.test(part) ? Number(part.replace(/,/g, "")) : null));
    if (targets.every((t) => t === null)) return;

    const controls = animate(0, 1, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (progress) => {
        el.textContent = parts
          .map((part, i) => {
            const target = targets[i];
            return target === null ? part : Math.round(target * progress).toLocaleString("en-US");
          })
          .join("");
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {value}
    </span>
  );
}
