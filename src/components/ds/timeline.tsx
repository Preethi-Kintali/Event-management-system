import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Timeline({
  items,
}: {
  items: { id: string; title: string; detail: string; time: string; state: "done" | "current" | "upcoming" }[];
}) {
  return (
    <ol className="relative space-y-6 pl-7">
      <span className="absolute left-[9px] top-2 bottom-2 w-px bg-border" aria-hidden />
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            className={cn(
              "absolute -left-7 top-0.5 grid h-[19px] w-[19px] place-items-center rounded-full border-2 bg-background",
              item.state === "done" && "border-success text-success",
              item.state === "current" && "border-primary text-primary",
              item.state === "upcoming" && "border-border text-muted-foreground",
            )}
            aria-hidden
          >
            {item.state === "done" ? (
              <Check className="h-3 w-3" />
            ) : (
              <Circle className={cn("h-2 w-2", item.state === "current" && "fill-current")} />
            )}
          </span>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
            <p className="truncate text-sm font-medium">{item.title}</p>
            <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{item.detail}</p>
        </li>
      ))}
    </ol>
  );
}

export function Stepper({
  steps,
  current,
  onStepClick,
}: {
  steps: string[];
  current: number;
  onStepClick?: ((index: number) => void) | undefined;
}) {
  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "current" : "upcoming";
        return (
          <li key={step} className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={onStepClick ? () => onStepClick(i) : undefined}
              className="flex min-w-0 items-center gap-2.5 text-left"
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                  state === "done" && "border-primary bg-primary text-primary-foreground",
                  state === "current" && "border-primary bg-accent text-accent-foreground",
                  state === "upcoming" && "border-border text-muted-foreground",
                )}
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "truncate text-sm",
                  state === "upcoming" ? "text-muted-foreground" : "font-medium",
                )}
              >
                {step}
              </span>
            </button>
            {i < steps.length - 1 ? (
              <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function KanbanCard({
  title,
  subtitle,
  meta,
  badge,
}: {
  title: string;
  subtitle: string;
  meta: string;
  badge?: React.ReactNode | undefined;
}) {
  return (
    <article className="rounded-lg border border-border bg-surface p-3 shadow-card transition-shadow hover:shadow-raised">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-snug">{title}</h4>
        {badge}
      </div>
      <p className="mt-1.5 truncate text-xs text-muted-foreground">{subtitle}</p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {meta}
      </p>
    </article>
  );
}
