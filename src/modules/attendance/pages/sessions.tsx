import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useAttendanceSessions, ApiAttendanceSession } from "../services/attendance.api";

type SessionRow = ApiAttendanceSession & {
  _present: number;
  _participants: number;
  _rate: number;
};

const columns: Column<SessionRow>[] = [
  {
    key: "name" as any,
    header: "Session",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "event" as any,
    header: "Event",
    sortable: true,
    render: (row) => <span>{row.event?.name ?? "—"}</span>,
  },
  {
    key: "startTime" as any,
    header: "Start Time",
    sortable: true,
    render: (row) => (
      <span className="tabular-nums text-sm">
        {new Date(row.startTime).toLocaleString()}
      </span>
    ),
  },
  {
    key: "_rate" as any,
    header: "Attendance Rate",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-32">
        <Progress value={row._rate} className="h-1.5" />
        <span className="text-xs tabular-nums">{row._rate}%</span>
      </div>
    ),
  },
  {
    key: "_present" as any,
    header: "Check-ins",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row._present}</span>,
  },
  {
    key: "status" as any,
    header: "Status",
    sortable: true,
    render: (row) => {
      const statusMap: Record<string, string> = {
        LIVE: "active",
        COMPLETED: "published",
        UPCOMING: "draft",
        CANCELLED: "suspended",
      };
      return <StatusChip status={(statusMap[row.status] ?? "pending") as any} />;
    },
  },
];

export function AttendanceSessionsPage() {
  const { data: sessions = [], isLoading, error } = useAttendanceSessions();

  if (isLoading)
    return (
      <div className="flex items-center gap-2 py-10 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading sessions…
      </div>
    );

  if (error)
    return (
      <p className="py-10 text-sm text-destructive">
        Failed to load sessions.
      </p>
    );

  const rows: SessionRow[] = sessions.map((s) => ({
    ...s,
    _present: s._count?.records ?? 0,
    _participants: s._count?.records ?? 0,
    _rate: 0, // Rate not computable without total capacity; keeping 0 until capacity field added
  }));

  return (
    <ListPageTemplate<SessionRow>
      title="Session Attendance"
      description="Monitor participation across all scheduled sessions."
      crumbs={[
        { label: "Event Operations" },
        { label: "Attendance", to: "/attendance" },
        { label: "Sessions" },
      ]}
      columns={columns}
      rows={rows}
      searchKeys={["name", "event"] as any}
      facet={{
        label: "Status",
        key: "status" as any,
        options: ["LIVE", "UPCOMING", "COMPLETED", "CANCELLED"],
      }}
      rowActions={[
        { label: "View Attendees", onSelect: () => {} },
        { label: "Start Session", onSelect: () => {} },
        { label: "End Session", onSelect: () => {} },
      ]}
    />
  );
}
