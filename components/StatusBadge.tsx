import type { IdeaStatus } from "@/lib/types";

const STATUS_LABELS: Record<IdeaStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  in_the_lab: "In the lab",
  shipped: "Shipped",
  declined: "Declined",
};

const STATUS_STYLES: Record<IdeaStatus, string> = {
  submitted: "bg-surface-hover text-muted",
  under_review: "bg-amber-400/15 text-amber-300",
  in_the_lab: "bg-accent/15 text-accent",
  shipped: "bg-emerald-500/20 text-emerald-300",
  declined: "bg-danger/15 text-danger",
};

export function StatusBadge({ status }: { status: IdeaStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
