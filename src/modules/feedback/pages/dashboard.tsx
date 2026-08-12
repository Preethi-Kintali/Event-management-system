import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { useSurveys, useFeedbackDashboard } from "../hooks/feedback.api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FeedbackDashboard() {
  const { data: surveys = [], isLoading: loadingSurveys } = useSurveys();
  const { data: stats, isLoading: loadingStats } = useFeedbackDashboard();

  const positiveFeedback = stats?.positiveSentiment || 0;
  const negativeFeedback = stats?.totalResponses > 0 ? 100 - positiveFeedback - 8 : 0;

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Responses"
          value={stats?.totalResponses?.toString() || "0"}
          delta={5.2}
          index={0}
        />
        <StatCard
          label="Average Rating"
          value={`${stats?.averageSatisfaction || 0} / 5`}
          progress={((stats?.averageSatisfaction || 0) / 5) * 100}
          index={1}
        />
        <StatCard
          label="Positive Sentiment"
          value={`${stats?.positiveSentiment || 0}%`}
          delta={2.1}
          index={2}
        />
        <StatCard
          label="Actionable Insights"
          value={stats?.actionableInsights?.toString() || "0"}
          hint="From comments"
          index={3}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2 mt-6">
        <SectionCard title="Sentiment Distribution" description="Analysis of text comments">
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span className="text-emerald-500">Positive ({positiveFeedback}%)</span>
                <span>Neutral (8%)</span>
                <span className="text-destructive">Negative ({negativeFeedback}%)</span>
              </div>
              <div className="h-4 w-full flex rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${positiveFeedback}%` }}
                />
                <div className="bg-amber-400 h-full" style={{ width: "8%" }} />
                <div
                  className="bg-destructive h-full"
                  style={{ width: `${negativeFeedback}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-surface p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Top Positive Theme
                </p>
                <p className="font-semibold">{stats?.topPositiveTheme || "N/A"}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Top Negative Theme
                </p>
                <p className="font-semibold">{stats?.topNegativeTheme || "N/A"}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Rating Trend" description="Average score over last 5 events">
          <GroupedBarChart
            data={stats?.ratingTrend || []}
            xKey="event"
            series={[{ key: "rating", label: "Average Rating out of 5" }]}
            height={260}
          />
        </SectionCard>
      </div>
    </>
  );
}

