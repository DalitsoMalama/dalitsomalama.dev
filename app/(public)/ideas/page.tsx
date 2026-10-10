import type { Metadata } from "next";
import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";
import { Figure } from "@/components/Figure";
import { IdeaCard } from "@/components/IdeaCard";
import { getApprovedIdeas, type IdeaSort } from "@/lib/data/ideas";

export const revalidate = 60;

export const metadata: Metadata = { title: "Ideas" };

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: sortParam } = await searchParams;
  const sort: IdeaSort = sortParam === "recent" ? "recent" : "votes";
  const ideas = await getApprovedIdeas(sort);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-20">
      <MotionReveal>
        <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <p className="eyebrow">Ideas portal</p>
            <h1 className="display mt-5 text-[clamp(2.5rem,6vw,4rem)]">
              What should I <em>automate next?</em>
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-muted">
              Still doing something by hand in Excel, on paper or over email? Describe it here.
              Approved ideas show up for everyone to upvote, and the best ones get built.
            </p>
            <Link
              href="/ideas/submit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              Submit an idea
            </Link>
          </div>
          <div className="w-48 shrink-0 self-center sm:w-60">
            <Figure
              name="format"
              play
              label="A file of crooked lines; as the pointer runs down it, every line above snaps square — a messy manual process, made orderly."
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2 text-sm">
          <Link
            href="/ideas?sort=votes"
            className={`rounded-full border px-3 py-1 ${
              sort === "votes" ? "border-accent text-accent" : "border-border text-muted"
            }`}
          >
            Most voted
          </Link>
          <Link
            href="/ideas?sort=recent"
            className={`rounded-full border px-3 py-1 ${
              sort === "recent" ? "border-accent text-accent" : "border-border text-muted"
            }`}
          >
            Most recent
          </Link>
        </div>
      </MotionReveal>

      <ul className="mt-8 flex flex-col gap-3">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </ul>

      {ideas.length === 0 && <p className="mt-10 text-muted">No approved ideas yet — be the first.</p>}
    </div>
  );
}
