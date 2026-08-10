import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { roles } from "@/lib/mock-data";

type Row = (typeof roles)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Role", sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
  { key: "scope", header: "Scope", sortable: true },
  { key: "description", header: "Description" },
  { key: "users", header: "Users", sortable: true },
  { key: "permissions", header: "Permissions", sortable: true },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
];

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "Role management · Ascent Platform" },
      { name: "description", content: "Define scoped roles and permission bundles used across every module." },
      { property: "og:title", content: "Role management · Ascent Platform" },
      { property: "og:description", content: "Define scoped roles and permission bundles used across every module." },
    ],
  }),
  component: RolesPage,
});

function RolesPage() {
  return (
    <ListPageTemplate<Row>
      title="Role management"
      description="Define scoped roles and permission bundles used across every module."
      crumbs={[{ label: "Administration" }, { label: "Role management" }]}
      columns={columns}
      rows={roles}
      searchKeys={["name", "scope"]}
        stats={[{ label: "Roles", value: "18", hint: "6 system, 12 custom" }, { label: "Permissions", value: "142", hint: "across 14 modules" }, { label: "Role assignments", value: "1,480", delta: 3.1 }, { label: "Drafts", value: "2", hint: "unpublished changes" }]}
        createLabel="New role"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
