"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * A simulation of the ESP32 water-quality monitor: three probes in a body of
 * water (pH, turbidity, ammonia), each sample travelling up its cable to the
 * ESP32, then over Wi-Fi to a live dashboard with thresholds and alerts.
 *
 * All readings are generated. Left alone it loops a story — normal water,
 * a runoff event, alerts, treatment, recovery; the buttons take over.
 * `compact` renders just the scene with a value strip, for project cards.
 */

type Metric = "ph" | "turb" | "nh3";
type Level = "safe" | "watch" | "alert";
type Readings = Record<Metric, number>;
type LogEntry = { id: number; time: string; text: string; level: Level };

const TICK_MS = 1000;
const HISTORY = 40;
const CLEAN: Readings = { ph: 7.2, turb: 2.4, nh3: 0.18 };
const POLLUTED: Readings = { ph: 6.05, turb: 34, nh3: 2.6 };
// Auto story, in ticks: clean until RUNOFF, polluted until TREAT, then recover; loops at LOOP.
const RUNOFF = 9;
const TREAT = 21;
const LOOP = 36;

const METRICS: { key: Metric; name: string; unit: string; digits: number; range: string }[] = [
  { key: "ph", name: "pH", unit: "", digits: 2, range: "safe 6.5–8.5" },
  { key: "turb", name: "Turbidity", unit: "NTU", digits: 1, range: "safe ≤ 5 NTU" },
  { key: "nh3", name: "Ammonia", unit: "mg/L", digits: 2, range: "safe ≤ 0.5 mg/L" },
];

// Illustrative bands based on common drinking-water guidance.
function levelOf(metric: Metric, v: number): Level {
  if (metric === "ph") return v >= 6.5 && v <= 8.5 ? "safe" : v >= 6.0 && v <= 9.0 ? "watch" : "alert";
  if (metric === "turb") return v <= 5 ? "safe" : v <= 10 ? "watch" : "alert";
  return v <= 0.5 ? "safe" : v <= 1.5 ? "watch" : "alert";
}

const worst = (levels: Level[]): Level =>
  levels.includes("alert") ? "alert" : levels.includes("watch") ? "watch" : "safe";

const LEVEL_STYLE: Record<Level, { text: string; chip: string; label: string }> = {
  safe: { text: "text-success", chip: "bg-success/15 text-success", label: "Safe" },
  watch: { text: "text-warning", chip: "bg-warning/15 text-warning", label: "Watch" },
  alert: { text: "text-danger", chip: "bg-danger/15 text-danger", label: "Alert" },
};

const LEVEL_COLOR: Record<Level, string> = { safe: "var(--success)", watch: "var(--warning)", alert: "var(--danger)" };

const noise = (scale: number) => (Math.random() - 0.5) * 2 * scale;

function step(current: Readings, target: Readings): Readings {
  return {
    ph: Math.min(14, Math.max(0, current.ph + (target.ph - current.ph) * 0.2 + noise(0.03))),
    turb: Math.max(0.2, current.turb + (target.turb - current.turb) * 0.22 + noise(0.25 + current.turb * 0.03)),
    nh3: Math.max(0, current.nh3 + (target.nh3 - current.nh3) * 0.18 + noise(0.015 + current.nh3 * 0.02)),
  };
}

const clock = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

