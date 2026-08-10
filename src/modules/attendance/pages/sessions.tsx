import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { AttendanceService } from "../services/attendance.service";
import { SessionAttendance } from "../types/attendance.types";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const columns: Column<SessionAttendance>[] = [
  {
    key: "session",
    header: "Session",
    sortable: true,
    render: (row) => <span className="font-medium">{row.session}</span>,
  },
  { key: "event", header: "Event", sortable: true },
  {
    key: "startTime",
    header: "Start Time",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.startTime}</span>,
  },
  {
    key: "attendanceRate",
    header: "Attendance Rate",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-32">
        <Progress value={row.attendanceRate} className="h-1.5" />
        <span className="text-xs tabular-nums">{row.attendanceRate}%</span>
      </div>
    ),
  },
  {
    key: "present",
    header: "Present",
    sortable: true,
    render: (row) => (
      <span className="tabular-nums">
        {row.present} / {row.participants}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Live") statusId = "active";
      if (row.status === "Completed") statusId = "published";
      if (row.status === "Upcoming") statusId = "draft";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function AttendanceSessionsPage() {
  const [data, setData] = useState<SessionAttendance[]>([]);

  useEffect(() => {
    AttendanceService.getSessions().then(setData);
  }, []);

  return (
    <ListPageTemplate<SessionAttendance>
      title="Session Attendance"
      description="Monitor participation across all scheduled sessions."
      crumbs={[
        { label: "Event Operations" },
        { label: "Attendance", to: "/attendance" },
        { label: "Sessions" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["session", "event"]}
      facet={{ label: "Status", key: "status", options: ["Live", "Upcoming", "Completed"] }}
      rowActions={[
        { label: "View Attendees", onSelect: () => {} },
        { label: "Start Session", onSelect: () => {} },
        { label: "End Session", onSelect: () => {} },
      ]}
    />
  );
}
