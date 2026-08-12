import { ListPageTemplate } from "@/components/templates/list-page";
import type { Column } from "@/components/ds/data-table";
import { useSecurityEvents } from "../hooks/security.hooks";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

const columns: Column<any>[] = [
  {
    key: "timestamp",
    header: "Timestamp",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">{row.timestamp}</span>
    ),
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
    key: "event",
    header: "Event",
    sortable: true,
    render: (row) => <span className="font-medium text-sm">{row.event}</span>,
  },
  {
    key: "user",
    header: "User / Actor",
    sortable: true,
    render: (row) => <span className="text-xs">{row.user}</span>,
  },
  {
    key: "ipAddress",
    header: "IP & Device",
    sortable: false,
    render: (row) => (
      <div className="flex flex-col text-[10px]">
        <code className="text-muted-foreground">{row.ipAddress}</code>
        <span className="text-muted-foreground">{row.device}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-1.5 text-xs font-medium">
        {row.status === "Success" && (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Success
          </>
        )}
        {row.status === "Failed" && (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-destructive" /> Failed
          </>
        )}
        {row.status === "Blocked" && (
          <>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Blocked
          </>
        )}
      </div>
    ),
  },
];

export function EventsPage() {
  const { activeOrganization } = useAuth();
  const tenantId = activeOrganization || "";
  const { data = [] } = useSecurityEvents(tenantId);

  return (
    <ListPageTemplate<any>
      title="Security Audit Logs"
      description="Immutable record of security-related events and access attempts."
      crumbs={[
        { label: "System / Admin" },
        { label: "Security", to: "/security" },
        { label: "Audit Logs" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["event", "user", "ipAddress"]}
      facet={{
        label: "Severity",
        key: "severity",
        options: ["Critical", "High", "Medium", "Low", "Info"],
      }}
      rowActions={[
        { label: "View Raw Event", onSelect: () => {} },
        { label: "Investigate IP", onSelect: () => {} },
        { label: "Investigate User", onSelect: () => {} },
      ]}
    />
  );
}
