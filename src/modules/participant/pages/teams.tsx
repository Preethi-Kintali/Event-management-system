import { ListPageTemplate } from "@/components/templates/list-page";
import { useMyTeams } from "../hooks/participant.api";

export function ParticipantTeamsPage() {
  const { data = [], isLoading } = useMyTeams();

  return (
    <ListPageTemplate<any>
      title="My Teams"
      description="View your teams."
      crumbs={[{ label: "Participant" }, { label: "Teams" }]}
      columns={[
        { key: "name", header: "Team Name", render: (row) => <span className="font-medium">{row.team?.name || 'Unknown'}</span> },
        { key: "competition", header: "Competition", render: (row) => <span>{row.team?.competition?.name || row.team?.competitionId}</span> },
        { key: "role", header: "Your Role", render: (row) => <span>{row.role}</span> },
        { key: "members", header: "Members", render: (row) => <span>{row.team?.members?.length || 0}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["name"]}
    />
  );
}
