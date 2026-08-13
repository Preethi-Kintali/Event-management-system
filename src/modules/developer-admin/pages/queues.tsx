import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { Queue } from "../types/developer.types";
import { useDeveloperQueues } from "../hooks/developer.hooks";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { PageHeader } from "@/components/ds/page-header";

const columns: Column<Queue>[] = [
  {
    key: "name",
    header: "Queue Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "pending",
    header: "Pending Jobs",
    sortable: true,
    render: (row) => (
      <span className={`tabular-nums ${row.pending > 1000 ? "text-amber-500 font-medium" : ""}`}>
        {row.pending.toLocaleString()}
      </span>
    ),
  },
  {
    key: "processing",
    header: "Processing",
    sortable: true,
    render: (row) => <span className="tabular-nums text-muted-foreground">{row.processing}</span>,
  },
  {
    key: "failed",
    header: "Failed",
    sortable: true,
    render: (row) => (
      <span className={`tabular-nums ${row.failed > 0 ? "text-destructive font-medium" : ""}`}>
        {row.failed}
      </span>
    ),
  },
  {
    key: "throughput",
    header: "Throughput (msg/s)",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-24">
        <Progress value={Math.min((row.throughput / 50) * 100, 100)} className="h-1.5" />
        <span className="text-xs tabular-nums">{row.throughput}</span>
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
      if (row.status === "Backlog") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function QueuesPage() {
  const { data, isLoading } = useDeveloperQueues();

  if (isLoading) {
    return <div className="p-8">Loading queues...</div>;
  }

  if (data === null) {
    return (
      <>
        <PageHeader
          title="Background Queues"
          description="Monitor asynchronous job processing and worker throughput."
          crumbs={[
            { label: "System / Admin" },
            { label: "Developer", to: "/developer" },
            { label: "Queues" },
          ]}
        />
        <Alert className="mt-8">
          <InfoIcon className="w-4 h-4" />
          <AlertTitle>Queue Infrastructure Not Configured</AlertTitle>
          <AlertDescription>
            The Ascent platform is currently operating synchronously or using lightweight in-memory processing. A dedicated queue backend (such as Redis/BullMQ) is not currently active in this environment.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <ListPageTemplate<Queue>
      title="Background Queues"
      description="Monitor asynchronous job processing and worker throughput."
      crumbs={[
        { label: "System / Admin" },
        { label: "Developer", to: "/developer" },
        { label: "Queues" },
      ]}
      columns={columns}
      rows={data || []}
      searchKeys={["name"]}
      facet={{ label: "Status", key: "status", options: ["Active", "Paused", "Backlog"] }}
      rowActions={[
        { label: "Retry Failed Jobs", onSelect: () => {} },
        { label: "Pause Queue", onSelect: () => {} },
        { label: "Resume Queue", onSelect: () => {} },
        { label: "Purge Queue", onSelect: () => {} },
      ]}
    />
  );
}
