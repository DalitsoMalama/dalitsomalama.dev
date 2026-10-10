"use client";

import { useMemo, useState } from "react";
import { CountUp } from "@/components/CountUp";

/**
 * A playground version of the meter discrepancy system: 2,000 generated
 * meter readings across eight fictional branches, run through the same kinds
 * of rules the real system uses. Moving a threshold re-classifies every
 * reading instantly. No real readings, accounts or branches are used.
 */

type Category = "accepted" | "negative" | "none" | "zero" | "low" | "high";
type Reading = { id: number; branch: string; prev: number | null; curr: number | null };

const BRANCHES = ["Riverside", "Hilltop", "Central", "Industrial", "Northgate", "Lakeview", "Eastfield", "Westbrook"];
const COUNT = 2000;

const CATEGORY: Record<Category, { label: string; color: string; describe: (low: number, high: number) => string }> = {
  accepted: { label: "Accepted", color: "var(--success)", describe: () => "Within the expected range" },
  high: { label: "Too high", color: "var(--danger)", describe: (_, high) => `Above ${high} m³ — leak, tampering or a misread` },
  low: { label: "Too low", color: "var(--warning)", describe: (low) => `Between 0 and ${low} m³ — stuck or slowing meter` },
  zero: { label: "Zero", color: "#a78bfa", describe: () => "No consumption — vacant, or a dead meter" },
  negative: { label: "Negative", color: "#f472b6", describe: () => "Reading went backwards — replaced or misread meter" },
  none: { label: "No reading", color: "var(--muted)", describe: () => "Reader couldn't get a value" },
};
const ORDER: Category[] = ["accepted", "high", "low", "zero", "negative", "none"];

