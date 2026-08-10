import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { AttendanceService } from "../services/attendance.service";
import { AttendanceSummary } from "../types/attendance.types";
import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AttendanceDashboard() {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);

  useEffect(() => {
    AttendanceService.getDashboardSummary().then(setSummary);
  }, []);

  return (
    <>
      <PageHeader
        title="Attendance Dashboard"
        description="Monitor live check-ins and session participation."
        crumbs={[{ label: "Event Operations" }, { label: "Attendance" }]}
        actions={
          <Button>
            <QrCode className="w-4 h-4 mr-2" />
            Open Scanner
          </Button>
        }
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Today's Attendance"
            value={summary.todaysAttendance.toString()}
            progress={summary.attendanceRate}
            index={0}
          />
          <StatCard label="Present" value={summary.present.toString()} delta={5.2} index={1} />
          <StatCard label="Absent" value={summary.absent.toString()} delta={-2.1} index={2} />
          <StatCard
            label="Late Check-ins"
            value={summary.late.toString()}
            hint="After session start"
            index={3}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Daily Attendance" description="Check-ins over the last 5 days">
          <GroupedBarChart
            data={[
              { date: "10 Sep", present: 420, absent: 80 },
              { date: "11 Sep", present: 840, absent: 160 },
              { date: "12 Sep", present: 1120, absent: 140 },
              { date: "13 Sep", present: 1680, absent: 220 },
              { date: "14 Sep", present: 1420, absent: 480 },
            ]}
            xKey="date"
            series={[
              { key: "present", label: "Present" },
              { key: "absent", label: "Absent" },
            ]}
            height={260}
            stacked
          />
        </SectionCard>

        <SectionCard title="Session Attendance Rate" description="Top sessions by participation">
          <GroupedBarChart
            data={[
              { session: "Keynote", rate: 95 },
              { session: "Workshop A", rate: 82 },
              { session: "Workshop B", rate: 78 },
              { session: "Judging", rate: 100 },
              { session: "Ceremony", rate: 92 },
            ]}
            xKey="session"
            series={[{ key: "rate", label: "Attendance %" }]}
            height={260}
          />
        </SectionCard>
      </div>
    </>
  );
}
