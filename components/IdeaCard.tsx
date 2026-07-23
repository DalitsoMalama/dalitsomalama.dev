"use client";

import { useState, useTransition } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import type { Idea } from "@/lib/types";

export function IdeaCard({ idea }: { idea: Idea }) {
  const [voteCount, setVoteCount] = useState(idea.vote_count);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleVote() {
    if (voted || isPending) return;
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/ideas/${idea.id}/vote`, { method: "POST" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Vote failed");
        }
        const body = (await res.json()) as { status: "ok" | "already_voted" };
        setVoted(true);
        if (body.status === "ok") setVoteCount((v) => v + 1);
      } catch {
        setError("Couldn't record your vote — try again.");
      }
    });
  }

  return (
    <li className="flex items-start gap-4 rounded-lg border border-border bg-surface p-5">
      <button
        type="button"
        onClick={handleVote}
        disabled={voted || isPending}
        aria-pressed={voted}
        aria-label={voted ? "You upvoted this idea" : "Upvote this idea"}
        className="flex min-w-14 flex-col items-center gap-0.5 rounded-md border border-border px-3 py-2 text-sm transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-70"
      >
        <span aria-hidden className="text-base leading-none">
          &#9650;
        </span>
        <span className="font-mono tabular-nums">{voteCount}</span>
      </button>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{idea.title}</h3>
          <StatusBadge status={idea.status} />
        </div>
        <p className="mt-1 text-sm text-muted">{idea.description}</p>
        <p className="mt-2 text-xs text-muted">
          Submitted by {idea.submitter_name || "anonymous"}
        </p>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    </li>
  );
}