function useWaterSim(rootRef: React.RefObject<HTMLElement | null>) {
  const [readings, setReadings] = useState<Readings>(CLEAN);
  const [history, setHistory] = useState<Record<Metric, number[]>>({ ph: [CLEAN.ph], turb: [CLEAN.turb], nh3: [CLEAN.nh3] });
  const [tick, setTick] = useState(0);
  const [auto, setAuto] = useState(true);
  const [target, setTarget] = useState<Readings>(CLEAN);
  const [log, setLog] = useState<LogEntry[]>([]);
  const levelsRef = useRef<Record<Metric, Level>>({ ph: "safe", turb: "safe", nh3: "safe" });
  const logId = useRef(0);
  const stateRef = useRef({ readings: CLEAN, target: CLEAN, auto: true, tick: 0 });

  useEffect(() => {
    stateRef.current.target = target;
    stateRef.current.auto = auto;
  }, [target, auto]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let timer: ReturnType<typeof setInterval> | null = null;

    const run = () => {
      const s = stateRef.current;
      s.tick += 1;
      let goal = s.target;
      if (s.auto) {
        const phase = s.tick % LOOP;
        if (phase === RUNOFF) goal = POLLUTED;
        else if (phase === TREAT || phase === 0) goal = CLEAN;
        if (goal !== s.target) {
          s.target = goal;
          setTarget(goal);
        }
      }
      const next = step(s.readings, goal);
      s.readings = next;
      setReadings(next);
      setTick(s.tick);
      setHistory((h) => ({
        ph: [...h.ph, next.ph].slice(-HISTORY),
        turb: [...h.turb, next.turb].slice(-HISTORY),
        nh3: [...h.nh3, next.nh3].slice(-HISTORY),
      }));

      // Log only transitions between levels, like a real alerting system.
      const entries: LogEntry[] = [];
      for (const m of METRICS) {
        const level = levelOf(m.key, next[m.key]);
        if (level !== levelsRef.current[m.key]) {
          const value = `${next[m.key].toFixed(m.digits)}${m.unit ? ` ${m.unit}` : ""}`;
          const text =
            level === "safe"
              ? `${m.name} back to safe at ${value}`
              : `${m.name} ${value} — ${level === "alert" ? "out of range" : "approaching the limit"}`;
          entries.push({ id: ++logId.current, time: clock(), text, level });
          levelsRef.current[m.key] = level;
        }
      }
      if (entries.length) setLog((l) => [...entries.reverse(), ...l].slice(0, 5));
    };

    const start = () => {
      if (!timer) timer = setInterval(run, TICK_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    // Sample only while visible: offscreen or in a hidden tab, the device "sleeps".
    let visible = false;
    const sync = () => (visible && !document.hidden ? start() : stop());
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [rootRef]);

  const takeOver = (goal: Readings) => {
    stateRef.current.auto = false;
    stateRef.current.target = goal;
    setAuto(false);
    setTarget(goal);
  };

  return {
    readings,
    history,
    tick,
    auto,
    log,
    polluting: target === POLLUTED,
    runoff: () => takeOver(POLLUTED),
    treat: () => takeOver(CLEAN),
    resumeAuto: () => {
      stateRef.current.tick = 0;
      stateRef.current.auto = true;
      stateRef.current.target = CLEAN;
      setTarget(CLEAN);
      setAuto(true);
    },
  };
}

/* ── the scene ─────────────────────────────────────────────────────────── */

const PROBES: { metric: Metric; x: number; pin: number; label: string }[] = [
  { metric: "ph", x: 110, pin: 252, label: "pH" },
  { metric: "turb", x: 280, pin: 280, label: "TURBIDITY" },
  { metric: "nh3", x: 450, pin: 308, label: "NH₃" },
];
const WATER_TOP = 205;

// A long repeating wave (period 120) slid left forever; clipped to the tank.
const WAVE = (() => {
  let d = `M -40 ${WATER_TOP}`;
  for (let i = 0; i < 13; i++) d += ` q 30 ${i % 2 ? 7 : -7} 60 0`;
  return `${d} L 720 420 L -40 420 Z`;
})();

// Fixed pseudo-random sediment positions, so server and client agree.
const SEDIMENT = Array.from({ length: 44 }, (_, i) => ({
  x: 40 + ((i * 97) % 480),
  y: WATER_TOP + 20 + ((i * 53) % 165),
  r: 1.2 + ((i * 7) % 5) * 0.45,
  delay: (i % 9) * 0.45,
  dur: 4 + (i % 5),
}));

function Scene({ readings, tick, compact }: { readings: Readings; tick: number; compact: boolean }) {
  // Unique per instance: the demo can appear on a card and on its case study at once.
  const clipId = `wq-tank-${useId().replace(/:/g, "")}`;
  const murk = Math.min(1, readings.turb / 34);
  const green = Math.min(1, readings.nh3 / 3);
  const water = `color-mix(in oklab, color-mix(in oklab, var(--water), #8a5a2b ${Math.round(murk * 78)}%), #6b8e23 ${Math.round(green * 35)}%)`;
  const visibleSediment = 4 + Math.round(murk * (SEDIMENT.length - 4));
  const levels = Object.fromEntries(PROBES.map((p) => [p.metric, levelOf(p.metric, readings[p.metric])])) as Record<Metric, Level>;

  return (
    <svg viewBox="0 0 560 420" className="h-full w-full" role="img" aria-label="An ESP32 board with pH, turbidity and ammonia probes dipped in water, sending each reading over Wi-Fi.">
      <defs>
        <clipPath id={clipId}>
          <rect x="20" y="150" width="520" height="255" rx="18" />
        </clipPath>
      </defs>

      {/* tank */}
      <rect x="20" y="150" width="520" height="255" rx="18" fill="var(--surface)" stroke="var(--border)" />
      <g clipPath={`url(#${clipId})`}>
        <path d={WAVE} fill={water} fillOpacity={0.28 + murk * 0.35} stroke={water} strokeWidth="1.5" className="[animation:wq-wave_7s_linear_infinite]" />
        {SEDIMENT.slice(0, visibleSediment).map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#8a5a2b"
            fillOpacity={0.55}
            style={{ animation: `wq-drift ${s.dur}s ease-in-out ${s.delay}s infinite`, transformBox: "fill-box" }}
          />
        ))}
      </g>

      {/* cables, behind the rail and board; each sample sends a pulse up its cable */}
      {PROBES.map((p) => {
        const d = `M ${p.x} 112 C ${p.x} 70, ${p.pin} 128, ${p.pin} 94`;
        return (
          <g key={p.metric}>
            <path d={d} fill="none" stroke="var(--border)" strokeWidth="2" />
            <path
              key={tick}
              d={d}
              pathLength={100}
              fill="none"
              stroke={LEVEL_COLOR[levels[p.metric]]}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 200"
              strokeDashoffset={-100}
              style={{ animation: "wq-pulse 0.7s ease-in forwards" }}
            />
          </g>
        );
      })}

      {/* mounting rail */}
      <rect x="40" y="104" width="480" height="10" rx="5" fill="var(--surface-hover)" stroke="var(--border)" />

      {/* ESP32 board */}
      <g>
        <rect x="226" y="38" width="108" height="58" rx="7" fill="var(--surface)" stroke="var(--muted)" />
        <rect x="244" y="50" width="40" height="32" rx="3" fill="var(--surface-hover)" stroke="var(--border)" />
        <text x="264" y="70" textAnchor="middle" className="fill-muted font-mono" fontSize="8">ESP32</text>
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={232 + i * 11} y="92" width="4" height="6" fill="var(--muted)" />
        ))}
        <path d="M 304 44 h 10 v 6 h -6 v 6 h 6 v 6 h -10" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
        <circle key={tick} cx="322" cy="80" r="3.5" fill="var(--accent)" style={{ animation: "wq-blink 0.9s ease-out forwards" }} />
      </g>

      {/* Wi-Fi: ripples off the antenna and a packet heading to the dashboard */}
      {[0, 0.4].map((delay) => (
        <circle
          key={`${tick}-${delay}`}
          cx="318"
          cy="44"
          r="14"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          style={{ animation: `wq-ripple 1s ease-out ${delay}s both`, transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
      {!compact && (
        <>
          <path d="M 336 60 C 420 60, 470 30, 556 30" fill="none" stroke="var(--border)" strokeDasharray="3 5" />
          <path
            key={`wifi-${tick}`}
            d="M 336 60 C 420 60, 470 30, 556 30"
            pathLength={100}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 200"
            strokeDashoffset={-100}
            style={{ animation: "wq-pulse 0.7s ease-out 0.35s forwards" }}
          />
          <text x="552" y="20" textAnchor="end" className="fill-muted font-mono" fontSize="9">
            Wi-Fi → dashboard
          </text>
        </>
      )}

      {/* probes */}
      {PROBES.map((p) => {
        const level = levels[p.metric];
        const color = LEVEL_COLOR[level];
        return (
          <g key={p.metric}>
            <text x={p.x + 18} y="140" className="fill-muted font-mono" fontSize="10" letterSpacing="1">
              {p.label}
            </text>
            {compact && (
              <text x={p.x + 18} y="156" fontSize="12" fontWeight="600" style={{ fill: color }} className="font-mono">
                {readings[p.metric].toFixed(p.metric === "turb" ? 1 : 2)}
              </text>
            )}
            {p.metric === "ph" && (
              <>
                <rect x={p.x - 5} y="112" width="10" height="226" rx="5" fill="var(--surface)" stroke="var(--muted)" />
                <circle cx={p.x} cy="346" r="13" fill="var(--surface)" stroke={color} strokeWidth="2" />
                <circle cx={p.x} cy="346" r="6" fill={color} fillOpacity="0.35" />
              </>
            )}
            {p.metric === "turb" && (
              <>
                <rect x={p.x - 16} y="112" width="32" height="200" rx="6" fill="var(--surface)" stroke="var(--muted)" />
                <rect x={p.x - 24} y="300" width="12" height="54" rx="4" fill="var(--surface)" stroke="var(--muted)" />
                <rect x={p.x + 12} y="300" width="12" height="54" rx="4" fill="var(--surface)" stroke="var(--muted)" />
                {/* light beam across the gap: clear water lets it through, sediment scatters it */}
                <line x1={p.x - 12} y1="336" x2={p.x + 12} y2="336" stroke={color} strokeWidth="2.5" strokeOpacity={1 - murk * 0.75} />
                {Array.from({ length: Math.round(murk * 8) }, (_, i) => (
                  <circle key={i} cx={p.x - 9 + ((i * 7) % 18)} cy={326 + ((i * 11) % 20)} r="1.6" fill={color} fillOpacity="0.8" />
                ))}
              </>
            )}
            {p.metric === "nh3" && (
              <>
                <rect x={p.x - 7} y="112" width="14" height="214" rx="7" fill="var(--surface)" stroke="var(--muted)" />
                <rect x={p.x - 12} y="320" width="24" height="30" rx="8" fill="var(--surface)" stroke={color} strokeWidth="2" strokeDasharray="3 2" />
                {green > 0.15 &&
                  [0, 1, 2].map((i) => (
                    <circle
                      key={i}
                      cx={p.x - 6 + i * 6}
                      cy={312 - i * 4}
                      r="2"
                      fill="none"
                      stroke={color}
                      style={{ animation: `wq-drift ${2 + i}s ease-in-out ${i * 0.3}s infinite`, transformBox: "fill-box" }}
                    />
                  ))}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── the dashboard ─────────────────────────────────────────────────────── */

function Sparkline({ values, metric }: { values: number[]; metric: Metric }) {
  const w = 120;
  const h = 34;
  const scale: Record<Metric, [number, number]> = { ph: [5.5, 8.5], turb: [0, 40], nh3: [0, 3] };
  const [lo, hi] = scale[metric];
  const y = (v: number) => h - ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * h;
  const points = values.map((v, i) => `${(i / (HISTORY - 1)) * w},${y(v).toFixed(1)}`).join(" ");
  const level = levelOf(metric, values[values.length - 1]);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-28" aria-hidden>
      <polyline points={points} fill="none" stroke={LEVEL_COLOR[level]} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function WaterQuality({ compact = false }: { compact?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sim = useWaterSim(rootRef);
  const levels = METRICS.map((m) => levelOf(m.key, sim.readings[m.key]));
  const overall = worst(levels);

  if (compact) {
    return (
      <div ref={rootRef} className="h-full w-full">
        <Scene readings={sim.readings} tick={sim.tick} compact />
      </div>
    );
  }

  return (
    <div ref={rootRef} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
      <div className="rounded-2xl border border-border bg-surface p-3 sm:p-5">
        <Scene readings={sim.readings} tick={sim.tick} compact={false} />
      </div>

      <div className="flex flex-col rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Live readings</p>
            <p className="mt-1 font-mono text-xs text-muted">ESP32 · WQ-01 · sampling every 1 s</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${LEVEL_STYLE[overall].chip}`}>
            Water {LEVEL_STYLE[overall].label.toLowerCase()}
          </span>
        </div>
        <span className="sr-only" aria-live="polite">
          Overall water status: {LEVEL_STYLE[overall].label}
        </span>

        <ul className="mt-5 divide-y divide-border border-y border-border">
          {METRICS.map((m, i) => {
            const level = levels[i];
            return (
              <li key={m.key} className="flex items-center justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="font-mono text-[11px] text-muted">{m.range}</p>
                </div>
                <Sparkline values={sim.history[m.key]} metric={m.key} />
                <div className="w-24 text-right">
                  <p className={`font-mono text-xl tabular-nums ${LEVEL_STYLE[level].text}`}>
                    {sim.readings[m.key].toFixed(m.digits)}
                    {m.unit && <span className="ml-1 text-xs text-muted">{m.unit}</span>}
                  </p>
                  <p className={`text-[11px] font-medium ${LEVEL_STYLE[level].text}`}>{LEVEL_STYLE[level].label}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={sim.runoff}
            disabled={sim.polluting && !sim.auto}
            className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-danger/60 hover:text-danger disabled:opacity-50"
          >
            Simulate runoff
          </button>
          <button
            type="button"
            onClick={sim.treat}
            disabled={!sim.polluting && !sim.auto}
            className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-success/60 hover:text-success disabled:opacity-50"
          >
            Treat water
          </button>
          <button
            type="button"
            onClick={sim.resumeAuto}
            aria-pressed={sim.auto}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              sim.auto ? "bg-foreground text-background" : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {sim.auto ? "Auto demo on" : "Resume auto demo"}
          </button>
        </div>

        <div className="mt-5 min-h-[7.5rem]">
          <p className="eyebrow">Event log</p>
          {sim.log.length === 0 ? (
            <p className="mt-2 font-mono text-xs text-muted">All readings within range.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {sim.log.map((entry) => (
                <li key={entry.id} className="flex gap-3 font-mono text-xs">
                  <span className="text-muted">{entry.time}</span>
                  <span className={LEVEL_STYLE[entry.level].text}>{entry.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
