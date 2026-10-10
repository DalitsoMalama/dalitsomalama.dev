import type { Metadata } from "next";
import { ContactActions } from "@/components/ContactActions";
import { ContactLinks } from "@/components/ContactLinks";
import { MotionReveal } from "@/components/MotionReveal";
import { getAboutText, getProfile } from "@/lib/data/content";

export const revalidate = 300;

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [about, profile] = await Promise.all([getAboutText(), getProfile()]);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-20">
      <MotionReveal>
        <p className="eyebrow">About</p>
        <h1 className="display mt-5 text-[clamp(2.5rem,6vw,4.5rem)]">
          Engineer by training, <em>automator by habit.</em>
        </h1>
      </MotionReveal>
      <MotionReveal delay={0.08}>
        <div className="mt-12 whitespace-pre-line text-pretty text-lg leading-relaxed text-foreground/85">
          {about}
        </div>
      </MotionReveal>

      <MotionReveal delay={0.05}>
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="eyebrow">Get in touch</h2>
          <p className="mt-2 text-sm text-muted">{profile.location}</p>
          <div className="mt-5">
            <ContactActions profile={profile} />
          </div>
          <ContactLinks profile={profile} className="mt-5 text-sm text-muted" />
        </section>
      </MotionReveal>
    </div>
  );
}
