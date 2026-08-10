import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { Timeline } from "@/components/ds/timeline";
import { BadgesService } from "../services/badges.service";
import { BadgeDashboardSummary } from "../types/badges.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Award } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function BadgesDashboard() {
  const [summary, setSummary] = useState<BadgeDashboardSummary | null>(null);

  useEffect(() => {
    BadgesService.getDashboardSummary().then(setSummary);
  }, []);

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

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Badges" value={summary.totalBadges.toString()} index={0} />
          <StatCard
            label="Active Badges"
            value={summary.activeBadges.toString()}
            progress={(summary.activeBadges / summary.totalBadges) * 100}
            index={1}
          />
          <StatCard label="Badges Awarded" value="14.2k" delta={12.4} index={2} />
          <StatCard
            label="Participants With Badges"
            value="8.4k"
            hint={`Most popular: ${summary.popularBadge}`}
            index={3}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Badge Awards Trend" description="Badges distributed over time">
          <GroupedBarChart
            data={[
              { date: "Jan", awarded: 1200 },
              { date: "Feb", awarded: 2100 },
              { date: "Mar", awarded: 1800 },
              { date: "Apr", awarded: 3400 },
              { date: "May", awarded: 4200 },
            ]}
            xKey="date"
            series={[{ key: "awarded", label: "Awarded" }]}
            height={260}
          />
        </SectionCard>

        <SectionCard title="Badge Distribution" description="Awards by category">
          <GroupedBarChart
            data={[
              { category: "Participation", count: 8400 },
              { category: "Achievement", count: 3200 },
              { category: "Teamwork", count: 1800 },
              { category: "Innovation", count: 650 },
              { category: "Leadership", count: 200 },
            ]}
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
            {[
              { name: "Rhea Kapoor", xp: "14,250 XP", level: "Diamond", badges: 14 },
              { name: "Lukas Weber", xp: "12,100 XP", level: "Platinum", badges: 12 },
              { name: "Amara Diallo", xp: "9,850 XP", level: "Gold", badges: 9 },
            ].map((user) => (
              <li key={user.name} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.badges} badges earned</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{user.xp}</p>
                  <p className="text-xs text-muted-foreground">Level: {user.level}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Recent Awards" description="Live platform activity">
          <Timeline
            items={[
              {
                id: "1",
                title: "Early Adopter awarded",
                detail: "To Jonas Lind",
                time: "2 mins ago",
                state: "done",
              },
              {
                id: "2",
                title: "Bug Smasher awarded",
                detail: "To Team Neural Nomads",
                time: "1 hour ago",
                state: "done",
              },
              {
                id: "3",
                title: "Innovation Champion awarded",
                detail: "To Meera Subramanian",
                time: "3 hours ago",
                state: "done",
              },
            ]}
          />
        </SectionCard>
      </div>
    </>
  );
}
