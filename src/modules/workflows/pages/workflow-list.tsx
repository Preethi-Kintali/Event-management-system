import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { WorkflowsService } from "../services/workflows.service";
import { Workflow } from "../types/workflows.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const columns: Column<Workflow>[] = [
  {
    key: "name",
    header: "Workflow Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "trigger",
    header: "Trigger",
    sortable: true,
    render: (row) => <span className="text-sm">{row.trigger}</span>,
  },
  {
    key: "actions",
    header: "Actions",
    sortable: false,
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.actions.map((a, i) => (
          <Badge key={i} variant="secondary" className="font-normal text-[10px] py-0">
            {a}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Active") statusId = "active";
      if (row.status === "Paused") statusId = "draft";
      if (row.status === "Failed") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
  {
    key: "successRate",
    header: "Success Rate",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-20">
        <Progress
          value={row.successRate}
          className={`h-1.5 ${row.successRate < 90 ? "[&>div]:bg-destructive" : ""}`}
        />
        <span className="text-xs">{row.successRate}%</span>
      </div>
    ),
  },
  {
    key: "executions",
    header: "Runs",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.executions.toLocaleString()}</span>,
  },
  {
    key: "lastRun",
    header: "Last Run",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.lastRun}</span>,
  },
];

export function WorkflowListPage() {
  const [data, setData] = useState<Workflow[]>([]);

  useEffect(() => {
    WorkflowsService.getWorkflows().then(setData);
  }, []);

  return (
    <ListPageTemplate<Workflow>
      title="Workflows"
      description="Manage all automated rules and trigger conditions."
      crumbs={[
        { label: "AI & Automation" },
        { label: "Workflows", to: "/workflows" },
        { label: "Rules" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "trigger", "createdBy"]}
      facet={{ label: "Status", key: "status", options: ["Active", "Paused", "Draft", "Failed"] }}
      createLabel="Create Workflow"
      createTo="/workflows/new"
      rowActions={[
        { label: "Edit Workflow", onSelect: () => {} },
        { label: "View History", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Pause Rule", onSelect: () => {} },
        { label: "Delete", onSelect: () => {} },
      ]}
    />
  );
}
