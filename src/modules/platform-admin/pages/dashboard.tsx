import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { Timeline } from "@/components/ds/timeline";
import { Button } from "@/components/ui/button";
import { revenueByPlan, registrationTrend, timeline } from "@/lib/mock-data";
import { Settings } from "lucide-react";

export function PlatformAdminDashboard() {
  return (
    <>
      <PageHeader
        title="Platform Administration"
        description="Global metrics and system health for the Ascent Platform."
        crumbs={[{ label: "Platform" }, { label: "Dashboard" }]}
        actions={
          <Button variant="outline">
            <Settings className="w-4 h-4" />
            System settings
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Organizations", value: "8", delta: 12.5 },
          { label: "Active Organizations", value: "5", progress: 62 },
          { label: "Total Users", value: "32,450", delta: 8.4 },
          { label: "Active Events", value: "64", hint: "Currently running" },
          { label: "Platform Revenue", value: "$1.4M", delta: 24.1 },
          { label: "Subscription Revenue", value: "$107,100", delta: 5.2 },
          { label: "Storage Usage", value: "12.4 TB", progress: 45 },
          { label: "API Usage", value: "4.2M reqs", delta: -2.1 },
        ].map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Revenue Trend" description="Monthly recurring revenue by plan">
          <GroupedBarChart
            data={registrationTrend.map((d) => ({ ...d, revenue: d.revenue / 1000 }))}
            xKey="month"
            series={[{ key: "revenue", label: "Revenue (k$)" }]}
            height={260}
          />
        </SectionCard>

        <SectionCard title="Organization Growth" description="New organizations onboarded">
          <GroupedBarChart
            data={registrationTrend}
            xKey="month"
            series={[{ key: "registrations", label: "Registrations" }]}
            height={260}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Recent Activity"
          description="Global platform events"
          className="xl:col-span-2"
        >
          <Timeline items={timeline} />
        </SectionCard>

        <SectionCard title="Subscription Expirations" description="Upcoming renewals">
          <ul className="divide-y divide-border">
            <li className="py-3 flex justify-between text-sm">
              <span>Contoso Innovation Labs</span>
              <span className="text-warning">In 12 days</span>
            </li>
            <li className="py-3 flex justify-between text-sm">
              <span>Fabrikam Foundation</span>
              <span className="text-muted-foreground">In 45 days</span>
            </li>
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
