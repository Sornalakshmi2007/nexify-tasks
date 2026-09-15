import { PRIORITY_LABELS, STATUS_LABELS, type TaskPriority, type TaskStatus } from "@/lib/tasks";

const statusVar: Record<TaskStatus, string> = {
  pending: "var(--status-pending)",
  in_progress: "var(--status-progress)",
  completed: "var(--status-completed)",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        color: statusVar[status],
        backgroundColor: `color-mix(in oklch, ${statusVar[status]} 14%, transparent)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: statusVar[status] }}
        aria-hidden
      />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const tone =
    priority === "high"
      ? "var(--destructive)"
      : priority === "medium"
        ? "var(--status-pending)"
        : "var(--muted-foreground)";
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{ color: tone, borderColor: `color-mix(in oklch, ${tone} 35%, transparent)` }}
    >
      {PRIORITY_LABELS[priority]} priority
    </span>
  );
}
