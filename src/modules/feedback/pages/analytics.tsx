import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useFeedbackAnalytics } from "@/modules/analytics/hooks/analytics.hooks";

export function FeedbackAnalyticsPage() {
  const { data, isLoading } = useFeedbackAnalytics();

  if (isLoading || !data) return <div className="p-8">Loading analytics...</div>;

  const { kpis, sentiment, responseRateByEvent } = data;

  return (
    <>
      <PageHeader
        title="Feedback Analytics"
        description="Data-driven insights from participant responses."
        crumbs={[
          { label: "Engagement" },
          { label: "Feedback", to: "/feedback" },
          { label: "Analytics" },
        ]}
        actions={
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 mb-6">
        {[
          { label: "Total Responses", value: kpis.totalResponses.toLocaleString() },
          { label: "Average Rating", value: `${kpis.averageRating} / 5.0` },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Overall Sentiment" description="Distribution of positive, neutral, and negative sentiment">
          <GroupedBarChart
            data={sentiment}
            xKey="name"
            series={[
              { key: "value", label: "Responses" },
            ]}
            height={300}
          />
        </SectionCard>

        <SectionCard title="Responses by Survey" description="Survey completion metrics">
          <GroupedBarChart
            data={responseRateByEvent}
            xKey="survey"
            series={[{ key: "responses", label: "Responses" }]}
            height={300}
          />
        </SectionCard>
      </div>
    </>
  );
}
