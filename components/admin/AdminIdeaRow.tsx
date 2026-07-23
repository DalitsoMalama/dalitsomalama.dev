"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import type { Idea, IdeaStatus } from "@/lib/types";

const STATUS_OPTIONS: IdeaStatus[] = [
  "submitted",
  "under_review",
  "in_the_lab",
  "shipped",
  "declined",
];

export function AdminIdeaRow({ idea }: { idea: Idea }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function moderate(body: { approved?: boolean; status?: IdeaStatus }) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/ideas/${idea.id}/moderate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Update failed");
        router.refresh();
      } catch {
        setError("Couldn't update — try again.");
      }
    });
  }

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{idea.title}</h3>
          <StatusBadge status={idea.status} />
          {!idea.approved && (
            <span className="rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-medium text-amber-300">
              Pending approval
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{idea.description}</p>
        <p className="mt-2 text-xs text-muted">
          {idea.submitter_name || "anonymous"} · {idea.vote_count} votes
        </p>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {!idea.approved && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => moderate({ approved: true, status: "under_review" })}
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
          >
            Approve
          </button>
        )}
        <select
          value={idea.status}
          disabled={isPending}
          onChange={(e) => moderate({ status: e.target.value as IdeaStatus })}
          className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs disabled:opacity-60"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}
