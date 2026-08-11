import { useState } from "react";
import { Gavel, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useMyEvaluations, useEvaluations, useUpdateEvaluation, ApiEvaluation } from "../services/evaluations.api";

function statusToChip(status: string): string {
  switch (status) {
    case "COMPLETED": return "published";
    case "IN_PROGRESS": return "in_review";
    case "PENDING": return "pending";
    default: return "pending";
  }
}

export function EvaluationsPage() {
  const { data: myEvals = [], isLoading: myLoading } = useMyEvaluations();
  const { data: allEvals = [], isLoading: allLoading } = useEvaluations();
  const updateEval = useUpdateEvaluation();

  const [selected, setSelected] = useState<ApiEvaluation | null>(null);
  const [scoreValue, setScoreValue] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");

  // Stats from real data
  const completed = myEvals.filter((e) => e.status === "COMPLETED").length;
  const scores = myEvals.filter((e) => e.score !== null).map((e) => e.score as number);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";
  const progress = myEvals.length > 0 ? Math.round((completed / myEvals.length) * 100) : 0;

  // Build round progress from all evals
  const roundGroups = allEvals.reduce<Record<string, { pending: number; completed: number }>>(
    (acc, e) => {
      const round = e.submission?.competition?.name ?? "General";
      if (!acc[round]) acc[round] = { pending: 0, completed: 0 };
      if (e.status === "COMPLETED") acc[round].completed++;
      else acc[round].pending++;
      return acc;
    },
    {}
  );
  const roundData = Object.entries(roundGroups).map(([name, v]) => ({ round: name, ...v }));

  // Panel completion per judge
  const judgeMap = allEvals.reduce<Record<string, { name: string; total: number; done: number }>>(
    (acc, e) => {
      const jId = e.judgeId;
      const jName = e.judge
        ? `${e.judge.firstName ?? ""} ${e.judge.lastName ?? ""}`.trim() || e.judge.email
        : jId;
      if (!acc[jId]) acc[jId] = { name: jName, total: 0, done: 0 };
      acc[jId].total++;
      if (e.status === "COMPLETED") acc[jId].done++;
      return acc;
    },
    {}
  );
  const panelData = Object.values(judgeMap).slice(0, 6);

  function handleSelectSubmission(ev: ApiEvaluation) {
    setSelected(ev);
    setScoreValue(ev.score !== null && ev.score !== undefined ? ev.score : 0);
    setFeedbackText(ev.feedback ?? "");
  }

  async function handleSaveDraft() {
    if (!selected) return;
    await updateEval.mutateAsync({ id: selected.id, score: scoreValue, feedback: feedbackText, status: "IN_PROGRESS" });
    toast.success("Draft scorecard saved");
  }

  async function handleSubmitScorecard() {
    if (!selected) return;
    await updateEval.mutateAsync({ id: selected.id, score: scoreValue, feedback: feedbackText, status: "COMPLETED" });
    toast.success("Scorecard submitted");
    setSelected(null);
  }

  const isLoading = myLoading || allLoading;

  return (
    <>
      <PageHeader
        title="Judge Dashboard"
        description="Your evaluation queue, scorecards and round progress."
        crumbs={[{ label: "Evaluation" }, { label: "Evaluations" }]}
        actions={
          <Button onClick={() => toast.info("Select a submission from the queue below")}>
            <Gavel className="h-4 w-4" />
            Start evaluating
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading evaluations…
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Assigned to you", value: String(myEvals.length), hint: "Your evaluation queue" },
              { label: "Completed", value: String(completed), progress },
              { label: "Avg score given", value: String(avgScore), delta: 0 },
              { label: "Pending", value: String(myEvals.length - completed), hint: "evaluations remaining" },
            ].map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-6">
              <SectionCard title="Evaluation queue" description="Sorted by status" padded={false}>
                {myEvals.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-muted-foreground">
                    No evaluations assigned to you yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {myEvals.map((ev) => (
                      <li
                        key={ev.id}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {ev.submission?.title ?? "Untitled submission"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {ev.submissionId.slice(0, 8)} · {ev.submission?.team?.name ?? "—"} ·{" "}
                            {ev.submission?.competition?.name ?? "—"}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <StatusChip status={statusToChip(ev.status) as any} />
                          <Button
                            size="sm"
                            variant={selected?.id === ev.id ? "default" : "outline"}
                            onClick={() => handleSelectSubmission(ev)}
                          >
                            {selected?.id === ev.id ? "Scoring" : "Score"}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>

              {selected && (
                <SectionCard
                  title={`Scorecard · ${selected.submission?.title ?? selected.submissionId.slice(0, 8)}`}
                  description="Score out of 100"
                >
                  <div className="space-y-6">
                    <div>
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                        <p className="truncate text-sm font-medium">Overall Score</p>
                        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                          {scoreValue} / 100
                        </span>
                      </div>
                      <Slider
                        value={[scoreValue]}
                        onValueChange={([v]) => { if (v !== undefined) setScoreValue(v); }}
                        max={100}
                        step={1}
                        className="mt-3"
                        aria-label="Score"
                      />
                    </div>
                    <Textarea
                      rows={4}
                      placeholder="Overall feedback shared with the team…"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={updateEval.isPending}
                      >
                        {updateEval.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                        Save draft
                      </Button>
                      <Button onClick={handleSubmitScorecard} disabled={updateEval.isPending}>
                        Submit scorecard
                      </Button>
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>

            <aside className="space-y-6">
              <SectionCard title="Round progress" description="Pending vs completed">
                {roundData.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No data yet.</p>
                ) : (
                  <GroupedBarChart
                    data={roundData}
                    xKey="round"
                    series={[
                      { key: "completed", label: "Completed" },
                      { key: "pending", label: "Pending" },
                    ]}
                    stacked
                    height={220}
                  />
                )}
              </SectionCard>

              <SectionCard title="Panel completion" description={`${panelData.length} judges`}>
                <div className="space-y-4">
                  {panelData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No judges assigned yet.</p>
                  ) : (
                    panelData.map((j) => {
                      const pct = j.total > 0 ? Math.round((j.done / j.total) * 100) : 0;
                      return (
                        <div key={j.name}>
                          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-sm">
                            <span className="truncate">{j.name}</span>
                            <span className="shrink-0 tabular-nums text-muted-foreground">{pct}%</span>
                          </div>
                          <Progress value={pct} className="mt-1.5 h-1.5" />
                        </div>
                      );
                    })
                  )}
                </div>
              </SectionCard>
            </aside>
          </div>
        </>
      )}
    </>
  );
}
