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
  under_review: "bg-warning/15 text-warning",
  in_the_lab: "bg-accent/15 text-accent",
  shipped: "bg-success/15 text-success",
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
