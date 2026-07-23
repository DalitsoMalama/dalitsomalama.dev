import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCard } from "@/components/ProjectCard";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getManifesto } from "@/lib/data/content";

export const revalidate = 300;

export default async function HomePage() {
  const [manifesto, featuredProjects] = await Promise.all([
    getManifesto(),
    getFeaturedProjects(3),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <MotionReveal>
        <p className="max-w-2xl text-balance text-2xl font-medium leading-relaxed sm:text-3xl">
          {manifesto}
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/systems"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            View the Systems Lab
          </Link>
          <Link
            href="/ideas"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/50"
          >
            Submit an idea
          </Link>
        </div>
      </MotionReveal>

      {featuredProjects.length > 0 && (
        <section className="mt-20">
          <MotionReveal>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
              Highlight reel
            </h2>
          </MotionReveal>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <MotionReveal key={project.id} delay={index * 0.08}>
                <ProjectCard project={project} />
              </MotionReveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
