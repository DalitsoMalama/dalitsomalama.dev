"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's signature: hundreds of short strokes drifting left to right
 * through a slowly changing current, like water through a network. Near the
 * pointer they part around it and light up in the accent colour.
 *
 * Plain canvas 2D, no dependencies. It sleeps when scrolled out of view or
 * when the tab is hidden, and draws a single still frame under reduced motion.
 */

type Particle = { x: number; y: number; px: number; py: number; speed: number; lit: number };

const REPEL_RADIUS = 150;

export function FlowField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const probe = probeRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !probe || !ctx) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let ink = "rgb(127 127 127)";
    let accent = "rgb(52 211 153)";
    const pointer = { x: -9999, y: -9999, active: false };

    // Custom properties hold unresolved light-dark(...) text; resolving them
    // through a real element's computed colour gives the current theme's value.
    const readColors = () => {
      probe.style.color = "var(--foreground)";
      ink = getComputedStyle(probe).color;
      probe.style.color = "var(--accent)";
      accent = getComputedStyle(probe).color;
    };

    const spawn = (anywhere: boolean): Particle => {
      const x = anywhere ? Math.random() * width : -10 - Math.random() * 40;
      const y = Math.random() * height;
      return { x, y, px: x, py: y, speed: 0.55 + Math.random() * 0.9, lit: 0 };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with area, capped so phones stay smooth.
      const count = Math.min(900, Math.round((width * height) / 1100));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    let t = 0;
    const step = () => {
      t += 1;
      // Fade the previous frame instead of clearing it: that's what draws the trails.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.075)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      const calm = new Path2D();
      const lit = new Path2D();

      for (const p of particles) {
        // The current: mostly rightward, bending with two slow sine waves.
        const angle =
          Math.sin(p.y * 0.0042 + t * 0.004) * 0.55 +
          Math.cos(p.x * 0.0031 - t * 0.003) * 0.35;
        let vx = Math.cos(angle) * p.speed;
        let vy = Math.sin(angle) * p.speed;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < REPEL_RADIUS && d > 0.001) {
            const force = (1 - d / REPEL_RADIUS) ** 2 * 3.2;
            vx += (dx / d) * force;
            vy += (dy / d) * force;
            p.lit = 1;
          }
        }
        p.lit *= 0.965;

        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy;

        if (p.x > width + 10 || p.y < -20 || p.y > height + 20) {
          Object.assign(p, spawn(false));
          continue;
        }
        const path = p.lit > 0.15 ? lit : calm;
        path.moveTo(p.px, p.py);
        path.lineTo(p.x, p.y);
      }

      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.strokeStyle = ink;
      ctx.globalAlpha = 0.22;
      ctx.stroke(calm);
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.9;
      ctx.stroke(lit);
      ctx.globalAlpha = 1;
    };

    let frame = 0;
    let visible = true;
    const loop = () => {
      step();
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    readColors();
    resize();

    if (reduced) {
      for (let i = 0; i < 160; i++) step();
      return;
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.y > -40 && pointer.y < rect.height + 40;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onTheme = () => readColors();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    const scheme = matchMedia("(prefers-color-scheme: dark)");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("themechange", onTheme);
    scheme.addEventListener("change", onTheme);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("themechange", onTheme);
      scheme.removeEventListener("change", onTheme);
    };
  }, []);

  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
      <span ref={probeRef} className="hidden" />
    </div>
  );
}
