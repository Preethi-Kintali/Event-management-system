import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { IntegrationsService } from "../services/integrations.service";
import { ApiKey } from "../types/integrations.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<ApiKey>[] = [
  {
    key: "name",
    header: "Key Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "maskedKey",
    header: "Secret Key",
    sortable: false,
    render: (row) => <code className="text-xs bg-muted/50 px-2 py-1 rounded">{row.maskedKey}</code>,
  },
  {
    key: "environment",
    header: "Environment",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.environment}</Badge>,
  },
  { key: "createdBy", header: "Created By", sortable: true },
  {
    key: "createdDate",
    header: "Created On",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.createdDate}</span>,
  },
  {
    key: "lastUsed",
    header: "Last Used",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.lastUsed}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Active") statusId = "active";
      if (row.status === "Revoked") statusId = "suspended";
      if (row.status === "Expired") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
  {
    key: "expiry",
    header: "Expires",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.expiry}</span>,
  },
];

export function ApiKeysPage() {
  const [data, setData] = useState<ApiKey[]>([]);

  useEffect(() => {
    IntegrationsService.getApiKeys().then(setData);
  }, []);

  return (
    <ListPageTemplate<ApiKey>
      title="API Keys"
      description="Manage access credentials for the platform's public API."
      crumbs={[
        { label: "System / Admin" },
        { label: "Integrations", to: "/integrations" },
        { label: "API Keys" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "createdBy"]}
      facet={{
        label: "Environment",
        key: "environment",
        options: ["Production", "Staging", "Development"],
      }}
      createLabel="Generate New Key"
      rowActions={[
        { label: "View Details", onSelect: () => {} },
        { label: "Rotate Key", onSelect: () => {} },
        { label: "Revoke Access", onSelect: () => {} },
      ]}
    />
  );
}
