import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerEvaluations } from "../hooks/manager.api";

export function ManagerEvaluationsPage() {
  const { data = [], isLoading } = useManagerEvaluations();

  return (
    <ListPageTemplate<any>
      title="Managed Evaluations"
      description="View evaluations you manage."
      crumbs={[{ label: "Manager" }, { label: "Evaluations" }]}
      columns={[
        { key: "judge", header: "Judge ID", render: (row) => <span className="font-medium">{row.judgeId}</span> },
        { key: "submission", header: "Submission ID", render: (row) => <span>{row.submissionId}</span> },
        { key: "score", header: "Score", render: (row) => <span>{row.score !== null ? row.score : 'N/A'}</span> },
        { key: "status", header: "Status", render: (row) => <span>{row.status}</span> },
        { key: "updatedAt", header: "Last Updated", render: (row) => <span>{new Date(row.updatedAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["judgeId", "submissionId"]}
    />
  );
}
