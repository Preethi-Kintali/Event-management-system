import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { AIValidationService } from "../services/ai-validation.service";
import { AIValidationRecord } from "../types/ai-validation.types";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const columns: Column<AIValidationRecord>[] = [
  {
    key: "submissionId",
    header: "Submission",
    sortable: true,
    render: (row) => <span className="font-medium">{row.submissionId}</span>,
  },
  { key: "team", header: "Participant/Team", sortable: true },
  { key: "competition", header: "Competition", sortable: true },
  {
    key: "plagiarismScore",
    header: "Plagiarism",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-24">
        <Progress
          value={row.plagiarismScore}
          className={`h-1.5 ${row.plagiarismScore > 30 ? "bg-warning/20 [&>div]:bg-warning" : ""}`}
        />
        <span className="text-xs">{row.plagiarismScore}%</span>
      </div>
    ),
  },
  {
    key: "aiContentScore",
    header: "AI Content",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-24">
        <Progress
          value={row.aiContentScore}
          className={`h-1.5 ${row.aiContentScore > 50 ? "bg-warning/20 [&>div]:bg-warning" : ""}`}
        />
        <span className="text-xs">{row.aiContentScore}%</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
  { key: "createdDate", header: "Scanned On", sortable: true },
];

export function AIValidationQueuePage() {
  const [data, setData] = useState<AIValidationRecord[]>([]);

  useEffect(() => {
    AIValidationService.getValidationQueue().then(setData);
  }, []);

  return (
    <ListPageTemplate<AIValidationRecord>
      title="Validation Queue"
      description="Review flagged submissions and automated validation scores."
      crumbs={[
        { label: "AI & Automation" },
        { label: "AI Validation", to: "/ai-validation" },
        { label: "Queue" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["submissionId", "team", "competition"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["pending", "processing", "passed", "flagged", "failed", "manual_review"],
      }}
      rowActions={[
        { label: "View detailed report", onSelect: () => {} },
        { label: "Send to Manual Review", onSelect: () => {} },
        { label: "Override & Approve", onSelect: () => {} },
      ]}
    />
  );
}
