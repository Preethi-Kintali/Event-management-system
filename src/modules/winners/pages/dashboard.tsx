import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { Timeline } from "@/components/ds/timeline";
import { WinnersService } from "../services/winners.service";
import { WinnerDashboardSummary } from "../types/winners.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Gift } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function WinnersDashboard() {
  const [summary, setSummary] = useState<WinnerDashboardSummary | null>(null);

  useEffect(() => {
    WinnersService.getDashboardSummary().then(setSummary);
  }, []);

  return (
    <>
      <PageHeader
        title="Winner Management"
        description="Competition outcomes and prize distribution tracking."
        crumbs={[{ label: "Engagement" }, { label: "Winners" }]}
        actions={
          <Button asChild>
            <Link to="/winners/selection">
              <Plus className="w-4 h-4 mr-2" />
              Select Winners
            </Link>
          </Button>
        }
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Winners"
            value={summary.totalWinners.toString()}
            delta={4.2}
            index={0}
          />
          <StatCard
            label="Prizes Distributed"
            value={summary.prizesDistributed}
            hint={`${summary.pendingPrizes} pending`}
            index={1}
          />
          <StatCard
            label="Active Competitions"
            value={summary.activeCompetitions.toString()}
            index={2}
          />
          <StatCard
            label="Certificates Issued"
            value={summary.certificatesIssued.toString()}
            index={3}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Winners by Organization" description="Top performing groups">
          <GroupedBarChart
            data={[
              { org: "Northwind University", winners: 42 },
              { org: "Global Tech Inst.", winners: 38 },
              { org: "Acme Corp", winners: 24 },
              { org: "Open Source Init.", winners: 18 },
            ]}
            xKey="org"
            series={[{ key: "winners", label: "Winners" }]}
            height={260}
          />
        </SectionCard>

        <SectionCard title="Pending Prize Distributions" description="Action required">
          <ul className="divide-y divide-border">
            {[
              {
                name: "Meera Subramanian",
                prize: "$10,000 Cash",
                comp: "Impact Business Model Case",
              },
              { name: "Aditya Rao", prize: "₹2,00,000 Grant", comp: "Campus Robotics Sprint" },
              { name: "Team CyberSec", prize: "Premium Subscriptions", comp: "Global Hackathon" },
            ].map((pending) => (
              <li key={pending.name} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-destructive/10 text-destructive p-2 rounded-full">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{pending.name}</p>
                    <p className="text-xs text-muted-foreground">{pending.comp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-foreground">{pending.prize}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                    Process
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
