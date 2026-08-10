import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { AttendanceService } from "../services/attendance.service";
import { AttendanceRecord } from "../types/attendance.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<AttendanceRecord>[] = [
  {
    key: "participant",
    header: "Participant",
    sortable: true,
    render: (row) => <span className="font-medium">{row.participant}</span>,
  },
  { key: "event", header: "Event", sortable: true },
  { key: "session", header: "Session", sortable: true },
  {
    key: "checkInTime",
    header: "Check In",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.checkInTime}</span>,
  },
  {
    key: "checkOutTime",
    header: "Check Out",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.checkOutTime || "—"}</span>,
  },
  {
    key: "method",
    header: "Method",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.method}</Badge>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Present") statusId = "active";
      if (row.status === "Absent") statusId = "suspended";
      if (row.status === "Late") statusId = "draft";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function AttendanceRecordsPage() {
  const [data, setData] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    AttendanceService.getRecords().then(setData);
  }, []);

  return (
    <ListPageTemplate<AttendanceRecord>
      title="Attendance Records"
      description="Scan history and manual check-ins across all sessions."
      crumbs={[
        { label: "Event Operations" },
        { label: "Attendance", to: "/attendance" },
        { label: "Records" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["participant", "event", "session"]}
      facet={{ label: "Status", key: "status", options: ["Present", "Late", "Absent", "Excused"] }}
      rowActions={[
        { label: "View Details", onSelect: () => {} },
        { label: "Mark Excused", onSelect: () => {} },
      ]}
    />
  );
}
