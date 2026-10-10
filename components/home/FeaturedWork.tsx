import Image from "next/image";
import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";
import { Spotlight } from "@/components/Spotlight";
import type { Project } from "@/lib/types";

/**
 * The featured projects as large alternating rows: the screenshot on one
 * side, the story on the other. Each row is one link, so the whole area is
 * clickable, and the screenshot drifts up slightly on hover.
 */
export function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-8">
      {projects.map((project, index) => (
        <MotionReveal key={project.id} delay={0.05}>
          <Spotlight className="rounded-3xl">
            <Link
              href={`/systems/${project.slug}`}
              className="grid items-center gap-8 overflow-hidden rounded-3xl border border-border bg-surface/70 p-6 backdrop-blur-sm transition-colors hover:bg-surface sm:p-10 lg:grid-cols-12"
            >
              <div className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <p className="eyebrow">
                  {String(index + 1).padStart(2, "0")} · {project.organization}
                </p>
                <h3 className="display mt-4 text-3xl sm:text-4xl">{project.title}</h3>
                <p className="mt-4 text-pretty leading-relaxed text-muted">{project.summary}</p>
                {project.outcome && (
                  <p className="mt-5 border-l-2 border-accent pl-4 text-sm leading-relaxed text-foreground/85">
                    {project.outcome}
                  </p>
                )}
                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {project.tech_stack.map((tech) => (
                    <li key={tech} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted">
                      {tech}
                    </li>
                  ))}
                </ul>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Read the case study
                  <span aria-hidden className="transition-transform duration-300 group-hover/spot:translate-x-1">
                    →
                  </span>
                </span>
              </div>

              <div className={`lg:col-span-7 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                {project.cover_image_url && (
                  <div className="overflow-hidden rounded-xl border border-border shadow-[0_30px_80px_-30px_rgb(0_0_0/0.45)]">
                    <Image
                      src={project.cover_image_url}
                      alt={`${project.title} screenshot`}
                      width={1600}
                      height={900}
                      sizes="(min-width: 1024px) 640px, 100vw"
                      className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/spot:-translate-y-1 group-hover/spot:scale-[1.015]"
                    />
                  </div>
                )}
              </div>
            </Link>
          </Spotlight>
        </MotionReveal>
      ))}
    </div>
  );
}
