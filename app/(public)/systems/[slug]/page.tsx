import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MotionReveal } from "@/components/MotionReveal";
import { VideoEmbed } from "@/components/VideoEmbed";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/projects";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <MotionReveal>
        <h1 className="text-2xl font-medium">{project.title}</h1>
        <p className="mt-2 text-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </MotionReveal>

      {project.video_youtube_id && (
        <MotionReveal className="mt-10" delay={0.05}>
          <VideoEmbed youtubeId={project.video_youtube_id} title={project.title} />
        </MotionReveal>
      )}

      <div className="mt-10 flex flex-col gap-10">
        {project.problem && (
          <MotionReveal delay={0.1}>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Problem</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed">{project.problem}</p>
          </MotionReveal>
        )}
        {project.solution && (
          <MotionReveal delay={0.15}>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Solution</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed">{project.solution}</p>
          </MotionReveal>
        )}
        {project.outcome && (
          <MotionReveal delay={0.2}>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Outcome</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed">{project.outcome}</p>
          </MotionReveal>
        )}
      </div>
    </div>
  );
}
