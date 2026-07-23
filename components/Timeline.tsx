import { MotionReveal } from "@/components/MotionReveal";
import type { CvEntry } from "@/lib/types";

function formatMonth(value: string | null): string {
  if (!value) return "Present";
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function Timeline({ entries }: { entries: CvEntry[] }) {
  return (
    <ol className="flex flex-col gap-8 border-l border-border pl-6">
      {entries.map((entry, index) => (
        <MotionReveal key={`${entry.organization}-${entry.start_date}`} delay={index * 0.05}>
          <li className="relative">
            <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
            <p className="font-mono text-xs text-muted">
              {formatMonth(entry.start_date)} — {formatMonth(entry.end_date)}
            </p>
            <h3 className="mt-1 font-medium">{entry.role}</h3>
            <p className="text-sm text-muted">{entry.organization}</p>
            <p className="mt-2 text-sm text-foreground/90">{entry.summary}</p>
            {entry.highlights.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
          </li>
        </MotionReveal>
      ))}
    </ol>
  );
}
