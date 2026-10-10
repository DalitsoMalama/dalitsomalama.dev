import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { Marquee } from "@/components/Marquee";
import { MotionReveal } from "@/components/MotionReveal";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { HowIWork } from "@/components/home/HowIWork";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getManifesto, getProfile, getSkills } from "@/lib/data/content";

export const revalidate = 300;

export default async function HomePage() {
  const [manifesto, profile, skills, featuredProjects] = await Promise.all([
    getManifesto(),
    getProfile(),
    getSkills(),
    getFeaturedProjects(3),
  ]);
  // The ticker shows the headline tools, not every soft skill.
  const stack = skills
    .filter((group) => group.group !== "Other")
    .flatMap((group) => group.items)
    .slice(0, 18);

  return (
    <>
      <Hero profile={profile} manifesto={manifesto} />

      {profile.highlights.length > 0 && (
        <section id="impact" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
          <MotionReveal>
            <p className="eyebrow">Impact, in production</p>
            <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">
              Real systems, used <em>every single day.</em>
            </h2>
          </MotionReveal>
          <dl className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
            {profile.highlights.map((highlight, index) => (
              <MotionReveal key={highlight.label} delay={index * 0.08} className="h-full">
                <div className="flex h-full flex-col-reverse justify-end gap-3 bg-surface p-8 sm:p-10">
                  <dt className="max-w-[24ch] text-pretty text-muted">{highlight.label}</dt>
                  <dd className="display text-5xl text-foreground sm:text-6xl">
                    <CountUp value={highlight.value} />
                  </dd>
                </div>
              </MotionReveal>
            ))}
          </dl>
        </section>
      )}

      {featuredProjects.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <MotionReveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl">
                  Built for a utility, <em>not a demo.</em>
                </h2>
              </div>
              <Link href="/systems" className="group inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground">
                All systems
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </MotionReveal>
          <div className="mt-14">
            <FeaturedWork projects={featuredProjects} />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-24">
        <MotionReveal>
          <p className="eyebrow">How I work</p>
          <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">
            Three steps, <em>every time.</em>
          </h2>
        </MotionReveal>
        <div className="mt-14">
          <HowIWork />
        </div>
      </section>

      {stack.length > 0 && (
        <section aria-label="Tools I work with" className="border-y border-border py-10">
          <Marquee items={stack} />
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-28 text-center">
        <MotionReveal>
          <p className="eyebrow">The ideas portal</p>
          <h2 className="display mx-auto mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5rem)]">
            Still doing it by hand <em>in Excel?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted">
            Describe the process. The ones that get the most votes are the ones I build next.
          </p>
          <Link
            href="/ideas/submit"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03] active:scale-95"
          >
            Submit a process →
          </Link>
        </MotionReveal>
      </section>
    </>
  );
}
