import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { SeverityChip } from "@/components/ds/status-chip";
import { auditLogs } from "@/lib/mock-data";

type Row = (typeof auditLogs)[number];

const columns: Column<Row>[] = [
  { key: "timestamp", header: "Timestamp", sortable: true, render: (row) => <span className="font-mono text-xs">{row.timestamp}</span> },
  { key: "actor", header: "Actor", sortable: true, render: (row) => <span className="font-medium">{row.actor}</span> },
  { key: "action", header: "Action", sortable: true, render: (row) => <span className="font-mono text-xs">{row.action}</span> },
  { key: "target", header: "Target", sortable: true },
  { key: "ip", header: "IP" },
  { key: "severity", header: "Severity", sortable: true, render: (row) => <SeverityChip severity={row.severity} /> },
];

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit logs · Ascent Platform" },
      { name: "description", content: "Immutable record of privileged actions across the platform." },
      { property: "og:title", content: "Audit logs · Ascent Platform" },
      { property: "og:description", content: "Immutable record of privileged actions across the platform." },
    ],
  }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  return (
    <ListPageTemplate<Row>
      title="Audit logs"
      description="Immutable record of privileged actions across the platform."
      crumbs={[{ label: "Administration" }, { label: "Audit logs" }]}
      columns={columns}
      rows={auditLogs}
      searchKeys={["actor", "action", "target"]}
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
