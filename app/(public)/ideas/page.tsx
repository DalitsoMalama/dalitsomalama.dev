import type { Metadata } from "next";
import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";
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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <MotionReveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium">Ideas</h1>
            <p className="mt-2 max-w-xl text-muted">
              Got something you wish existed? Submit it — approved ideas show up here for
              everyone to upvote.
            </p>
          </div>
          <Link
            href="/ideas/submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Submit an idea
          </Link>
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
