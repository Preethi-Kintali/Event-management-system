import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart, TrendAreaChart } from "@/components/ds/charts";
import { useRecruitmentAnalytics } from "@/modules/analytics/hooks/analytics.hooks";

export const Route = createFileRoute("/analytics/recruitment")({
  head: () => ({
    meta: [{ title: "Recruitment Analytics · Ascent Platform" }],
  }),
  component: RecruitmentAnalyticsPage,
});

function RecruitmentAnalyticsPage() {
  const { data, isLoading } = useRecruitmentAnalytics();

  if (isLoading || !data) return <div className="p-8">Loading analytics...</div>;

  const { kpis, applicationStatus, applicationTrend } = data;

  return (
    <>
      <PageHeader
        title="Recruitment Analytics"
        description="Insights on job postings and applications."
        crumbs={[{ label: "Insights" }, { label: "Recruitment Analytics" }]}
      />
      
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3 mb-6">
        {[
          { label: "Total Postings", value: kpis.totalPostings.toLocaleString() },
          { label: "Open Postings", value: kpis.openPostings.toLocaleString() },
          { label: "Total Applications", value: kpis.totalApplications.toLocaleString() },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Application Status" description="Distribution of applications by status">
          <GroupedBarChart
            data={applicationStatus}
            xKey="status"
            series={[{ key: "count", label: "Applications" }]}
            height={300}
          />
        </SectionCard>

        <SectionCard title="Application Trend" description="Applications over time">
          <TrendAreaChart
            data={applicationTrend}
            xKey="month"
            series={[{ key: "applications", label: "Applications" }]}
            height={300}
          />
        </SectionCard>
      </div>
    </>
  );
}
