import type { Metadata } from "next";
import { ContactLinks } from "@/components/ContactLinks";
import { MotionReveal } from "@/components/MotionReveal";
import { Timeline } from "@/components/Timeline";
import {
  getCertifications,
  getCvEntries,
  getEducation,
  getProfile,
  getSkills,
} from "@/lib/data/content";

export const revalidate = 300;

export const metadata: Metadata = { title: "Portfolio" };

export default async function CvPage() {
  const [profile, entries, skills, education, certifications] = await Promise.all([
    getProfile(),
    getCvEntries(),
    getSkills(),
    getEducation(),
    getCertifications(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-20">
      <MotionReveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Portfolio &amp; CV</p>
            <h1 className="display mt-5 text-[clamp(2.5rem,6vw,4.5rem)]">{profile.name}</h1>
            <p className="serif-accent mt-3 text-2xl text-accent">{profile.headline}</p>
          </div>
          <a
            href="/api/cv/pdf"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-95"
          >
            Download PDF <span aria-hidden>↓</span>
          </a>
        </div>
        <p className="mt-4 text-sm text-muted">{profile.location}</p>
        <ContactLinks profile={profile} className="mt-2 text-sm text-muted" />
      </MotionReveal>

      <Section title="Experience">
        <Timeline entries={entries} />
      </Section>

      {skills.length > 0 && (
        <Section title="Skills">
          <dl className="grid gap-5 sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.group}>
                <dt className="text-sm font-medium">{group.group}</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <ul className="flex flex-col gap-4">
            {education.map((item) => (
              <li key={item.qualification}>
                <p className="font-medium">{item.qualification}</p>
                <p className="text-sm text-muted">
                  {[item.institution, item.year].filter(Boolean).join(", ")}
                </p>
                {item.note && <p className="text-sm text-muted">{item.note}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {certifications.map((cert) => (
              <li key={`${cert.issuer}-${cert.name}`}>
                <p className="text-sm font-medium">{cert.name}</p>
                <p className="text-sm text-muted">
                  {[cert.issuer, cert.year].filter(Boolean).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Referees">
        <p className="text-sm text-muted">Available on request.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <MotionReveal>
        <h2 className="eyebrow mb-8 flex items-center gap-4">
          {title}
          <span aria-hidden className="h-px flex-1 bg-border" />
        </h2>
      </MotionReveal>
      {children}
    </section>
  );
}
