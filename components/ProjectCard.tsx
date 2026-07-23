import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const thumbnail =
    project.cover_image_url ??
    (project.video_youtube_id
      ? `https://img.youtube.com/vi/${project.video_youtube_id}/hqdefault.jpg`
      : null);

  return (
    <Link
      href={`/systems/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-accent/50 hover:bg-surface-hover"
    >
      <div className="relative aspect-video w-full bg-surface-hover">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(min-width: 768px) 400px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <span className="font-mono text-xs">{project.slug}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-medium text-foreground group-hover:text-accent">{project.title}</h3>
          <p className="mt-1 text-sm text-muted">{project.summary}</p>
        </div>
        <ul className="mt-auto flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
