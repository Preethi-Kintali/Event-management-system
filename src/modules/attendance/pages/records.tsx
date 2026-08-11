import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useAttendanceRecords, ApiAttendanceRecord } from "../services/attendance.api";

type RecordRow = ApiAttendanceRecord & { _name: string; _event: string; _session: string };

const columns: Column<RecordRow>[] = [
  {
    key: "_name" as any,
    header: "Participant",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium">{row._name}</p>
        <p className="text-xs text-muted-foreground">{row.user?.email ?? "—"}</p>
      </div>
    ),
  },
  {
    key: "_event" as any,
    header: "Event",
    sortable: true,
  },
  {
    key: "_session" as any,
    header: "Session",
    sortable: true,
  },
  {
    key: "checkInTime" as any,
    header: "Check In",
    sortable: true,
    render: (row) => (
      <span className="tabular-nums text-sm">
        {new Date(row.checkInTime).toLocaleTimeString()}
      </span>
    ),
  },
  {
    key: "checkOutTime" as any,
    header: "Check Out",
    sortable: true,
    render: (row) => (
      <span className="tabular-nums text-sm">
        {row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString() : "—"}
      </span>
    ),
  },
  {
    key: "method" as any,
    header: "Method",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.method}</Badge>,
  },
  {
    key: "status" as any,
    header: "Status",
    sortable: true,
    render: (row) => {
      const statusMap: Record<string, string> = {
        PRESENT: "active",
        ABSENT: "suspended",
        LATE: "draft",
        EXCUSED: "pending",
      };
      return <StatusChip status={(statusMap[row.status] ?? "pending") as any} />;
    },
  },
];

export function AttendanceRecordsPage() {
  const { data: records = [], isLoading, error } = useAttendanceRecords();

  if (isLoading)
    return (
      <div className="flex items-center gap-2 py-10 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading records…
      </div>
    );

  if (error)
    return (
      <p className="py-10 text-sm text-destructive">
        Failed to load attendance records.
      </p>
    );

  const rows: RecordRow[] = records.map((r) => ({
    ...r,
    _name: r.user
      ? `${r.user.firstName ?? ""} ${r.user.lastName ?? ""}`.trim() || r.user.email
      : r.userId,
    _event: r.session?.event?.name ?? "—",
    _session: r.session?.name ?? "—",
  }));

  return (
    <ListPageTemplate<RecordRow>
      title="Attendance Records"
      description="Scan history and manual check-ins across all sessions."
      crumbs={[
        { label: "Event Operations" },
        { label: "Attendance", to: "/attendance" },
        { label: "Records" },
      ]}
      columns={columns}
      rows={rows}
      searchKeys={["_name", "_event", "_session"] as any}
      facet={{
        label: "Status",
        key: "status" as any,
        options: ["PRESENT", "LATE", "ABSENT", "EXCUSED"],
      }}
      rowActions={[
        { label: "View Details", onSelect: () => {} },
        { label: "Mark Excused", onSelect: () => {} },
      ]}
    />
  );
}
