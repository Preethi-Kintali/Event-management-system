import { ListPageTemplate } from "@/components/templates/list-page";
import type { Column } from "@/components/ds/data-table";
import { SecurityService } from "../services/security.service";
import { SecurityAlert } from "../types/security.types";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<SecurityAlert>[] = [
  {
    key: "alert",
    header: "Alert Description",
    sortable: true,
    render: (row) => <span className="font-medium text-sm">{row.alert}</span>,
  },
  {
    key: "severity",
    header: "Severity",
    sortable: true,
    render: (row) => (
      <Badge
        variant={
          row.severity === "Critical"
            ? "destructive"
            : row.severity === "High"
              ? "secondary"
              : "outline"
        }
        className={
          row.severity === "High" ? "bg-amber-500/20 text-amber-500 border-transparent" : ""
        }
      >
        {row.severity}
      </Badge>
    ),
  },
  {
    key: "source",
    header: "Source",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.source}</span>,
  },
  {
    key: "created",
    header: "Created At",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.created}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => (
      <Badge
        variant={
          row.status === "Open"
            ? "destructive"
            : row.status === "Investigating"
              ? "secondary"
              : "outline"
        }
        className={
          row.status === "Investigating" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""
        }
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: "assignedTo",
    header: "Assigned To",
    sortable: true,
    render: (row) => <span className="text-xs">{row.assignedTo}</span>,
  },
];

export function AlertsPage() {
  const [data, setData] = useState<SecurityAlert[]>([]);
  const { activeOrganization } = useAuth();
  const tenantId = activeOrganization || "";

  useEffect(() => {
    SecurityService.getAlerts(tenantId).then(setData);
  }, [tenantId]);

  return (
    <ListPageTemplate<SecurityAlert>
      title="Security Alerts Inbox"
      description="Triage and resolve automatically detected security anomalies."
      crumbs={[
        { label: "System / Admin" },
        { label: "Security", to: "/security" },
        { label: "Alerts" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["alert", "source", "assignedTo"]}
      facet={{ label: "Status", key: "status", options: ["Open", "Investigating", "Resolved"] }}
      rowActions={[
        { label: "Acknowledge", onSelect: () => {} },
        { label: "Assign to Me", onSelect: () => {} },
        { label: "Mark Resolved", onSelect: () => {} },
        { label: "View Details", onSelect: () => {} },
      ]}
    />
  );
}
