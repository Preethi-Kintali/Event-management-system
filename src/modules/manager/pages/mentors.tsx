import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerMentors } from "../hooks/manager.api";

export function ManagerMentorsPage() {
  const { data = [], isLoading } = useManagerMentors();

  return (
    <ListPageTemplate<any>
      title="Managed Mentors"
      description="View mentors you manage."
      crumbs={[{ label: "Manager" }, { label: "Mentors" }]}
      columns={[
        { key: "user", header: "Mentor", render: (row) => <span className="font-medium">{row.user ? `${row.user.firstName || ''} ${row.user.lastName || ''}`.trim() : row.userId}</span> },
        { key: "expertise", header: "Expertise", render: (row) => <span>{row.expertise || 'N/A'}</span> },
        { key: "createdAt", header: "Added On", render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["user", "userId"]}
    />
  );
}
