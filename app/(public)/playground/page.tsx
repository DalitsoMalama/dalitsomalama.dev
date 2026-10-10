import type { Metadata } from "next";
import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";
import { Demo } from "@/components/demos/Demo";
import { JarTest } from "@/components/demos/JarTest";
import { getPublishedProjects } from "@/lib/data/projects";
import { isDemoName } from "@/lib/demos";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Playground",
  description: "Hands-on simulations of the systems behind the case studies, running on generated data.",
};

export default async function PlaygroundPage() {
  const projects = (await getPublishedProjects()).filter((p) => isDemoName(p.demo));

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-20">
      <MotionReveal>
        <p className="eyebrow">Playground · {projects.length} live simulations</p>
        <h1 className="display mt-5 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)]">
          Don&apos;t take my word for it. <em>Try the systems.</em>
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          Most of what I build runs inside a company&apos;s private network, so you can&apos;t click through
          the real thing. These are faithful simulations on generated data: same rules, same behaviour, no real
          customers.
        </p>
      </MotionReveal>

      <div className="mt-20 flex flex-col gap-24">
        {projects.map((project, i) =>
          isDemoName(project.demo) ? (
            <section key={project.id} aria-labelledby={`demo-${project.slug}`}>
              <MotionReveal>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div className="max-w-2xl">
                    <p className="eyebrow">
                      <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> · {project.organization}
                    </p>
                    <h2 id={`demo-${project.slug}`} className="display mt-4 text-4xl sm:text-5xl">
                      {project.title}
                    </h2>
                    <p className="mt-4 text-pretty text-muted">{project.summary}</p>
                  </div>
                  <Link
                    href={`/systems/${project.slug}`}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
                  >
                    Read the case study
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </MotionReveal>
              <MotionReveal delay={0.06} className="mt-8">
                <Demo name={project.demo} />
              </MotionReveal>
            </section>
          ) : null,
        )}

        <section aria-labelledby="demo-jar-test">
          <MotionReveal>
            <div className="max-w-2xl">
              <p className="eyebrow">
                <span className="text-accent">Side quest</span> · Water treatment
              </p>
              <h2 id="demo-jar-test" className="display mt-4 text-4xl sm:text-5xl">
                The <em>jar test</em>
              </h2>
              <p className="mt-4 text-pretty text-muted">
                Before a treatment plant doses a river&apos;s worth of water, someone at the bench finds the right
                amount of coagulant one litre at a time. Five raw samples, three jars each: get the settled water under
                5 NTU without wasting alum.
              </p>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.06} className="mt-8">
            <JarTest />
          </MotionReveal>
        </section>
      </div>
    </div>
  );
}
