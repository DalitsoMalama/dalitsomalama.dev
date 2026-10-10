import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Figure, isFigureName } from "@/components/Figure";
import { MotionReveal } from "@/components/MotionReveal";
import { VideoEmbed } from "@/components/VideoEmbed";
import { Demo } from "@/components/demos/Demo";
import { isDemoName } from "@/lib/demos";
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
  const [project, all] = await Promise.all([getProjectBySlug(slug), getPublishedProjects()]);
  if (!project) notFound();

  // The next case study, wrapping round, so a reader always has somewhere to go.
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;

  const demo = isDemoName(project.demo) ? project.demo : null;
  // With no video or screenshot, the demo itself becomes the hero visual.
  const demoAsHero = demo !== null && !project.video_youtube_id && !project.cover_image_url;

  const chapters = [
    { label: "The problem", body: project.problem },
    { label: "What I built", body: project.solution },
    { label: "What changed", body: project.outcome, highlight: true },
  ].filter((c): c is { label: string; body: string; highlight?: boolean } => Boolean(c.body));

  return (
    <article className="pb-8">
      <header className="mx-auto max-w-6xl px-6 pb-12 pt-20">
        <MotionReveal>
          <Link href="/systems" className="eyebrow inline-flex items-center gap-2 hover:text-foreground">
            <span aria-hidden>←</span> Systems Lab
          </Link>
          <h1 className="display mt-8 max-w-5xl text-[clamp(2.5rem,6.5vw,5.5rem)]">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-muted">{project.summary}</p>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <dl className="mt-12 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
            {project.organization && <Fact label="Organisation" value={project.organization} />}
            {project.period && <Fact label="Period" value={project.period} />}
            <div>
              <dt className="eyebrow">Stack</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted">
                    {tech}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </MotionReveal>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        {project.video_youtube_id ? (
          <MotionReveal>
            <VideoEmbed youtubeId={project.video_youtube_id} title={project.title} />
          </MotionReveal>
        ) : project.cover_image_url ? (
          <MotionReveal>
            <Screenshot src={project.cover_image_url} alt={`${project.title} screenshot`} priority />
          </MotionReveal>
        ) : demoAsHero ? (
          <MotionReveal>
            <Demo name={demo} />
          </MotionReveal>
        ) : isFigureName(project.figure) ? (
          <MotionReveal>
            <div className="mx-auto max-w-lg">
              <Figure name={project.figure} label={`${project.title}, as a line drawing`} play />
            </div>
          </MotionReveal>
        ) : null}
      </div>

      <div className="mx-auto mt-20 flex max-w-6xl flex-col gap-16 px-6">
        {chapters.map((chapter, i) => (
          <MotionReveal key={chapter.label}>
            <section className="grid gap-4 md:grid-cols-12">
              <h2 className="eyebrow md:col-span-3 md:pt-2">
                <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> — {chapter.label}
              </h2>
              <p
                className={`whitespace-pre-line text-pretty leading-relaxed md:col-span-8 ${
                  chapter.highlight
                    ? "display text-2xl !leading-snug sm:text-3xl"
                    : "text-lg text-foreground/85"
                }`}
              >
                {chapter.body}
              </p>
            </section>
          </MotionReveal>
        ))}
      </div>

      {demo && !demoAsHero && (
        <div className="mx-auto mt-24 max-w-6xl px-6">
          <MotionReveal>
            <p className="eyebrow">Try it yourself</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">
              The same rules, <em>on generated data.</em>
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-muted">
              The real system runs on a private network, so here is a faithful simulation. Move the controls and
              watch it re-classify every reading.
            </p>
          </MotionReveal>
          <MotionReveal delay={0.06} className="mt-8">
            <Demo name={demo} />
          </MotionReveal>
        </div>
      )}

      {project.gallery_images.length > 0 && (
        <div className="mx-auto mt-20 max-w-6xl px-6">
          <MotionReveal>
            <h2 className="eyebrow">More screenshots</h2>
          </MotionReveal>
          <div className={`mt-6 grid gap-6 ${project.gallery_images.length > 1 ? "md:grid-cols-2" : ""}`}>
            {project.gallery_images.map((src, i) => (
              <MotionReveal key={src} delay={i * 0.06}>
                <Screenshot src={src} alt={`${project.title} screenshot ${i + 2}`} />
              </MotionReveal>
            ))}
          </div>
        </div>
      )}

      {project.note && (
        <div className="mx-auto mt-10 max-w-6xl px-6">
          <p className="max-w-2xl border-l-2 border-border pl-4 text-sm text-muted">{project.note}</p>
        </div>
      )}

      {next && (
        <div className="mx-auto mt-24 max-w-6xl px-6">
          <Link
            href={`/systems/${next.slug}`}
            className="group block border-t border-border pt-10"
          >
            <p className="eyebrow">Next case study</p>
            <p className="display mt-4 flex items-center gap-4 text-[clamp(2rem,5vw,4rem)] transition-colors group-hover:text-accent">
              {next.title}
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-3">→</span>
            </p>
            <p className="mt-3 max-w-xl text-muted">{next.summary}</p>
          </Link>
        </div>
      )}
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 text-sm">{value}</dd>
    </div>
  );
}

function Screenshot({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      preload={priority}
      sizes="(min-width: 1152px) 1104px, 100vw"
      className="h-auto w-full rounded-2xl border border-border shadow-[0_40px_120px_-40px_rgb(0_0_0/0.5)]"
    />
  );
}
