import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerReports } from "../hooks/manager.api";

export function ManagerReportsPage() {
  const { data = [], isLoading } = useManagerReports();

  return (
    <ListPageTemplate<any>
      title="Managed Reports"
      description="View reports you manage."
      crumbs={[{ label: "Manager" }, { label: "Reports" }]}
      columns={[
        { key: "name", header: "Report Name", render: (row) => <span className="font-medium">{row.name || 'Untitled'}</span> },
        { key: "type", header: "Type", render: (row) => <span>{row.type || 'N/A'}</span> },
        { key: "createdAt", header: "Generated On", render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["name", "type"]}
    />
  );
}
