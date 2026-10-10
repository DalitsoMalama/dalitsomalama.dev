"use client";

import { useEffect, useRef } from "react";

/**
 * The page's living background: a faint grid fixed behind everything, and a
 * soft accent glow that follows the pointer. The glow position is written to
 * CSS variables on one element, once per animation frame at most, so React
 * never re-renders on pointer moves. Touch devices and reduced motion get the
 * static grid only.
 */
export function Backdrop() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    const finePointer = matchMedia("(pointer: fine)").matches;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        glow.style.setProperty("--x", `${x}px`);
        glow.style.setProperty("--y", `${y}px`);
        glow.style.opacity = "1";
      });
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* grid, fading out toward the bottom so content areas stay calm */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      {/* pointer glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(560px circle at var(--x, 50%) var(--y, 20%), var(--glow), transparent 70%)",
        }}
      />
    </div>
  );
}
