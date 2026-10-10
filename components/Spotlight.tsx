"use client";

import { useRef, type ReactNode } from "react";

/**
 * A card surface that glows where the pointer is: a soft fill inside and a
 * brighter rim on the border. Position is written to CSS variables directly,
 * so hovering never re-renders React.
 */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el || event.pointerType !== "mouse") return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--sy", `${event.clientY - rect.top}px`);
      }}
      className={`group/spot relative ${className}`}
    >
      {/* rim: a masked gradient border that lights near the pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          padding: 1,
          background:
            "radial-gradient(260px circle at var(--sx, 50%) var(--sy, 50%), var(--accent), transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* fill */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: "radial-gradient(420px circle at var(--sx, 50%) var(--sy, 50%), var(--glow), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
