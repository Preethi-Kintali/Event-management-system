import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { WorkflowsService } from "../services/workflows.service";
import { WorkflowExecution } from "../types/workflows.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const columns: Column<WorkflowExecution>[] = [
  {
    key: "workflowName",
    header: "Workflow",
    sortable: true,
    render: (row) => <span className="font-medium">{row.workflowName}</span>,
  },
  {
    key: "triggerEvent",
    header: "Trigger Event",
    sortable: true,
    render: (row) => (
      <code className="text-xs bg-muted/50 px-2 py-1 rounded">{row.triggerEvent}</code>
    ),
  },
  {
    key: "started",
    header: "Started At",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.started}</span>,
  },
  {
    key: "completed",
    header: "Completed At",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.completed}</span>,
  },
  {
    key: "durationMs",
    header: "Duration",
    sortable: true,
    render: (row) => (
      <span className="text-sm">{row.durationMs > 0 ? `${row.durationMs}ms` : "-"}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Successful") statusId = "active";
      if (row.status === "Failed") statusId = "suspended";
      if (row.status === "Cancelled") statusId = "draft";
      return <StatusChip status={statusId as any} />;
    },
  },
  {
    key: "error",
    header: "Error Log",
    sortable: false,
    render: (row) =>
      row.error ? (
        <span
          className="text-[10px] text-destructive max-w-[200px] truncate block"
          title={row.error}
        >
          {row.error}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
  },
];

export function ExecutionsPage() {
  const [data, setData] = useState<WorkflowExecution[]>([]);

  useEffect(() => {
    WorkflowsService.getExecutions().then(setData);
  }, []);

  return (
    <ListPageTemplate<WorkflowExecution>
      title="Execution History"
      description="Audit logs of all automated workflow runs."
      crumbs={[
        { label: "AI & Automation" },
        { label: "Workflows", to: "/workflows" },
        { label: "Executions" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["workflowName", "triggerEvent", "error"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["Successful", "Failed", "Running", "Cancelled"],
      }}
      rowActions={[
        { label: "View Workflow", to: (row) => `/workflows/${row.workflowId}` },
        { label: "Retry Execution", onSelect: () => {} },
      ]}
    />
  );
}
