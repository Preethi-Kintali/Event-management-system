import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart, TrendAreaChart } from "@/components/ds/charts";
import { useAIAnalytics } from "@/modules/analytics/hooks/analytics.hooks";

export const Route = createFileRoute("/analytics/ai")({
  head: () => ({
    meta: [{ title: "AI Analytics · Ascent Platform" }],
  }),
  component: AIAnalyticsPage,
});

function AIAnalyticsPage() {
  const { data, isLoading } = useAIAnalytics();

  if (isLoading || !data) return <div className="p-8">Loading analytics...</div>;

  const { kpis, usageByFeature, requestTrend } = data;

  return (
    <>
      <PageHeader
        title="AI Analytics"
        description="Insights on AI validation and token usage."
        crumbs={[{ label: "Insights" }, { label: "AI Analytics" }]}
      />
      
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {[
          { label: "Total AI Requests", value: kpis.totalRequests.toLocaleString() },
          { label: "Tokens Used", value: kpis.totalTokens.toLocaleString() },
          { label: "Avg Plagiarism Score", value: `${kpis.avgPlagiarismScore}%` },
          { label: "Avg AI Content Score", value: `${kpis.avgAIContentScore}%` },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Usage by Feature" description="AI API requests by feature">
          <GroupedBarChart
            data={usageByFeature}
            xKey="feature"
            series={[{ key: "requests", label: "Requests" }]}
            height={300}
          />
        </SectionCard>

        <SectionCard title="Request Trend" description="AI requests over time">
          <TrendAreaChart
            data={requestTrend}
            xKey="month"
            series={[{ key: "requests", label: "Requests" }]}
            height={300}
          />
        </SectionCard>
      </div>
    </>
  );
}
