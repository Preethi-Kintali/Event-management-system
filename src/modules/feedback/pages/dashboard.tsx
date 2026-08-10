import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { FeedbackService } from "../services/feedback.service";
import { FeedbackDashboardSummary } from "../types/feedback.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";

export function FeedbackDashboard() {
  const [summary, setSummary] = useState<FeedbackDashboardSummary | null>(null);

  useEffect(() => {
    FeedbackService.getDashboardSummary().then(setSummary);
  }, []);

  return (
    <>
      <PageHeader
        title="Feedback & Surveys"
        description="Monitor participant sentiment and post-event satisfaction."
        crumbs={[{ label: "Engagement" }, { label: "Feedback" }]}
        actions={
          <Button asChild>
            <Link to="/feedback/surveys/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Survey
            </Link>
          </Button>
        }
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Responses"
            value={summary.totalResponses.toString()}
            delta={5.2}
            index={0}
          />
          <StatCard
            label="Average Rating"
            value={`${summary.averageRating} / 5`}
            progress={(summary.averageRating / 5) * 100}
            index={1}
          />
          <StatCard
            label="Response Rate"
            value={`${summary.responseRate}%`}
            delta={2.1}
            index={2}
          />
          <StatCard
            label="Pending Surveys"
            value={summary.pendingSurveys.toString()}
            hint="Awaiting publication"
            index={3}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Sentiment Distribution" description="Analysis of text comments">
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span className="text-emerald-500">Positive ({summary?.positiveFeedback}%)</span>
                <span>Neutral (8%)</span>
                <span className="text-destructive">Negative ({summary?.negativeFeedback}%)</span>
              </div>
              <div className="h-4 w-full flex rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${summary?.positiveFeedback}%` }}
                />
                <div className="bg-amber-400 h-full" style={{ width: "8%" }} />
                <div
                  className="bg-destructive h-full"
                  style={{ width: `${summary?.negativeFeedback}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-surface p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Top Positive Theme
                </p>
                <p className="font-semibold">Mentorship Quality</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Top Negative Theme
                </p>
                <p className="font-semibold">WiFi Connectivity</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Rating Trend" description="Average score over last 5 events">
          <GroupedBarChart
            data={[
              { event: "Hackthon 24", rating: 4.2 },
              { event: "AI Summit", rating: 4.8 },
              { event: "Design Cup", rating: 4.5 },
              { event: "Web3 Sprint", rating: 4.1 },
              { event: "Cloud Camp", rating: 4.7 },
            ]}
            xKey="event"
            series={[{ key: "rating", label: "Average Rating out of 5" }]}
            height={260}
          />
        </SectionCard>
      </div>
    </>
  );
}
