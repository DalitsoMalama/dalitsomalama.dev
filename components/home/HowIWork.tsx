import { Hub, Loupe, Plot } from "@lucasmarkes/hairline/react";
import { MotionReveal } from "@/components/MotionReveal";
import { Spotlight } from "@/components/Spotlight";

// The method, in Dalitso's own words from their job applications.
const STEPS = [
  {
    title: "Find the recurring problem",
    body: "Sit with the people doing the work. The best automation targets are the tasks someone repeats every month in Excel, by email or on paper.",
    Figure: Loupe,
    label: "A loupe passing over a ruled sheet, looking for the problem.",
  },
  {
    title: "Put it in front of the people who can fix it",
    body: "Dashboards, maps and reports that land with the billing officer, the field team or the auditor — the person who can act, at the moment they can act.",
    Figure: Hub,
    label: "A hub linked to eight tiles; the one under the pointer rises as its link turns solid.",
  },
  {
    title: "Measure the result",
    body: "Ship, then watch the numbers that matter move: readings validated, complaints resolved, hours of manual work removed.",
    Figure: Plot,
    label: "A bar chart whose tabs lift as the pointer brushes them.",
  },
];

export function HowIWork() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {STEPS.map(({ title, body, Figure, label }, index) => (
        <MotionReveal key={title} delay={index * 0.08} className="h-full">
          <Spotlight className="h-full rounded-2xl">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 [--hairline-plate:var(--surface)]">
              <div className="mx-auto w-full max-w-[260px]">
                <Figure label={label} />
              </div>
              <p className="eyebrow mt-4">Step {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-xl font-medium tracking-tight">{title}</h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">{body}</p>
            </div>
          </Spotlight>
        </MotionReveal>
      ))}
    </div>
  );
}
