import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerSubmissions } from "../hooks/manager.api";

export function ManagerSubmissionsPage() {
  const { data = [], isLoading } = useManagerSubmissions();

  return (
    <ListPageTemplate<any>
      title="Managed Submissions"
      description="View submissions you manage."
      crumbs={[{ label: "Manager" }, { label: "Submissions" }]}
      columns={[
        { key: "title", header: "Title", render: (row) => <span className="font-medium">{row.title || 'Untitled'}</span> },
        { key: "team", header: "Team", render: (row) => <span>{row.team?.name || row.teamId}</span> },
        { key: "status", header: "Status", render: (row) => <span>{row.status}</span> },
        { key: "updatedAt", header: "Last Updated", render: (row) => <span>{new Date(row.updatedAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["title", "teamId"]}
    />
  );
}
