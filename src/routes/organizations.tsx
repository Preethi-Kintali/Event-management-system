import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { organizations } from "@/lib/mock-data";

type Row = (typeof organizations)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Organization", sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
  { key: "type", header: "Type", sortable: true },
  { key: "plan", header: "Plan", sortable: true },
  { key: "region", header: "Region", sortable: true },
  { key: "members", header: "Members", sortable: true, render: (row) => <span className="tabular-nums">{row.members.toLocaleString()}</span> },
  { key: "events", header: "Events", sortable: true },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
  { key: "created", header: "Created", sortable: true },
];

export const Route = createFileRoute("/organizations")({
  head: () => ({
    meta: [
      { title: "Organizations · Ascent Platform" },
      { name: "description", content: "Manage tenant organizations, plans, regions and lifecycle state across the platform." },
      { property: "og:title", content: "Organizations · Ascent Platform" },
      { property: "og:description", content: "Manage tenant organizations, plans, regions and lifecycle state across the platform." },
    ],
  }),
  component: OrganizationsPage,
});

function OrganizationsPage() {
  return (
    <ListPageTemplate<Row>
      title="Organizations"
      description="Manage tenant organizations, plans, regions and lifecycle state across the platform."
      crumbs={[{ label: "Administration" }, { label: "Organizations" }]}
      columns={columns}
      rows={organizations}
      searchKeys={["name", "type", "region"]}
        stats={[{ label: "Organizations", value: "128", delta: 6.4, hint: "vs last quarter" }, { label: "Enterprise tenants", value: "34", delta: 12.1, hint: "highest ARPU" }, { label: "Seats consumed", value: "34,140", progress: 78 }, { label: "Pending approvals", value: "3", hint: "awaiting verification" }]}
        facet={{ label: "Plan", key: "plan", options: ["Enterprise", "Growth", "Starter"] }}
        createLabel="New organization"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
