import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart, TrendAreaChart } from "@/components/ds/charts";
import { useCertificateAnalytics } from "@/modules/analytics/hooks/analytics.hooks";

export const Route = createFileRoute("/analytics/certificates")({
  head: () => ({
    meta: [{ title: "Certificate Analytics · Ascent Platform" }],
  }),
  component: CertificatesAnalyticsPage,
});

function CertificatesAnalyticsPage() {
  const { data, isLoading } = useCertificateAnalytics();

  if (isLoading || !data) return <div className="p-8">Loading analytics...</div>;

  const { kpis, certificatesByType, issuanceTrend } = data;

  return (
    <>
      <PageHeader
        title="Certificate Analytics"
        description="Insights on issued and verified certificates."
        crumbs={[{ label: "Insights" }, { label: "Certificate Analytics" }]}
      />
      
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3 mb-6">
        {[
          { label: "Total Issued", value: kpis.totalIssued.toLocaleString() },
          { label: "Verified", value: kpis.verified.toLocaleString() },
          { label: "Revoked", value: kpis.revoked.toLocaleString() },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Certificates by Type" description="Distribution of certificate types">
          <GroupedBarChart
            data={certificatesByType}
            xKey="type"
            series={[{ key: "count", label: "Issued" }]}
            height={300}
          />
        </SectionCard>

        <SectionCard title="Issuance Trend" description="Certificates issued over time">
          <TrendAreaChart
            data={issuanceTrend}
            xKey="month"
            series={[{ key: "issued", label: "Issued" }]}
            height={300}
          />
        </SectionCard>
      </div>
    </>
  );
}
