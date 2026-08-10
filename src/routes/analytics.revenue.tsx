import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart, TrendAreaChart } from "@/components/ds/charts";
import { registrationTrend, revenueByPlan } from "@/lib/mock-data";

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
  return (
    <>
      <PageHeader
        title="Revenue analytics"
        description="Monetisation across subscriptions, registrations and sponsorships."
        crumbs={[{ label: "Insights" }, { label: "Revenue analytics" }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Revenue (MTD)", value: "$108,600", delta: 12.4, hint: "vs last month" },
          { label: "Subscription MRR", value: "$68,900", delta: 14.2 },
          { label: "Registration revenue", value: "$30,500", delta: 8.1 },
          { label: "Sponsorship", value: "$9,200", delta: 21.7 },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Revenue trend" description="Last 7 months">
          <TrendAreaChart
            data={registrationTrend}
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
