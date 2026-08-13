import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { QrCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useAttendanceSummary, useAttendanceSessions } from "../services/attendance.api";

export function AttendanceDashboard() {
  const { data: summary, isLoading: summaryLoading } = useAttendanceSummary();
  const { data: sessions = [], isLoading: sessionsLoading } = useAttendanceSessions();

  const isLoading = summaryLoading || sessionsLoading;

  // Build per-session bar chart data from real sessions
  const sessionChartData = sessions.slice(0, 5).map((s) => ({
    session: s.name.length > 16 ? s.name.slice(0, 16) + "…" : s.name,
    total: s._count?.records ?? 0,
  }));

  return (
    <>
      <PageHeader
        title="Attendance Dashboard"
        description="Monitor live check-ins and session participation."
        crumbs={[{ label: "Event Operations" }, { label: "Attendance" }]}
        actions={
          <Button asChild>
            <Link to="/attendance/qr">
              <QrCode className="w-4 h-4 mr-2" />
              Open Scanner
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading attendance data…
        </div>
      ) : (
        <>
          {summary && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Today's Check-ins"
                value={summary.todaysAttendance.toString()}
                progress={summary.attendanceRate}
                index={0}
              />
              <StatCard label="Present" value={summary.present.toString()} delta={0} index={1} />
              <StatCard label="Absent" value={summary.absent.toString()} delta={0} index={2} />
              <StatCard
                label="Late Check-ins"
                value={summary.late.toString()}
                hint="After session start"
                index={3}
              />
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard title="Session Attendance" description="Check-ins per session">
              {sessionChartData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6">
                  No sessions recorded yet. Create attendance sessions to start tracking.
                </p>
              ) : (
                <GroupedBarChart
                  data={sessionChartData}
                  xKey="session"
                  series={[{ key: "total", label: "Check-ins" }]}
                  height={260}
                />
              )}
            </SectionCard>

            <SectionCard title="Sessions Overview" description={`${sessions.length} sessions`}>
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6">No sessions scheduled yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {sessions.slice(0, 5).map((s) => (
                    <li key={s.id} className="flex items-center justify-between py-3 px-1">
                      <div>
                        <p className="text-sm font-medium truncate max-w-[180px]">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.event?.name ?? "—"}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            s.status === "LIVE"
                              ? "bg-green-500/10 text-green-600"
                              : s.status === "COMPLETED"
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {s.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {s._count?.records ?? 0} check-ins
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>
        </>
      )}
    </>
  );
}
