import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerVolunteers } from "../hooks/manager.api";

export function ManagerVolunteersPage() {
  const { data = [], isLoading } = useManagerVolunteers();

  return (
    <ListPageTemplate<any>
      title="Managed Volunteers"
      description="View volunteers you manage."
      crumbs={[{ label: "Manager" }, { label: "Volunteers" }]}
      columns={[
        { key: "user", header: "Volunteer", render: (row) => <span className="font-medium">{row.user ? `${row.user.firstName || ''} ${row.user.lastName || ''}`.trim() : row.userId}</span> },
        { key: "role", header: "Role", render: (row) => <span>{row.role || 'N/A'}</span> },
        { key: "createdAt", header: "Added On", render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["user", "userId"]}
    />
  );
}
