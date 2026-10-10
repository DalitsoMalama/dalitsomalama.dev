import type { Metadata } from "next";
import { MotionReveal } from "@/components/MotionReveal";
import { SystemsGrid } from "@/components/SystemsGrid";
import { getPublishedProjects } from "@/lib/data/projects";

export const revalidate = 300;

export const metadata: Metadata = { title: "Systems Lab" };

export default async function SystemsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-20">
      <MotionReveal>
        <p className="eyebrow">Systems Lab · {projects.length} case studies</p>
        <h1 className="display mt-5 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)]">
          Things I&apos;ve built <em>and shipped.</em>
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
          Each one started as a manual process someone was tired of. Here is what it was, what I built, and
          what changed.
        </p>
      </MotionReveal>

      <div className="mt-14">
        {projects.length > 0 ? (
          <SystemsGrid projects={projects} />
        ) : (
          <p className="text-muted">No published projects yet — check back soon.</p>
        )}
      </div>
    </div>
  );
}
