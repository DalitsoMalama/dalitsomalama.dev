import type { Metadata } from "next";
import { MotionReveal } from "@/components/MotionReveal";
import { getAboutText } from "@/lib/data/content";

export const revalidate = 300;

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const about = await getAboutText();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <MotionReveal>
        <h1 className="text-2xl font-medium">About</h1>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/90">{about}</p>
      </MotionReveal>
    </div>
  );
}
