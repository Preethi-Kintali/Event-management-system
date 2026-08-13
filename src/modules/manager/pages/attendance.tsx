import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerAttendance } from "../hooks/manager.api";

export function ManagerAttendancePage() {
  const { data = [], isLoading } = useManagerAttendance();

  return (
    <ListPageTemplate<any>
      title="Managed Attendance"
      description="View attendance you manage."
      crumbs={[{ label: "Manager" }, { label: "Attendance" }]}
      columns={[
        { key: "user", header: "User", render: (row) => <span className="font-medium">{row.user ? `${row.user.firstName || ''} ${row.user.lastName || ''}`.trim() : row.userId}</span> },
        { key: "session", header: "Session", render: (row) => <span>{row.session?.title || row.sessionId}</span> },
        { key: "checkInTime", header: "Checked In", render: (row) => <span>{new Date(row.checkInTime).toLocaleString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["userId", "sessionId"]}
    />
  );
}
