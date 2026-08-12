import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { Timeline } from "@/components/ds/timeline";
import { useWinnersDashboard } from "../services/winners.api";
import { Button } from "@/components/ui/button";
import { Plus, Gift } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function WinnersDashboard() {
  const { data: summary, isLoading } = useWinnersDashboard();

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

      {isLoading ? (
        <div>Loading...</div>
      ) : summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Total Winners"
            value={summary.totalWinners.toString()}
            delta={4.2}
            index={0}
          />
          <StatCard
            label="Finalized Competitions"
            value={summary.finalizedCompetitions.toString()}
            index={1}
          />
          <StatCard
            label="Pending Prize Value"
            value={`₹${summary.pendingPrizeValue.toLocaleString()}`}
            index={2}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Winners by Organization" description="Top performing groups">
          <GroupedBarChart
            data={summary?.winnersByOrganization || []}
            xKey="org"
            series={[{ key: "winners", label: "Winners" }]}
            height={260}
          />
        </SectionCard>

        <SectionCard title="Pending Prize Distributions" description="Action required">
          <ul className="divide-y divide-border">
            {(summary?.pendingPrizes || []).map((pending: any) => (
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
            {(!summary?.pendingPrizes || summary.pendingPrizes.length === 0) && (
              <li className="py-4 text-center text-sm text-muted-foreground">No pending prizes</li>
            )}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
