import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

import { ApiKey as DevApiKey } from "../types/developer.types";

const columns: Column<DevApiKey>[] = [
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

  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleDateString()}</span>,
  },
  {
    key: "lastUsed",
    header: "Last Used",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.lastUsed ? new Date(row.lastUsed).toLocaleDateString() : 'Never'}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      return <StatusChip status={row.status === "Active" ? "active" : "suspended"} />;
    },
  },
  {
    key: "expiry",
    header: "Expires",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.expiry ? new Date(row.expiry).toLocaleDateString() : 'Never'}</span>,
  },
];

import { useDeveloperApiKeys } from "../hooks/developer.hooks";

export function DevApiKeysPage() {
  const { data = [], isLoading, isError } = useDeveloperApiKeys();

  return (
    <ListPageTemplate<DevApiKey>
      title="System API Keys"
      description="Manage internal system and administrative API keys."
      crumbs={[
        { label: "System / Admin" },
        { label: "Developer", to: "/developer" },
        { label: "API Keys" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name"]}
      facet={{
        label: "Environment",
        key: "environment",
        options: ["Production", "Staging", "Development"],
      }}
      createLabel="Create New Key"
      rowActions={[
        { label: "Rotate Key", onSelect: () => {} },
        { label: "Revoke Access", onSelect: () => {} },
        { label: "Disable", onSelect: () => {} },
      ]}
    />
  );
}
