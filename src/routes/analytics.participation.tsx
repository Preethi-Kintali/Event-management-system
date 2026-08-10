import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { DonutChart, GroupedBarChart, TrendAreaChart } from "@/components/ds/charts";
import { Progress } from "@/components/ui/progress";
import { categoryMix, funnel, participationByRegion, registrationTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics/participation")({
  head: () => ({
    meta: [
      { title: "Participation analytics · Ascent Platform" },
      {
        name: "description",
        content: "Participation funnel, regional reach and category mix insights.",
      },
      { property: "og:title", content: "Participation analytics · Ascent Platform" },
      {
        property: "og:description",
        content: "Participation funnel, regional reach and category mix insights.",
      },
    ],
  }),
  component: ParticipationAnalyticsPage,
});

function ParticipationAnalyticsPage() {
  const top = funnel[0]!.value;
  return (
    <>
      <PageHeader
        title="Participation analytics"
        description="How participants move from discovery to evaluated submissions."
        crumbs={[{ label: "Insights" }, { label: "Participation" }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Participants", value: "68,800", delta: 16.2 },
          { label: "Teams formed", value: "12,400", delta: 9.4 },
          { label: "Submission rate", value: "72%", progress: 72 },
          { label: "Repeat participation", value: "38%", delta: 4.6 },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Participation trend" description="Registrations vs participants">
          <TrendAreaChart
            data={registrationTrend}
            xKey="month"
            series={[
              { key: "registrations", label: "Registrations" },
              { key: "participants", label: "Participants" },
            ]}
            height={240}
          />
        </SectionCard>
        <SectionCard title="Category mix" description="Share of events">
          <DonutChart data={categoryMix} height={240} />
        </SectionCard>
        <SectionCard title="By region" description="Participants and teams">
          <GroupedBarChart
            data={participationByRegion}
            xKey="region"
            series={[
              { key: "participants", label: "Participants" },
              { key: "teams", label: "Teams" },
            ]}
            height={240}
          />
        </SectionCard>
      </div>
      <SectionCard title="Conversion funnel" description="Discovery to evaluation">
        <div className="space-y-4">
          {funnel.map((stage) => (
            <div key={stage.stage}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-sm">
                <span className="truncate">{stage.stage}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {stage.value.toLocaleString()}
                </span>
              </div>
              <Progress value={(stage.value / top) * 100} className="mt-1.5 h-2" />
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
