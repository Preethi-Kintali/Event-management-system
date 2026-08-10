import { ListPageTemplate } from "@/components/templates/list-page";
import type { Column } from "@/components/ds/data-table";
import { PlatformAdminService } from "../services/platform-admin.service";
import { AuditLog } from "../types/platform-admin.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<AuditLog>[] = [
  {
    key: "timestamp",
    header: "Timestamp",
    sortable: true,
    render: (row) => <span className="font-mono text-xs">{row.timestamp}</span>,
  },
  {
    key: "actor",
    header: "User",
    sortable: true,
    render: (row) => <span className="font-medium">{row.actor}</span>,
  },
  {
    key: "action",
    header: "Action",
    sortable: true,
    render: (row) => (
      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
        {row.action}
      </span>
    ),
  },
  { key: "target", header: "Resource", sortable: true },
  { key: "ip", header: "IP Address", sortable: true },
  {
    key: "severity",
    header: "Severity",
    sortable: true,
    render: (row) => {
      let color = "bg-primary/10 text-primary";
      if (row.severity === "warning") color = "bg-warning/10 text-warning";
      if (row.severity === "error" || row.severity === "critical")
        color = "bg-destructive/10 text-destructive";
      return (
        <Badge variant="secondary" className={color}>
          {row.severity}
        </Badge>
      );
    },
  },
];

export function AuditLogsPage() {
  const [data, setData] = useState<AuditLog[]>([]);

  useEffect(() => {
    PlatformAdminService.getAuditLogs().then(setData);
  }, []);

  return (
    <ListPageTemplate<AuditLog>
      title="Audit Logs"
      description="Enterprise security and compliance event tracking."
      crumbs={[{ label: "Platform" }, { label: "Audit Logs" }]}
      columns={columns}
      rows={data}
      searchKeys={["actor", "action", "target"]}
      facet={{
        label: "Severity",
        key: "severity",
        options: ["info", "warning", "error", "critical"],
      }}
      rowActions={[{ label: "View raw JSON", onSelect: () => {} }]}
    />
  );
}
