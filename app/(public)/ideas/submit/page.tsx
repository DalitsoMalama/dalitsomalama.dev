import type { Metadata } from "next";
import { ContactActions } from "@/components/ContactActions";
import { MotionReveal } from "@/components/MotionReveal";
import { IdeaForm } from "@/components/IdeaForm";
import { getProfile } from "@/lib/data/content";
import { ideasPortalOpen } from "@/lib/ideasPortal";

export const metadata: Metadata = { title: "Submit an idea" };

export default async function SubmitIdeaPage() {
  const open = ideasPortalOpen();
  const profile = open ? null : await getProfile();

  return (
    <div className="mx-auto max-w-xl px-6 pb-16 pt-20">
      <MotionReveal>
        <p className="eyebrow">Ideas portal</p>
        <h1 className="display mt-5 text-[clamp(2.25rem,5vw,3.5rem)]">
          Submit <em>an idea.</em>
        </h1>
        <p className="mt-4 text-pretty text-muted">
          Describe the manual process and what a good result would look like. Anonymous is fine. Every submission
          is reviewed before it appears publicly.
        </p>
      </MotionReveal>

      <div className="mt-10">
        {open ? (
          <IdeaForm />
        ) : (
          <MotionReveal>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="font-medium">Online submissions open soon.</p>
              <p className="mt-2 text-sm text-muted">
                In the meantime, send the process you&apos;d like automated straight to me — WhatsApp or email is
                perfect.
              </p>
              {profile && (
                <div className="mt-6">
                  <ContactActions profile={profile} />
                </div>
              )}
            </div>
          </MotionReveal>
        )}
      </div>
    </div>
  );
}
