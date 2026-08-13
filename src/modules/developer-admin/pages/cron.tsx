import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { CronJob } from "../types/developer.types";
import { useDeveloperCron } from "../hooks/developer.hooks";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { PageHeader } from "@/components/ds/page-header";
import { PlayCircle } from "lucide-react";

const columns: Column<CronJob>[] = [
  {
    key: "name",
    header: "Job Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "schedule",
    header: "Schedule (Cron)",
    sortable: false,
    render: (row) => <code className="text-xs bg-muted/50 px-2 py-1 rounded">{row.schedule}</code>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => (
      <Badge
        variant={row.status === "Enabled" ? "default" : "secondary"}
        className={
          row.status === "Enabled"
            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none"
            : ""
        }
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: "lastStatus",
    header: "Last Run Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.lastStatus === "Success") statusId = "active";
      if (row.lastStatus === "Failed") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
  {
    key: "lastRun",
    header: "Last Run",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.lastRun}</span>,
  },
  {
    key: "nextRun",
    header: "Next Run",
    sortable: true,
    render: (row) => <span className="text-xs">{row.nextRun}</span>,
  },
  {
    key: "durationMs",
    header: "Duration",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-muted-foreground">{(row.durationMs / 1000).toFixed(1)}s</span>
    ),
  },
];

export function CronJobsPage() {
  const { data, isLoading } = useDeveloperCron();

  if (isLoading) {
    return <div className="p-8">Loading cron jobs...</div>;
  }

  if (data === null) {
    return (
      <>
        <PageHeader
          title="Cron Jobs"
          description="Manage recurring background tasks and scheduled routines."
          crumbs={[
            { label: "System / Admin" },
            { label: "Developer", to: "/developer" },
            { label: "Cron Jobs" },
          ]}
        />
        <Alert className="mt-8">
          <InfoIcon className="w-4 h-4" />
          <AlertTitle>Scheduler Infrastructure Not Configured</AlertTitle>
          <AlertDescription>
            The Ascent platform is currently operating synchronously. A dedicated cron or scheduled task execution backend is not currently active in this environment.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <ListPageTemplate<CronJob>
      title="Cron Jobs"
      description="Manage recurring background tasks and scheduled routines."
      crumbs={[
        { label: "System / Admin" },
        { label: "Developer", to: "/developer" },
        { label: "Cron Jobs" },
      ]}
      columns={columns}
      rows={data || []}
      searchKeys={["name"]}
      facet={{ label: "Status", key: "status", options: ["Enabled", "Disabled"] }}
      rowActions={[
        { label: "Run Now", onSelect: () => {} },
        { label: "Enable", onSelect: () => {} },
        { label: "Disable", onSelect: () => {} },
        { label: "Edit Schedule", onSelect: () => {} },
      ]}
    />
  );
}
