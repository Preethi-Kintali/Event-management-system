import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { useSponsorAnalytics } from "@/modules/analytics/hooks/analytics.hooks";

export const Route = createFileRoute("/analytics/sponsors")({
  head: () => ({
    meta: [{ title: "Sponsor Analytics · Ascent Platform" }],
  }),
  component: SponsorsAnalyticsPage,
});

function SponsorsAnalyticsPage() {
  const { data, isLoading } = useSponsorAnalytics();

  if (isLoading || !data) return <div className="p-8">Loading analytics...</div>;

  const { kpis, sponsorsByTier } = data;
  
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <>
      <PageHeader
        title="Sponsor Analytics"
        description="Insights on sponsor engagement and ROI."
        crumbs={[{ label: "Insights" }, { label: "Sponsor Analytics" }]}
      />
      
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3 mb-6">
        {[
          { label: "Total Sponsors", value: kpis.totalSponsors.toLocaleString() },
          { label: "Active Sponsors", value: kpis.activeSponsors.toLocaleString() },
          { label: "Committed Value", value: formatCurrency(kpis.totalCommittedValue) },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-1">
        <SectionCard title="Sponsors by Tier" description="Distribution of sponsors across tiers">
          <GroupedBarChart
            data={sponsorsByTier}
            xKey="tier"
            series={[{ key: "count", label: "Sponsors" }]}
            height={400}
          />
        </SectionCard>
      </div>
    </>
  );
}
