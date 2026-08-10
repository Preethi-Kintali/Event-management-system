import { createFileRoute } from "@tanstack/react-router";
import { Gavel } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { StatusChip } from "@/components/ds/status-chip";
import { Timeline } from "@/components/ds/timeline";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { evaluationLoad, scorecardCriteria, submissions, timeline } from "@/lib/mock-data";

export const Route = createFileRoute("/evaluations")({
  head: () => ({
    meta: [
      { title: "Evaluations · Ascent Platform" },
      { name: "description", content: "Judge workspace with assignment queue, scorecards and calibration insights." },
      { property: "og:title", content: "Evaluations · Ascent Platform" },
      { property: "og:description", content: "Judge workspace with assignment queue, scorecards and calibration insights." },
    ],
  }),
  component: EvaluationsPage,
});

function EvaluationsPage() {
  return (
    <>
      <PageHeader
        title="Judge dashboard"
        description="Your evaluation queue, scorecards and round progress."
        crumbs={[{ label: "Evaluation" }, { label: "Evaluations" }]}
        actions={<Button onClick={() => toast.success("Next submission opened")}><Gavel className="h-4 w-4" />Start evaluating</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Assigned to you", value: "24", hint: "Round 2 · AI Accessibility" },
          { label: "Completed", value: "19", progress: 79 },
          { label: "Avg score given", value: "76.4", delta: 1.2 },
          { label: "Deadline", value: "2 days", hint: "evaluation lock 09 Sep" },
        ].map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <SectionCard title="Evaluation queue" description="Sorted by deadline" padded={false}>
            <ul className="divide-y divide-border">
              {submissions.map((s) => (
                <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{s.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{s.id} · {s.team} · {s.round}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusChip status={s.status} />
                    <Button size="sm" variant="outline" onClick={() => toast.info(`Opening ${s.id}`)}>Score</Button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Scorecard · SUB-2291" description="Weighted criteria out of 100">
            <div className="space-y-6">
              {scorecardCriteria.map((c) => (
                <div key={c.id}>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <p className="truncate text-sm font-medium">{c.label}</p>
                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{c.score} / {c.weight}</span>
                  </div>
                  <Slider defaultValue={[c.score]} max={c.weight} step={1} className="mt-3" aria-label={c.label} />
                  <p className="mt-2 text-xs text-muted-foreground">{c.notes}</p>
                </div>
              ))}
              <Textarea rows={4} placeholder="Overall feedback shared with the team…" />
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => toast.success("Draft scorecard saved")}>Save draft</Button>
                <Button onClick={() => toast.success("Scorecard submitted")}>Submit scorecard</Button>
              </div>
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title="Round progress" description="Pending vs completed">
            <GroupedBarChart data={evaluationLoad} xKey="round" series={[{ key: "completed", label: "Completed" }, { key: "pending", label: "Pending" }]} stacked height={220} />
          </SectionCard>
          <SectionCard title="Panel completion" description="9 judges">
            <div className="space-y-4">
              {[
                { n: "Dr. Elena Marković", p: 79 },
                { n: "Prof. Rajat Menon", p: 100 },
                { n: "Kenji Watanabe", p: 25 },
                { n: "Grace Mensah", p: 100 },
              ].map((j) => (
                <div key={j.n}>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-sm">
                    <span className="truncate">{j.n}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">{j.p}%</span>
                  </div>
                  <Progress value={j.p} className="mt-1.5 h-1.5" />
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Recent activity" description="Submission SUB-2291">
            <Timeline items={timeline} />
          </SectionCard>
        </aside>
      </div>
    </>
  );
}
