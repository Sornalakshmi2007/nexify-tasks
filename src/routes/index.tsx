import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ListChecks, ShieldCheck, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TiraneX Task Manager — Plan, track and complete your tasks" },
      {
        name: "description",
        content:
          "A secure task management app with accounts, priorities, due dates and status tracking for pending, in progress and completed work.",
      },
      { property: "og:title", content: "TiraneX Task Manager" },
      {
        property: "og:description",
        content:
          "Secure task management with accounts, priorities, due dates and status tracking.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:py-24">
        <span
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground"
          style={{ backgroundImage: "var(--brand-gradient)" }}
        >
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          TiraneX Task Manager
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Create, track and complete your tasks with priorities, due dates and a clear dashboard.
          Every account sees only its own tasks.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg">
            <Link to="/auth">Get started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/auth">I already have an account</Link>
          </Button>
        </div>

        <div className="mt-14 grid w-full gap-4 sm:grid-cols-3">
          <Feature icon={<ListChecks className="h-5 w-5" />} title="Full task control">
            Add, edit, view and delete tasks with status and priority.
          </Feature>
          <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Private by design">
            Your tasks are protected and visible only to you.
          </Feature>
          <Feature icon={<Smartphone className="h-5 w-5" />} title="Works anywhere">
            Responsive layout built for phone and desktop.
          </Feature>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border border-border bg-card p-5 text-left"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        {icon}
      </span>
      <h2 className="mt-3 text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
