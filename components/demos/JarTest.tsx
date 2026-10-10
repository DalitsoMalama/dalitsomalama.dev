"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Jar Test: the bench experiment treatment operators run to find the
 * coagulant (alum) dose for incoming raw water. Pick a dose, watch rapid
 * mix → slow mix (flocs grow) → settling, then read the settled turbidity.
 * Underdose and the particles never clump; overdose and they restabilise.
 *
 * Every sample is generated — illustrative chemistry, not plant figures.
 */

type Sample = { turbidity: number; ph: number; optimal: number; note: string };
type Verdict = "pin" | "under" | "lean" | "good" | "heavy" | "over";
type Jar = { dose: number; settled: number; ph: number; verdict: Verdict };
type Stage = "idle" | "rapid" | "slow" | "settle" | "done";

const SAMPLES_PER_SHIFT = 5;
const JARS_PER_SAMPLE = 3;
const TARGET_NTU = 5;
const MAX_DOSE = 60;
const FIRST_SEED = 20261010; // fixed so the server render and hydration agree

// Easy → hard across a shift.
const CONDITIONS = [
  { note: "Dry season: the river is running clear", lo: 8, hi: 25 },
  { note: "Steady flow, mid-season", lo: 20, hi: 50 },
  { note: "Early rains: runoff reaching the intake", lo: 40, hi: 90 },
  { note: "Heavy storm upstream overnight", lo: 120, hi: 220 },
  { note: "Flash flood: the intake is running brown", lo: 200, hi: 300 },
];

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeShift(seed: number): Sample[] {
  const rand = mulberry32(seed);
  return CONDITIONS.map(({ note, lo, hi }) => {
    const turbidity = Math.round((lo + rand() * (hi - lo)) * 10) / 10;
    // Dirtier water needs more coagulant; the water's chemistry shifts it ±20%.
    const optimal = (6 + 0.11 * turbidity) * (0.8 + rand() * 0.4);
    return { turbidity, ph: Math.round((6.9 + rand() * 0.8) * 100) / 100, optimal, note };
  });
}

/** Fraction of particles removed at a dose/optimal ratio: a plateau, falling off both sides. */
function efficiency(ratio: number) {
  if (ratio <= 0.3) return 0;
  if (ratio < 0.9) return 0.985 * Math.pow((ratio - 0.3) / 0.6, 1.5);
  if (ratio <= 1.35) return 0.985;
  return Math.max(0.15, 0.985 - (ratio - 1.35) * 1.1); // charge reversal: particles restabilise
}

function runJar(sample: Sample, dose: number): Jar & { efficiency: number } {
  const ratio = dose / sample.optimal;
  const eff = efficiency(ratio);
  const settled = Math.round((sample.turbidity * (1 - eff) + 0.4) * 10) / 10;
  const pass = settled <= TARGET_NTU;
  // Clean water forgives a dose that misses the sweet spot; the hint must match the result.
  const verdict: Verdict =
    ratio < 0.6 ? "pin" : ratio < 0.9 ? (pass ? "lean" : "under") : ratio <= 1.15 ? "good" : ratio <= 1.35 || pass ? "heavy" : "over";
  return {
    dose,
    settled,
    ph: Math.round((sample.ph - 0.018 * dose) * 100) / 100, // alum eats alkalinity
    verdict,
    efficiency: eff,
  };
}

const HINTS: Record<Verdict, string> = {
  pin: "Pin floc: the particles barely clumped and stayed suspended. Dose a lot more.",
  under: "Small, slow-settling flocs. You're close; nudge the dose up.",
  lean: "Clear enough on a lean dose, though the flocs were small. Cheap, but near the edge.",
  good: "Big flocs, clean settle. That's the sweet spot.",
  heavy: "It settled well, but you used more alum than the water needed.",
  over: "Overdosed: the particle charge flipped and they stayed in suspension. Dose less.",
};

/** 100 for a first-jar hit at the right dose; extra jars and wasted alum cost points. */
function scoreSample(sample: Sample, jars: Jar[]) {
  const hit = jars.findIndex((j) => j.settled <= TARGET_NTU);
  if (hit === -1) return 0;
  const waste = Math.max(0, jars[hit].dose / sample.optimal - 1.05) * 110;
  return Math.max(10, Math.round(100 - hit * 20 - waste));
}

function rating(total: number) {
  if (total >= 440) return "Superintendent material.";
  if (total >= 320) return "A solid shift on the bench.";
  if (total >= 180) return "The shift supervisor would like a word.";
  return "Back to the lab manual.";
}

