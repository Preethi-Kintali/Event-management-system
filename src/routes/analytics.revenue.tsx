import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart, TrendAreaChart } from "@/components/ds/charts";
import { useRevenueAnalytics } from "@/modules/analytics/hooks/analytics.hooks";

export const Route = createFileRoute("/analytics/revenue")({
  head: () => ({
    meta: [
      { title: "Revenue analytics · Ascent Platform" },
      {
        name: "description",
        content: "Revenue, plan mix and monetisation performance across tenants.",
      },
      { property: "og:title", content: "Revenue analytics · Ascent Platform" },
      {
        property: "og:description",
        content: "Revenue, plan mix and monetisation performance across tenants.",
      },
    ],
  }),
  component: RevenueAnalyticsPage,
});

function RevenueAnalyticsPage() {
  const { data, isLoading, isError, error } = useRevenueAnalytics();

  if (isLoading) return <div className="p-8">Loading analytics...</div>;
  if (isError) return <div className="p-8 text-red-500">Error: {(error as any)?.message || "Failed to load"}</div>;
  if (!data) return <div className="p-8">No data available.</div>;

  const { kpis, revenueTrend, revenueByPlan } = data;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <>
      <PageHeader
        title="Revenue analytics"
        description="Monetisation across subscriptions, registrations and sponsorships."
        crumbs={[{ label: "Insights" }, { label: "Revenue analytics" }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Revenue (MTD)", value: formatCurrency(kpis.revenueMTD), delta: 12.4, hint: "vs last month" },
          { label: "Subscription MRR", value: formatCurrency(kpis.subscriptionMRR), delta: 14.2 },
          { label: "Registration revenue", value: formatCurrency(kpis.registrationRevenue), delta: 8.1 },
          { label: "Sponsorship", value: formatCurrency(kpis.sponsorship), delta: 21.7 },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Revenue trend" description="Last 7 months">
          <TrendAreaChart
            data={revenueTrend}
            xKey="month"
            series={[{ key: "revenue", label: "Revenue" }]}
          />
        </SectionCard>
        <SectionCard title="Revenue by plan" description="Current cycle">
          <GroupedBarChart
            data={revenueByPlan}
            xKey="plan"
            series={[{ key: "revenue", label: "Revenue" }]}
          />
        </SectionCard>
      </div>
    </>
  );
}
