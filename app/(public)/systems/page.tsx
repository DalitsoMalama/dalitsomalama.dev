import type { Metadata } from "next";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCard } from "@/components/ProjectCard";
import { getPublishedProjects } from "@/lib/data/projects";

export const revalidate = 300;

export const metadata: Metadata = { title: "Systems Lab" };

export default async function SystemsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <MotionReveal>
        <h1 className="text-2xl font-medium">Systems Lab</h1>
        <p className="mt-2 max-w-xl text-muted">
          Case studies of things I&apos;ve actually built and shipped.
        </p>
      </MotionReveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <MotionReveal key={project.id} delay={index * 0.05}>
            <ProjectCard project={project} />
          </MotionReveal>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="mt-10 text-muted">No published projects yet — check back soon.</p>
      )}
    </div>
  );
}