/* ── the jar (canvas) ──────────────────────────────────────────────────── */

const W = 260;
const H = 320;
const JAR = { l: 50, r: 210, top: 34, bottom: 296, water: 78 };
const CX = (JAR.l + JAR.r) / 2;
const HALF = (JAR.r - JAR.l) / 2 - 10;
const T_RAPID = 1.2;
const T_SLOW = 2.6;
const T_SETTLE = 3.4;
const T_FLOC = T_RAPID + T_SLOW;
const T_END = T_FLOC + T_SETTLE;
const SILT = "138, 90, 43";

type Particle = { x: number; y: number; r: number; rho: number; phase: number; spd: number; jit: number; g: number; ox: number; oy: number };
type Floc = { rho: number; phase: number; spd: number; y: number; restY: number; delay: number; fall: number };

const smooth = (a: number, b: number, t: number) => {
  const u = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

/** Paddle angle: fast during rapid mix, slow during flocculation, coasting to a stop to settle. */
function paddleAngle(t: number) {
  if (t < T_RAPID) return 7 * t;
  const a1 = 7 * T_RAPID;
  if (t < T_FLOC) return a1 + 2.2 * (t - T_RAPID);
  return a1 + 2.2 * T_SLOW + 2.2 * 0.7 * (1 - Math.exp(-(t - T_FLOC) / 0.7));
}

function makeParticles(turbidity: number): Particle[] {
  const n = Math.round(Math.min(320, 36 + turbidity * 1.1));
  return Array.from({ length: n }, () => {
    const x = JAR.l + 10 + Math.random() * (JAR.r - JAR.l - 20);
    const rel = (x - CX) / HALF;
    const rho = Math.min(1, Math.max(Math.abs(rel) + 0.02, 0.25 + Math.random() * 0.75));
    return {
      x,
      y: JAR.water + 8 + Math.random() * (JAR.bottom - JAR.water - 16),
      r: 0.9 + Math.random() * 1.3,
      rho,
      // Chosen so the swirl starts exactly where the particle sits.
      phase: Math.acos(Math.max(-1, Math.min(1, rel / rho))) * (Math.random() < 0.5 ? 1 : -1),
      spd: 0.85 + Math.random() * 0.3,
      jit: 0.6 + Math.random() * 0.8,
      g: -1,
      ox: 0,
      oy: 0,
    };
  });
}

function makeFlocs(particles: Particle[], eff: number): Floc[] {
  const count = Math.max(2, Math.round((particles.length * eff) / 10));
  const sludge = 4 + (particles.length * eff) / 28;
  const flocs = Array.from({ length: count }, () => ({
    rho: 0.15 + Math.random() * 0.75,
    phase: Math.random() * Math.PI * 2,
    spd: 0.85 + Math.random() * 0.3,
    y: JAR.water + 20 + Math.random() * (JAR.bottom - JAR.water - 80),
    restY: JAR.bottom - 6 - Math.random() * sludge,
    delay: Math.random() * 0.5,
    // Weak flocs (underdosed) settle slowly — some never reach the bottom in time.
    fall: (0.9 + Math.random() * 1.1) / Math.max(0.35, eff),
  }));
  const members = new Array(count).fill(0);
  for (const p of particles) {
    p.g = Math.random() < eff ? Math.floor(Math.random() * count) : -1;
    if (p.g >= 0) members[p.g]++;
  }
  for (const p of particles) {
    if (p.g < 0) continue;
    const a = Math.random() * Math.PI * 2;
    const rad = Math.sqrt(Math.random()) * (2 + Math.sqrt(members[p.g]) * 1.6);
    p.ox = Math.cos(a) * rad;
    p.oy = Math.sin(a) * rad;
  }
  return flocs;
}

type Colors = { water: string; line: string; fg: string };

function resolveColors(el: HTMLElement): Colors {
  const read = (v: string) => {
    el.style.color = `var(${v})`;
    return getComputedStyle(el).color;
  };
  const colors = { water: read("--water"), line: read("--muted"), fg: read("--foreground") };
  el.style.color = "";
  return colors;
}

type Scene = {
  particles: Particle[];
  flocs: Floc[];
  raw: number;
  residual: number;
  t: number; // seconds into the run; -1 = untouched raw sample
  onStage: ((s: Stage) => void) | null;
  onDone: (() => void) | null;
  stage: Stage;
};

const stageAt = (t: number): Stage => (t < 0 ? "idle" : t < T_RAPID ? "rapid" : t < T_FLOC ? "slow" : t < T_END ? "settle" : "done");

function useJarScene(canvasRef: React.RefObject<HTMLCanvasElement | null>, rootRef: React.RefObject<HTMLElement | null>) {
  const api = useRef<{ load: (turbidity: number) => void; run: (s: Sample, jar: ReturnType<typeof runJar>, onStage: (s: Stage) => void, onDone: () => void) => void }>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !root || !ctx) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene: Scene = { particles: [], flocs: [], raw: 0, residual: 0, t: -1, onStage: null, onDone: null, stage: "idle" };
    let colors = resolveColors(canvas);
    let scale = 1;

    const draw = (now: number) => {
      const { t } = scene;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const A = t < 0 ? 0 : paddleAngle(t);

      const jarPath = new Path2D();
      jarPath.moveTo(JAR.l, JAR.top);
      jarPath.lineTo(JAR.l, JAR.bottom - 16);
      jarPath.quadraticCurveTo(JAR.l, JAR.bottom, JAR.l + 16, JAR.bottom);
      jarPath.lineTo(JAR.r - 16, JAR.bottom);
      jarPath.quadraticCurveTo(JAR.r, JAR.bottom, JAR.r, JAR.bottom - 16);
      jarPath.lineTo(JAR.r, JAR.top);

      // Water body, tinted by however much silt is still suspended.
      ctx.save();
      const inside = new Path2D(jarPath);
      inside.closePath();
      ctx.clip(inside);
      ctx.beginPath();
      ctx.rect(JAR.l, JAR.water, JAR.r - JAR.l, JAR.bottom - JAR.water);
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = colors.water;
      ctx.fill();
      const shown = t <= T_FLOC ? scene.raw : scene.raw + (scene.residual - scene.raw) * smooth(T_FLOC, T_END, t);
      ctx.globalAlpha = 0.72 * (1 - Math.exp(-shown / 90));
      ctx.fillStyle = `rgb(${SILT})`;
      ctx.fill();

      const blend = smooth(0, 0.35, t);
      const k = smooth(T_RAPID, T_FLOC, t);
      for (const p of scene.particles) {
        const jx = reduced ? 0 : Math.sin(now * 0.0011 * p.jit + p.phase) * 1.2;
        const jy = reduced ? 0 : Math.cos(now * 0.0009 * p.jit + p.phase) * 1.2;
        let x = p.x + (CX + p.rho * HALF * Math.cos(A * p.spd + p.phase) - p.x) * blend;
        let y = p.y + Math.sin(A * 0.6 + p.phase) * 5 * blend;
        let r = p.r;
        if (p.g >= 0 && t > T_RAPID) {
          const f = scene.flocs[p.g];
          const u = Math.min(1, Math.max(0, (t - T_FLOC - f.delay) / f.fall));
          const gx = CX + f.rho * HALF * Math.cos(A * f.spd + f.phase) + p.ox;
          const gy = f.y + (f.restY - f.y) * u * u + p.oy * (1 - 0.55 * u * u);
          x += (gx - x) * k;
          y += (gy - y) * k;
          r *= 1 + k * 0.7;
          ctx.globalAlpha = 0.85;
        } else {
          x += jx;
          y += jy;
          ctx.globalAlpha = 0.6;
        }
        ctx.beginPath();
        ctx.arc(x, Math.min(JAR.bottom - 2, y), r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${SILT})`;
        ctx.fill();
      }
      ctx.restore();

      // Meniscus, paddle, glass and graduations.
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = colors.water;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(JAR.l, JAR.water);
      ctx.lineTo(JAR.r, JAR.water);
      ctx.stroke();

      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = colors.fg;
      ctx.beginPath();
      ctx.moveTo(CX, 4);
      ctx.lineTo(CX, JAR.bottom - 64);
      ctx.stroke();
      const blade = Math.max(3, 46 * Math.abs(Math.cos(A)));
      ctx.strokeRect(CX - blade / 2, JAR.bottom - 64, blade, 18);

      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1.5;
      ctx.stroke(jarPath);
      ctx.lineWidth = 1;
      ctx.fillStyle = colors.line;
      ctx.font = "9px ui-monospace, monospace";
      for (let i = 0; i < 5; i++) {
        const y = JAR.water + i * 50;
        ctx.beginPath();
        ctx.moveTo(JAR.r - (i % 2 ? 8 : 14), y);
        ctx.lineTo(JAR.r, y);
        ctx.stroke();
      }
      ctx.fillText("1 L", JAR.r + 6, JAR.water + 3);
    };

    const setStage = (s: Stage) => {
      if (s === scene.stage) return;
      scene.stage = s;
      scene.onStage?.(s);
    };

    const finish = () => {
      scene.t = T_END;
      setStage("done");
      const done = scene.onDone;
      scene.onDone = null;
      done?.();
    };

    // Frame loop runs only while the jar is on screen and the tab is visible.
    let raf = 0;
    let last = 0;
    const frame = (ts: number) => {
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      if (scene.t >= 0 && scene.t < T_END) {
        scene.t = Math.min(T_END, scene.t + dt);
        setStage(stageAt(scene.t));
        if (scene.t >= T_END) finish();
      }
      draw(ts);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && !reduced) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    let visible = false;
    const sync = () => (visible && !document.hidden ? start() : stop());
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", sync);

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(((w * H) / W) * dpr);
      scale = (w * dpr) / W;
      draw(performance.now());
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Theme toggle sets data-theme; the OS scheme can change too.
    const recolor = () => {
      colors = resolveColors(canvas);
      draw(performance.now());
    };
    const mo = new MutationObserver(recolor);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    const scheme = matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", recolor);

    api.current = {
      load(turbidity) {
        scene.particles = makeParticles(turbidity);
        scene.flocs = [];
        scene.raw = scene.residual = turbidity;
        scene.t = -1;
        scene.onDone = null;
        setStage("idle");
        draw(performance.now());
      },
      run(sample, jar, onStage, onDone) {
        scene.particles = makeParticles(sample.turbidity); // a fresh jar of raw water
        scene.flocs = makeFlocs(scene.particles, jar.efficiency);
        scene.raw = sample.turbidity;
        scene.residual = jar.settled;
        scene.onStage = onStage;
        scene.onDone = onDone;
        scene.t = 0;
        if (reduced) finish();
        draw(performance.now());
      },
    };

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      scheme.removeEventListener("change", recolor);
      document.removeEventListener("visibilitychange", sync);
      api.current = null;
    };
  }, [canvasRef, rootRef]);

  return api;
}

/* ── the game ──────────────────────────────────────────────────────────── */

const STAGES: { key: Stage; label: string }[] = [
  { key: "rapid", label: "Rapid mix" },
  { key: "slow", label: "Slow mix" },
  { key: "settle", label: "Settle" },
];

export function JarTest() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = useJarScene(canvasRef, rootRef);

  const [seed, setSeed] = useState(FIRST_SEED);
  const shift = useMemo(() => makeShift(seed), [seed]);
  const [index, setIndex] = useState(0);
  const [jars, setJars] = useState<Jar[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [dose, setDose] = useState(15);
  const [stage, setStage] = useState<Stage>("idle");

  const shiftOver = index >= SAMPLES_PER_SHIFT;
  const sample = shift[Math.min(index, SAMPLES_PER_SHIFT - 1)];
  const running = stage === "rapid" || stage === "slow" || stage === "settle";
  const passed = jars.some((j) => j.settled <= TARGET_NTU);
  const sampleOver = passed || jars.length >= JARS_PER_SAMPLE;
  const total = scores.reduce((a, b) => a + b, 0);
  const latest = jars[jars.length - 1];

  useEffect(() => {
    scene.current?.load(sample.turbidity);
  }, [scene, sample]);

  const run = () => {
    const jar = runJar(sample, dose);
    scene.current?.run(sample, jar, setStage, () => {
      const next = [...jars, { dose: jar.dose, settled: jar.settled, ph: jar.ph, verdict: jar.verdict }];
      setJars(next);
      if (jar.settled <= TARGET_NTU || next.length >= JARS_PER_SAMPLE) setScores((s) => [...s, scoreSample(sample, next)]);
    });
  };

  const nextSample = () => {
    setIndex((i) => i + 1);
    setJars([]);
    setStage("idle");
  };

  const newShift = () => {
    setSeed(Date.now() >>> 0);
    setIndex(0);
    setJars([]);
    setScores([]);
    setDose(15);
    setStage("idle");
  };

  return (
    <div ref={rootRef} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr] [&>*]:min-w-0">
      <div className="flex flex-col items-center rounded-2xl border border-border bg-surface p-4 sm:p-6">
        <canvas
          ref={canvasRef}
          className="aspect-[260/320] w-full max-w-[340px]"
          role="img"
          aria-label={`A one-litre beaker of raw water at ${sample.turbidity} NTU with a stirring paddle.`}
        />
        <ol className="mt-4 flex gap-2" aria-label="Jar test stages">
          {STAGES.map((s) => {
            const active = s.key === stage;
            return (
              <li
                key={s.key}
                className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                  active ? "bg-foreground text-background" : "border border-border text-muted"
                }`}
              >
                {s.label}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-col rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">
              Sample {Math.min(index + 1, SAMPLES_PER_SHIFT)} of {SAMPLES_PER_SHIFT} · generated
            </p>
            <p className="mt-1 text-sm text-muted">{sample.note}</p>
          </div>
          <p className="shrink-0 font-mono text-sm tabular-nums">
            <span className="text-muted">Score </span>
            {total}
          </p>
        </div>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-border border-y border-border">
          {[
            ["Raw turbidity", `${sample.turbidity}`, "NTU"],
            ["Raw pH", sample.ph.toFixed(2), ""],
            ["Target", `≤ ${TARGET_NTU}`, "NTU settled"],
          ].map(([label, value, unit]) => (
            <div key={label} className="px-3 py-3 first:pl-0">
              <dt className="font-mono text-[11px] text-muted">{label}</dt>
              <dd className="mt-1 font-mono text-lg tabular-nums">
                {value}
                {unit && <span className="ml-1 text-[11px] text-muted">{unit}</span>}
              </dd>
            </div>
          ))}
        </dl>

        {shiftOver ? (
          <div className="mt-6">
            <p className="eyebrow">Shift report</p>
            <p className="display mt-3 text-4xl">
              {total} <em>/ {SAMPLES_PER_SHIFT * 100}</em>
            </p>
            <p className="mt-2 text-muted">{rating(total)}</p>
            <ul className="mt-4 space-y-1 font-mono text-xs">
              {shift.map((s, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="text-muted">
                    {s.turbidity} NTU · best dose ≈ {Math.round(s.optimal)}–{Math.round(s.optimal * 1.15)} mg/L
                  </span>
                  <span className={scores[i] ? "text-success" : "text-danger"}>{scores[i]} pts</span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={newShift} className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm text-background">
              Start a new shift
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <label htmlFor="jar-dose" className="text-sm font-medium">
                  Alum dose
                </label>
                <span className="font-mono text-xl tabular-nums">
                  {dose}
                  <span className="ml-1 text-xs text-muted">mg/L</span>
                </span>
              </div>
              <input
                id="jar-dose"
                type="range"
                min={0}
                max={MAX_DOSE}
                step={1}
                value={dose}
                disabled={running || sampleOver}
                onChange={(e) => setDose(Number(e.target.value))}
                className="mt-3 w-full accent-[var(--accent)] disabled:opacity-50"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
                <span>0</span>
                <span>{MAX_DOSE} mg/L</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {sampleOver ? (
                <button type="button" onClick={nextSample} className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background">
                  {index + 1 < SAMPLES_PER_SHIFT ? "Next sample →" : "See shift report"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={run}
                  disabled={running}
                  className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background disabled:opacity-50"
                >
                  {running ? "Running…" : `Run jar ${jars.length + 1} of ${JARS_PER_SAMPLE}`}
                </button>
              )}
              {sampleOver && (
                <span className={`text-sm font-medium ${passed ? "text-success" : "text-danger"}`}>
                  {passed ? `+${scores[index]} points` : "Out of jars: no points"}
                </span>
              )}
            </div>

            <div className="mt-6 min-h-[8.5rem]" aria-live="polite">
              <p className="eyebrow">Bench log</p>
              {latest && !running ? (
                <>
                  <p className="mt-2 text-sm">{HINTS[latest.verdict]}</p>
                  <ul className="mt-3 space-y-1.5 font-mono text-xs">
                    {jars.map((j, i) => (
                      <li key={i} className="flex flex-wrap gap-x-3">
                        <span className="text-muted">Jar {i + 1}</span>
                        <span>{j.dose} mg/L</span>
                        <span className={j.settled <= TARGET_NTU ? "text-success" : "text-danger"}>{j.settled} NTU</span>
                        <span className="text-muted">pH {j.ph.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-2 font-mono text-xs text-muted">
                  {running
                    ? "Stirring…"
                    : "Pick a dose and run a jar. Dirtier water needs more coagulant, but too much backfires."}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
