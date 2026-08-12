import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart, TrendAreaChart } from "@/components/ds/charts";
import { useAttendanceAnalytics } from "@/modules/analytics/hooks/analytics.hooks";

export const Route = createFileRoute("/analytics/attendance")({
  head: () => ({
    meta: [{ title: "Attendance Analytics · Ascent Platform" }],
  }),
  component: AttendanceAnalyticsPage,
});

function AttendanceAnalyticsPage() {
  const { data, isLoading } = useAttendanceAnalytics();

  if (isLoading || !data) return <div className="p-8">Loading analytics...</div>;

  const { kpis, attendanceBySession, attendanceTrend } = data;

  return (
    <>
      <PageHeader
        title="Attendance Analytics"
        description="Insights on session attendance and check-ins."
        crumbs={[{ label: "Insights" }, { label: "Attendance Analytics" }]}
      />
      
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3 mb-6">
        {[
          { label: "Total Check-Ins", value: kpis.totalCheckIns.toLocaleString() },
          { label: "Total Sessions", value: kpis.totalSessions.toLocaleString() },
          { label: "Average Check-Ins / Session", value: kpis.averagePerSession.toLocaleString() },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Attendance by Session" description="Check-ins per session">
          <GroupedBarChart
            data={attendanceBySession}
            xKey="session"
            series={[{ key: "checkIns", label: "Check-Ins" }]}
            height={300}
          />
        </SectionCard>

        <SectionCard title="Attendance Trend" description="Check-ins over time">
          <TrendAreaChart
            data={attendanceTrend}
            xKey="date"
            series={[{ key: "checkIns", label: "Check-Ins" }]}
            height={300}
          />
        </SectionCard>
      </div>
    </>
  );
}
