import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { IntegrationsService } from "../services/integrations.service";
import { Webhook } from "../types/integrations.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const columns: Column<Webhook>[] = [
  {
    key: "name",
    header: "Webhook Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "endpoint",
    header: "Endpoint URL",
    sortable: false,
    render: (row) => (
      <code className="text-[10px] text-muted-foreground truncate max-w-[200px] block">
        {row.endpoint}
      </code>
    ),
  },
  {
    key: "events",
    header: "Events",
    sortable: false,
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.events.map((e) => (
          <Badge key={e} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
            {e}
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
      if (row.status === "Failing") statusId = "suspended";
      if (row.status === "Disabled") statusId = "draft";
      return <StatusChip status={statusId as any} />;
    },
  },
  {
    key: "successRate",
    header: "Delivery Rate",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-24">
        <Progress
          value={row.successRate}
          className={`h-1.5 ${row.successRate < 90 ? "[&>div]:bg-destructive" : ""}`}
        />
        <span className="text-xs">{row.successRate}%</span>
      </div>
    ),
  },
  {
    key: "lastDelivery",
    header: "Last Delivery",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.lastDelivery}</span>,
  },
];

export function WebhooksPage() {
  const [data, setData] = useState<Webhook[]>([]);

  useEffect(() => {
    IntegrationsService.getWebhooks().then(setData);
  }, []);

  return (
    <ListPageTemplate<Webhook>
      title="Webhooks"
      description="Configure HTTP callbacks to receive real-time event notifications."
      crumbs={[
        { label: "System / Admin" },
        { label: "Integrations", to: "/integrations" },
        { label: "Webhooks" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "endpoint"]}
      facet={{ label: "Status", key: "status", options: ["Active", "Failing", "Disabled"] }}
      createLabel="Add Webhook Endpoint"
      rowActions={[
        { label: "Edit Configuration", onSelect: () => {} },
        { label: "View Delivery Logs", onSelect: () => {} },
        { label: "Ping / Test", onSelect: () => {} },
        { label: "Disable", onSelect: () => {} },
      ]}
    />
  );
}
