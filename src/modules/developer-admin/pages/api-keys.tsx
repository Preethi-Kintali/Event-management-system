import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

// Local mock data since developer API keys are similar to integration API keys
interface DevApiKey {
  id: string;
  name: string;
  environment: "Production" | "Staging" | "Development";
  owner: string;
  created: string;
  lastUsed: string;
  expiry: string;
  status: "Active" | "Revoked";
  maskedKey: string;
}

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
  { key: "owner", header: "Owner", sortable: true },
  {
    key: "created",
    header: "Created",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.created}</span>,
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
      return <StatusChip status={row.status === "Active" ? "active" : "suspended"} />;
    },
  },
  {
    key: "expiry",
    header: "Expires",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.expiry}</span>,
  },
];

export function DevApiKeysPage() {
  const [data, setData] = useState<DevApiKey[]>([]);

  useEffect(() => {
    setData([
      {
        id: "k1",
        name: "Mobile Client Main",
        environment: "Production",
        owner: "App Team",
        created: "2025-01-01",
        lastUsed: "Just now",
        expiry: "Never",
        status: "Active",
        maskedKey: "sk_live_••••••••••••2f9a",
      },
      {
        id: "k2",
        name: "Internal Admin Script",
        environment: "Production",
        owner: "SysAdmin",
        created: "2025-10-15",
        lastUsed: "Yesterday",
        expiry: "2026-10-15",
        status: "Active",
        maskedKey: "sk_live_••••••••••••7c4b",
      },
      {
        id: "k3",
        name: "Staging Test Key",
        environment: "Staging",
        owner: "QA Team",
        created: "2026-05-20",
        lastUsed: "2 hours ago",
        expiry: "Never",
        status: "Active",
        maskedKey: "sk_test_••••••••••••1b8c",
      },
    ]);
  }, []);

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
      searchKeys={["name", "owner"]}
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
