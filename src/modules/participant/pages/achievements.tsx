import { ListPageTemplate } from "@/components/templates/list-page";
import { useMyAchievements } from "../hooks/participant.api";

export function ParticipantAchievementsPage() {
  const { data = [], isLoading } = useMyAchievements();

  return (
    <ListPageTemplate<any>
      title="My Achievements"
      description="View your achievements."
      crumbs={[{ label: "Participant" }, { label: "Achievements" }]}
      columns={[
        { key: "title", header: "Title", render: (row) => <span className="font-medium">{row.title || row.badge?.name || 'Achievement'}</span> },
        { key: "description", header: "Description", render: (row) => <span>{row.description || row.badge?.description || 'N/A'}</span> },
        { key: "earnedAt", header: "Earned On", render: (row) => <span>{new Date(row.earnedAt || row.createdAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["title"]}
    />
  );
}