/** Deterministic PRNG, so the server render and the browser agree on every reading. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generate(): Reading[] {
  const rand = mulberry32(2026);
  // Each branch gets its own character: some have older meters, some more vacant plots.
  const profile = BRANCHES.map(() => ({ zero: 0.03 + rand() * 0.09, none: 0.01 + rand() * 0.05, spike: 0.01 + rand() * 0.04 }));
  return Array.from({ length: COUNT }, (_, id) => {
    const b = Math.floor(rand() * BRANCHES.length);
    const p = profile[b];
    const prev = Math.round(800 + rand() * 9000);
    const r = rand();
    let used: number | null;
    if (r < p.none) used = null;
    else if (r < p.none + 0.012) used = -Math.round(5 + rand() * 40);
    else if (r < p.none + 0.012 + p.zero) used = 0;
    else if (r < p.none + 0.012 + p.zero + p.spike) used = Math.round(140 + rand() * 500);
    else if (r < p.none + 0.012 + p.zero + p.spike + 0.07) used = Math.round((0.2 + rand() * 7) * 10) / 10;
    // Typical household use: a skewed curve around ~20 m³.
    else used = Math.round(Math.exp(2.6 + (rand() + rand() + rand() - 1.5) * 0.9) * 10) / 10;
    return { id, branch: BRANCHES[b], prev, curr: used === null ? null : Math.round((prev + used) * 10) / 10 };
  });
}

const READINGS = generate();

function classify(r: Reading, low: number, high: number, zeroIsFault: boolean): Category {
  if (r.curr === null || r.prev === null) return "none";
  const used = r.curr - r.prev;
  if (used < 0) return "negative";
  if (used === 0) return zeroIsFault ? "zero" : "accepted";
  if (used < low) return "low";
  if (used > high) return "high";
  return "accepted";
}

export function MeterDiscrepancy() {
  const [low, setLow] = useState(5);
  const [high, setHigh] = useState(150);
  const [zeroIsFault, setZeroIsFault] = useState(true);

  const result = useMemo(() => {
    const counts = Object.fromEntries(ORDER.map((c) => [c, 0])) as Record<Category, number>;
    const byBranch = new Map(BRANCHES.map((b) => [b, { total: 0, flagged: 0 }]));
    const flagged: { r: Reading; c: Category }[] = [];
    for (const r of READINGS) {
      const c = classify(r, low, high, zeroIsFault);
      counts[c] += 1;
      const branch = byBranch.get(r.branch)!;
      branch.total += 1;
      if (c !== "accepted") {
        branch.flagged += 1;
        if (flagged.length < 7 && r.id % 3 === 0) flagged.push({ r, c });
      }
    }
    const branches = BRANCHES.map((name) => {
      const b = byBranch.get(name)!;
      return { name, pct: (b.flagged / b.total) * 100 };
    });
    const worstBranch = branches.reduce((a, b) => (b.pct > a.pct ? b : a));
    return { counts, branches, flagged, worstBranch, flaggedTotal: COUNT - counts.accepted };
  }, [low, high, zeroIsFault]);

  const maxPct = Math.max(30, ...result.branches.map((b) => b.pct));
  const acceptedPct = (result.counts.accepted / COUNT) * 100;

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
      {/* rules */}
      <div className="grid gap-6 md:grid-cols-3">
        <Slider
          label="Too low below"
          value={low}
          min={0.5}
          max={15}
          step={0.5}
          unit="m³"
          onChange={setLow}
          color="var(--warning)"
        />
        <Slider
          label="Too high above"
          value={high}
          min={40}
          max={400}
          step={5}
          unit="m³"
          onChange={setHigh}
          color="var(--danger)"
        />
        <label className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
          <input
            type="checkbox"
            checked={zeroIsFault}
            onChange={(e) => setZeroIsFault(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
          />
          <span>
            <span className="font-medium">Flag zero consumption</span>
            <span className="mt-1 block text-xs text-muted">Off if vacant plots on a fixed charge are expected.</span>
          </span>
        </label>
      </div>

      {/* headline numbers */}
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        <Stat label="Readings processed" value={COUNT.toLocaleString("en-US")} countUp />
        <Stat label="Accepted" value={`${acceptedPct.toFixed(1)}%`} tone="text-success" />
        <Stat label="Flagged for review" value={result.flaggedTotal.toLocaleString("en-US")} tone="text-warning" />
        <Stat label="Most issues" value={result.worstBranch.name} hint={`${result.worstBranch.pct.toFixed(1)}% flagged`} />
      </dl>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        {/* per-branch discrepancy */}
        <div>
          <p className="eyebrow">Discrepancy % by branch</p>
          <div className="mt-4 flex h-48 items-end gap-2 sm:gap-3" role="img" aria-label="Bar chart of the share of flagged readings in each branch">
            {result.branches.map((b) => {
              const worstOne = b.name === result.worstBranch.name;
              return (
                <div key={b.name} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                  <span className="font-mono text-[10px] tabular-nums text-muted">{b.pct.toFixed(0)}%</span>
                  <div
                    className={`w-full rounded-t-md transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${worstOne ? "bg-accent" : "bg-foreground/20"}`}
                    style={{ height: `${(b.pct / maxPct) * 100}%` }}
                  />
                  <span className="w-full truncate text-center text-[10px] text-muted sm:text-xs">{b.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* category breakdown */}
        <div>
          <p className="eyebrow">Why readings were flagged</p>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-surface-hover">
            {ORDER.map((c) => (
              <div
                key={c}
                className="h-full transition-[width] duration-500"
                style={{ width: `${(result.counts[c] / COUNT) * 100}%`, background: CATEGORY[c].color }}
              />
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {ORDER.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CATEGORY[c].color }} />
                <span className="flex-1">
                  {CATEGORY[c].label}
                  <span className="ml-2 hidden text-xs text-muted sm:inline">{CATEGORY[c].describe(low, high)}</span>
                </span>
                <span className="font-mono tabular-nums text-muted">{result.counts[c].toLocaleString("en-US")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* a few flagged rows, like the real report */}
      <div className="mt-8 overflow-x-auto">
        <p className="eyebrow">Sample of flagged readings</p>
        <table className="mt-3 w-full min-w-[520px] text-left text-sm">
          <thead className="font-mono text-[11px] uppercase tracking-wider text-muted">
            <tr className="border-b border-border">
              <th className="py-2 font-normal">Account</th>
              <th className="py-2 font-normal">Branch</th>
              <th className="py-2 text-right font-normal">Previous → current</th>
              <th className="py-2 text-right font-normal">Used</th>
              <th className="py-2 pl-4 font-normal">Flag</th>
            </tr>
          </thead>
          <tbody>
            {result.flagged.map(({ r, c }) => (
              <tr key={r.id} className="border-b border-border/60">
                <td className="py-2 font-mono text-xs text-muted">DEMO-{String(r.id).padStart(5, "0")}</td>
                <td className="py-2">{r.branch}</td>
                <td className="py-2 text-right font-mono text-xs tabular-nums">
                  {r.prev ?? "—"} → {r.curr ?? "—"}
                </td>
                <td className="py-2 text-right font-mono text-xs tabular-nums">
                  {r.curr === null || r.prev === null ? "—" : (r.curr - r.prev).toFixed(1)}
                </td>
                <td className="py-2 pl-4">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY[c].color }} />
                    {CATEGORY[c].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-muted">
        Generated data: 2,000 readings across eight fictional branches. In production the same kinds of rules run over
        33,000+ real readings every month.
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <label className="block rounded-xl border border-border p-4">
      <span className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono tabular-nums" style={{ color }}>
          {value} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full"
        style={{ accentColor: color }}
      />
    </label>
  );
}

function Stat({
  label,
  value,
  tone,
  hint,
  countUp,
}: {
  label: string;
  value: string;
  tone?: string;
  hint?: string;
  /** Count up on first view; only for fixed values, since a changing value would restart from zero. */
  countUp?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-1 bg-surface p-4 sm:p-5">
      <dt className="text-xs text-muted">
        {label}
        {hint && <span className="block">{hint}</span>}
      </dt>
      <dd className={`text-2xl font-medium tracking-tight tabular-nums ${tone ?? ""}`}>
        {countUp ? <CountUp value={value} /> : value}
      </dd>
    </div>
  );
}
