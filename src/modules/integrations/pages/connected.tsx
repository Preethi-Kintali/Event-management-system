import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { IntegrationsService } from "../services/integrations.service";
import { IntegrationConnection } from "../types/integrations.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<IntegrationConnection>[] = [
  {
    key: "name",
    header: "Integration",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.category}</Badge>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Connected") statusId = "published";
      if (row.status === "Disconnected") statusId = "draft";
      if (row.status === "Error") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
  { key: "connectedBy", header: "Connected By", sortable: true },
  {
    key: "connectedDate",
    header: "Connected Date",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.connectedDate}</span>,
  },
  {
    key: "lastSync",
    header: "Last Sync",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.lastSync}</span>,
  },
  {
    key: "apiUsage",
    header: "API Usage",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.apiUsage.toLocaleString()}</span>,
  },
];

export function ConnectedIntegrationsPage() {
  const [data, setData] = useState<IntegrationConnection[]>([]);

  useEffect(() => {
    IntegrationsService.getConnected().then(setData);
  }, []);

  return (
    <ListPageTemplate<IntegrationConnection>
      title="Connected Integrations"
      description="Manage active third-party connections and sync status."
      crumbs={[
        { label: "System / Admin" },
        { label: "Integrations", to: "/integrations" },
        { label: "Connected" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "category", "connectedBy"]}
      facet={{ label: "Status", key: "status", options: ["Connected", "Disconnected", "Error"] }}
      createLabel="Add Integration"
      createTo="/integrations/marketplace"
      rowActions={[
        { label: "Configure", onSelect: () => {} },
        { label: "Test Connection", onSelect: () => {} },
        { label: "View Logs", onSelect: () => {} },
        { label: "Disconnect", onSelect: () => {} },
      ]}
    />
  );
}
