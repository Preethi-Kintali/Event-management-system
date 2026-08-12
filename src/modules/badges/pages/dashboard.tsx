import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { Timeline } from "@/components/ds/timeline";
import { useBadgesDashboard } from "../services/badges.api";
import { Button } from "@/components/ui/button";
import { Plus, Award } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function BadgesDashboard() {
  const { data: summary, isLoading } = useBadgesDashboard();

  return (
    <>
      <PageHeader
        title="Badges & Achievements"
        description="Gamification and milestone tracking across the platform."
        crumbs={[{ label: "Engagement" }, { label: "Badges" }]}
        actions={
          <Button asChild>
            <Link to="/badges/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Badge
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Total Badges" value={summary.totalBadges?.toString()} index={0} />
          <StatCard
            label="Active Badges"
            value={summary.activeBadges?.toString()}
            progress={summary.totalBadges ? (summary.activeBadges / summary.totalBadges) * 100 : 0}
            index={1}
          />
          <StatCard label="Badges Awarded" value={summary.totalAwards?.toString()} index={2} />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Badge Awards Trend" description="Badges distributed over time">
          <GroupedBarChart
            data={summary?.awardsTrend || []}
            xKey="date"
            series={[{ key: "awarded", label: "Awarded" }]}
            height={260}
          />
        </SectionCard>

        <SectionCard title="Badge Distribution" description="Awards by category">
          <GroupedBarChart
            data={summary?.badgeDistribution || []}
            xKey="category"
            series={[{ key: "count", label: "Badges" }]}
            height={260}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Top Achievers"
          description="Participants with highest XP"
          className="xl:col-span-2"
        >
          <ul className="divide-y divide-border">
            {summary?.topAchievers?.map((achiever: any) => (
              <li key={achiever.user.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{achiever.user.firstName} {achiever.user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{achiever.count} badges earned</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Recent Awards" description="Live platform activity">
          <Timeline
            items={(summary?.recentAwards || []).map((award: any) => ({
              id: award.id,
              title: award.badge?.name,
              detail: `Awarded to ${award.recipient?.firstName} ${award.recipient?.lastName}`,
              time: new Date(award.awardedAt).toLocaleDateString(),
              state: "done"
            }))}
          />
          {(!summary?.recentAwards || summary.recentAwards.length === 0) && (
            <p className="text-center text-sm text-muted-foreground py-4">No recent awards</p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
