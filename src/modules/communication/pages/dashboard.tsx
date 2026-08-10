import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { Timeline } from "@/components/ds/timeline";
import { CommunicationService } from "../services/communication.service";
import { CommunicationSummary } from "../types/communication.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CommunicationDashboard() {
  const [summary, setSummary] = useState<CommunicationSummary | null>(null);

  useEffect(() => {
    CommunicationService.getDashboardSummary().then(setSummary);
  }, []);

  return (
    <>
      <PageHeader
        title="Communication Center"
        description="Multi-channel messaging and campaign performance."
        crumbs={[{ label: "Engagement" }, { label: "Communication" }]}
        actions={
          <Button asChild>
            <Link to="/communication/campaigns/new">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Link>
          </Button>
        }
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Messages Sent"
            value={summary.messagesSent.toString()}
            delta={12.4}
            index={0}
          />
          <StatCard
            label="Delivery Rate"
            value={`${Math.round((summary.delivered / summary.messagesSent) * 100)}%`}
            progress={(summary.delivered / summary.messagesSent) * 100}
            index={1}
          />
          <StatCard label="Open Rate" value={`${summary.openRate}%`} delta={4.1} index={2} />
          <StatCard label="Click Rate" value={`${summary.clickRate}%`} delta={-1.2} index={3} />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Campaign Volume" description="Messages delivered over the last week">
          <GroupedBarChart
            data={[
              { date: "10 Sep", email: 12000, sms: 4500, push: 8000 },
              { date: "11 Sep", email: 14000, sms: 5200, push: 9000 },
              { date: "12 Sep", email: 8000, sms: 2100, push: 4000 },
              { date: "13 Sep", email: 22000, sms: 8900, push: 14000 },
              { date: "14 Sep", email: 42500, sms: 12400, push: 21000 },
            ]}
            xKey="date"
            series={[
              { key: "email", label: "Email" },
              { key: "sms", label: "SMS" },
              { key: "push", label: "Push Notification" },
            ]}
            height={260}
            stacked
          />
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Scheduled Campaigns" description="Upcoming broadcasts">
            <ul className="divide-y divide-border">
              <li className="py-3 flex justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Megaphone className="w-4 h-4 text-muted-foreground" />
                  <span>Submission Deadline Warning</span>
                </div>
                <span className="text-muted-foreground">Tomorrow, 12:00 PM</span>
              </li>
            </ul>
          </SectionCard>

          <div className="grid grid-cols-2 gap-4">
            <SectionCard title="Failed Deliveries" description="Last 24 hours" padded={true}>
              <div className="flex flex-col items-center justify-center py-2 text-center">
                <span className="text-3xl font-bold text-destructive">{summary?.failed || 0}</span>
              </div>
            </SectionCard>
            <SectionCard title="Queued Messages" description="Pending dispatch" padded={true}>
              <div className="flex flex-col items-center justify-center py-2 text-center">
                <span className="text-3xl font-bold">{summary?.scheduled || 0}</span>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}
