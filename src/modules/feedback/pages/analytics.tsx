import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { GroupedBarChart } from "@/components/ds/charts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function FeedbackAnalyticsPage() {
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

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Sentiment by Category" description="NLP-driven thematic analysis">
          <GroupedBarChart
            data={[
              { category: "Logistics", positive: 65, negative: 35 },
              { category: "Content", positive: 92, negative: 8 },
              { category: "Mentorship", positive: 88, negative: 12 },
              { category: "Platform", positive: 76, negative: 24 },
            ]}
            xKey="category"
            series={[
              { key: "positive", label: "Positive %" },
              { key: "negative", label: "Negative %" },
            ]}
            height={300}
            stacked
          />
        </SectionCard>

        <SectionCard title="Response Rate by Event" description="Survey completion metrics">
          <GroupedBarChart
            data={[
              { event: "AI Summit", rate: 72 },
              { event: "Hack the Campus", rate: 85 },
              { event: "Design Cup", rate: 64 },
              { event: "Web3 Sprint", rate: 58 },
            ]}
            xKey="event"
            series={[{ key: "rate", label: "Response Rate %" }]}
            height={300}
          />
        </SectionCard>
      </div>
    </>
  );
}
