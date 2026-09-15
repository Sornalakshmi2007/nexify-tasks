import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PriorityBadge, StatusBadge } from "@/components/TaskBadges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTask } from "@/lib/tasks";

export const Route = createFileRoute("/_authenticated/tasks/$taskId")({
  head: () => ({
    meta: [
      { title: "Task details — TiraneX Task Manager" },
      { name: "description", content: "View the full details of one of your tasks." },
      { property: "og:title", content: "Task details — TiraneX Task Manager" },
      { property: "og:description", content: "View the full details of one of your tasks." },
    ],
  }),
  component: TaskDetails,
});

function TaskDetails() {
  const { taskId } = Route.useParams();
  const { user } = Route.useRouteContext();
  const taskQuery = useQuery({ queryKey: ["tasks", taskId], queryFn: () => fetchTask(taskId) });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader email={user.email ?? ""} />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link to="/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>

        {taskQuery.isLoading && <Skeleton className="h-52 w-full rounded-xl" />}

        {taskQuery.isError && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-destructive">
                {(taskQuery.error as Error).message || "Could not load this task."}
              </p>
            </CardContent>
          </Card>
        )}

        {taskQuery.data && (
          <Card style={{ boxShadow: "var(--shadow-card)" }}>
            <CardContent className="space-y-5 py-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{taskQuery.data.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={taskQuery.data.status} />
                  <PriorityBadge priority={taskQuery.data.priority} />
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
                <p className="mt-1 whitespace-pre-wrap text-sm">
                  {taskQuery.data.description || "No description provided."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Info
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Due date"
                  value={
                    taskQuery.data.due_date ? formatDay(taskQuery.data.due_date) : "No due date"
                  }
                />
                <Info
                  icon={<Clock className="h-4 w-4" />}
                  label="Created"
                  value={formatDay(taskQuery.data.created_at)}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function formatDay(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
