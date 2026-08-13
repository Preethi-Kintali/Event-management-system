import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerTeams } from "../hooks/manager.api";

export function ManagerTeamsPage() {
  const { data = [], isLoading } = useManagerTeams();

  return (
    <ListPageTemplate<any>
      title="Managed Teams"
      description="View teams you manage."
      crumbs={[{ label: "Manager" }, { label: "Teams" }]}
      columns={[
        { key: "name", header: "Team Name", render: (row) => <span className="font-medium">{row.name}</span> },
        { key: "competition", header: "Competition", render: (row) => <span>{row.competition?.name || row.competitionId}</span> },
        { key: "members", header: "Members", render: (row) => <span>{row.members?.length || 0}</span> },
        { key: "createdAt", header: "Created On", render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["name"]}
    />
  );
}
