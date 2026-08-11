import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { SecurityService } from "../services/security.service";
import { Session } from "../types/security.types";
import { useEffect, useState } from "react";
import { Monitor, Smartphone, Globe } from "lucide-react";

const columns: Column<Session>[] = [
  {
    key: "user",
    header: "User",
    sortable: true,
    render: (row) => <span className="font-medium">{row.user}</span>,
  },
  {
    key: "device",
    header: "Device",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2">
        {row.device.includes("iPhone") || row.device.includes("Android") ? (
          <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
        )}
        <span>{row.device}</span>
      </div>
    ),
  },
  { key: "browser", header: "Browser", sortable: true },
  {
    key: "location",
    header: "Location",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Globe className="w-3 h-3" /> {row.location}
      </div>
    ),
  },
  {
    key: "ipAddress",
    header: "IP Address",
    sortable: false,
    render: (row) => (
      <code className="text-[10px] bg-muted/50 px-1.5 py-0.5 rounded">{row.ipAddress}</code>
    ),
  },
  {
    key: "loginTime",
    header: "Logged In",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.loginTime}</span>,
  },
  {
    key: "lastActivity",
    header: "Last Activity",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.lastActivity}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Active") statusId = "active";
      if (row.status === "Idle") statusId = "draft";
      if (row.status === "Revoked") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function SessionsPage() {
  const [data, setData] = useState<Session[]>([]);

  useEffect(() => {
    SecurityService.getSessions().then(setData);
  }, []);

  return (
    <ListPageTemplate<Session>
      title="Active Sessions"
      description="Monitor and manage active user logins across all devices."
      crumbs={[
        { label: "System / Admin" },
        { label: "Security", to: "/security" },
        { label: "Sessions" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["user", "ipAddress", "device"]}
      facet={{ label: "Status", key: "status", options: ["Active", "Idle", "Revoked"] }}
      rowActions={[
        { label: "View User Details", onSelect: () => {} },
        { label: "Revoke Session", onSelect: () => {} },
      ]}
    />
  );
}
