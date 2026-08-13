import { ListPageTemplate } from "@/components/templates/list-page";
import { useMySubmissions } from "../hooks/participant.api";

export function ParticipantSubmissionsPage() {
  const { data = [], isLoading } = useMySubmissions();

  return (
    <ListPageTemplate<any>
      title="My Submissions"
      description="View your submissions."
      crumbs={[{ label: "Participant" }, { label: "Submissions" }]}
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
