import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerJudges } from "../hooks/manager.api";

export function ManagerJudgesPage() {
  const { data = [], isLoading } = useManagerJudges();

  return (
    <ListPageTemplate<any>
      title="Managed Judges"
      description="View judges you manage."
      crumbs={[{ label: "Manager" }, { label: "Judges" }]}
      columns={[
        { key: "user", header: "Judge", render: (row) => <span className="font-medium">{row.user ? `${row.user.firstName || ''} ${row.user.lastName || ''}`.trim() : row.userId}</span> },
        { key: "expertise", header: "Expertise", render: (row) => <span>{row.expertise || 'N/A'}</span> },
        { key: "createdAt", header: "Added On", render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["user", "userId"]}
    />
  );
}
