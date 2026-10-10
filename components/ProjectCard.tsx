import Link from "next/link";
import Image from "next/image";
import { Figure, isFigureName } from "@/components/Figure";
import { Spotlight } from "@/components/Spotlight";
import { DemoThumbnail } from "@/components/demos/Demo";
import { isDemoName } from "@/lib/demos";
import { shortOrganization } from "@/lib/format";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const thumbnail =
    project.cover_image_url ??
    (project.video_youtube_id
      ? `https://img.youtube.com/vi/${project.video_youtube_id}/hqdefault.jpg`
      : null);

  return (
    <Spotlight className="h-full rounded-2xl">
      <Link
        href={`/systems/${project.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors"
      >
        <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-surface-hover">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt=""
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/spot:scale-[1.04]"
            />
          ) : project.demo === "water-quality" && isDemoName(project.demo) ? (
            <div className="absolute inset-0 p-2">
              <DemoThumbnail name={project.demo} />
            </div>
          ) : isFigureName(project.figure) ? (
            // The figure is 5:4; centre it at full height so it can't stretch the 16:9 box.
            <div className="absolute inset-0 flex justify-center [--hairline-plate:var(--surface-hover)]">
              <div className="aspect-[5/4] h-full">
                <Figure name={project.figure} label={`${project.title}, as a line drawing`} />
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <span className="font-mono text-xs">{project.slug}</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <p className="eyebrow flex items-center justify-between gap-3">
              <span className="truncate">{project.organization && shortOrganization(project.organization)}</span>
              {project.period && <span className="shrink-0 normal-case tracking-normal">{project.period}</span>}
            </p>
            <h3 className="mt-3 text-xl font-medium tracking-tight">
              {project.title}
              <span
                aria-hidden
                className="ml-1.5 inline-block text-accent opacity-0 transition-all duration-300 group-hover/spot:translate-x-1 group-hover/spot:opacity-100"
              >
                →
              </span>
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{project.summary}</p>
          </div>
          <ul className="mt-auto flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech) => (
              <li key={tech} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </Spotlight>
  );
}
