import type { Metadata } from "next";
import { MotionReveal } from "@/components/MotionReveal";
import { Timeline } from "@/components/Timeline";
import { getCvEntries } from "@/lib/data/content";

export const revalidate = 300;

export const metadata: Metadata = { title: "CV" };

export default async function CvPage() {
  const entries = await getCvEntries();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <MotionReveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-2xl font-medium">CV</h1>
          <a
            href="/api/cv/pdf"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50"
          >
            Download PDF
          </a>
        </div>
      </MotionReveal>

      <div className="mt-10">
        <Timeline entries={entries} />
      </div>
    </div>
  );
}
