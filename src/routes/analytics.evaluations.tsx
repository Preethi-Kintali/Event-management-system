import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { useEvaluationAnalytics } from "@/modules/analytics/hooks/analytics.hooks";

export const Route = createFileRoute("/analytics/evaluations")({
  head: () => ({
    meta: [{ title: "Evaluation Analytics · Ascent Platform" }],
  }),
  component: EvaluationsAnalyticsPage,
});

function EvaluationsAnalyticsPage() {
  const { data, isLoading } = useEvaluationAnalytics();

  if (isLoading || !data) return <div className="p-8">Loading analytics...</div>;

  const { kpis, scoreDistribution } = data;

  return (
    <>
      <PageHeader
        title="Evaluation Analytics"
        description="Insights on judging and evaluation scores."
        crumbs={[{ label: "Insights" }, { label: "Evaluation Analytics" }]}
      />
      
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3 mb-6">
        {[
          { label: "Total Evaluations", value: kpis.totalEvaluations.toLocaleString() },
          { label: "Completed", value: kpis.completedEvaluations.toLocaleString() },
          { label: "Average Score", value: `${kpis.averageScore} / 100` },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-1">
        <SectionCard title="Score Distribution" description="Spread of evaluation scores">
          <GroupedBarChart
            data={scoreDistribution}
            xKey="range"
            series={[{ key: "count", label: "Evaluations" }]}
            height={400}
          />
        </SectionCard>
      </div>
    </>
  );
}
