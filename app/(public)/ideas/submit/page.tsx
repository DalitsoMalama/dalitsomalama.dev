import type { Metadata } from "next";
import { MotionReveal } from "@/components/MotionReveal";
import { IdeaForm } from "@/components/IdeaForm";

export const metadata: Metadata = { title: "Submit an idea" };

export default function SubmitIdeaPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <MotionReveal>
        <h1 className="text-2xl font-medium">Submit an idea</h1>
        <p className="mt-2 text-muted">
          Anonymous is fine. Every submission is reviewed before it appears publicly — no spam
          reaches the feed.
        </p>
      </MotionReveal>
      <div className="mt-8">
        <IdeaForm />
      </div>
    </div>
  );
}
