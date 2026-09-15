import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Loader2, Plus, Search, Trash2, Pencil } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PriorityBadge, StatusBadge } from "@/components/TaskBadges";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  type Task,
  type TaskInput,
} from "@/lib/tasks";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TiraneX Task Manager" },
      { name: "description", content: "View your task statistics and manage all your tasks." },
      { property: "og:title", content: "Dashboard — TiraneX Task Manager" },
      {
        property: "og:description",
        content: "View your task statistics and manage all your tasks.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const tasksQuery = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });
  const tasks = tasksQuery.data ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const createMutation = useMutation({
    mutationFn: (input: TaskInput) => createTask(input),
    onSuccess: () => {
      setCreating(false);
      invalidate();
      toast.success("Task created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskInput }) => updateTask(id, input),
    onSuccess: () => {
      setEditing(null);
      invalidate();
      toast.success("Task updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      setDeleting(null);
      invalidate();
      toast.success("Task deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesText =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchesText && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader email={user.email ?? ""} />

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track and manage all your tasks.</p>
          </div>
          <Button onClick={() => setCreating(true)} className="w-full sm:w-auto">
            <Plus className="mr-1.5 h-4 w-4" />
            Add task
          </Button>
        </div>

        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total tasks" value={stats.total} loading={tasksQuery.isLoading} />
          <StatCard
            label="Pending"
            value={stats.pending}
            color="var(--status-pending)"
            loading={tasksQuery.isLoading}
          />
          <StatCard
            label="In Progress"
            value={stats.in_progress}
            color="var(--status-progress)"
            loading={tasksQuery.isLoading}
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="var(--status-completed)"
            loading={tasksQuery.isLoading}
          />
        </section>

        <section className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="flex-1 sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="mt-5 space-y-3 pb-12">
          {tasksQuery.isLoading && (
            <>
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </>
          )}

          {tasksQuery.isError && (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-sm text-destructive">
                  {(tasksQuery.error as Error).message || "Could not load your tasks."}
                </p>
                <Button variant="outline" className="mt-3" onClick={() => tasksQuery.refetch()}>
                  Try again
                </Button>
              </CardContent>
            </Card>
          )}

          {!tasksQuery.isLoading && !tasksQuery.isError && filtered.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm font-medium">No tasks found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tasks.length === 0
                    ? "Create your first task to get started."
                    : "Try changing your search or filters."}
                </p>
              </CardContent>
            </Card>
          )}

          {filtered.map((task) => (
            <Card key={task.id} style={{ boxShadow: "var(--shadow-card)" }}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <Link
                    to="/tasks/$taskId"
                    params={{ taskId: task.id }}
                    className="text-base font-semibold hover:underline"
                  >
                    {task.title}
                  </Link>
                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                    {task.due_date && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Due {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(task)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleting(task)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5 text-destructive" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <Dialog open={creating} onOpenChange={(o) => !o && setCreating(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add task</DialogTitle>
            <DialogDescription>Fill in the details of your new task.</DialogDescription>
          </DialogHeader>
          <TaskForm
            submitting={createMutation.isPending}
            submitLabel="Create task"
            onCancel={() => setCreating(false)}
            onSubmit={(input) => createMutation.mutate(input)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>Update the details of this task.</DialogDescription>
          </DialogHeader>
          {editing && (
            <TaskForm
              initial={editing}
              submitting={updateMutation.isPending}
              submitLabel="Save changes"
              onCancel={() => setEditing(null)}
              onSubmit={(input) => updateMutation.mutate({ id: editing.id, input })}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.title}" will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleting) deleteMutation.mutate(deleting.id);
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  loading,
}: {
  label: string;
  value: number;
  color?: string;
  loading: boolean;
}) {
  return (
    <Card style={{ boxShadow: "var(--shadow-card)" }}>
      <CardContent className="py-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-7 w-10" />
        ) : (
          <p className="mt-1 text-2xl font-semibold" style={color ? { color } : undefined}>
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
