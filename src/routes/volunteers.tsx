import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { volunteers } from "@/lib/mock-data";

type Row = (typeof volunteers)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Volunteer", sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
  { key: "role", header: "Role", sortable: true },
  { key: "event", header: "Event", sortable: true },
  { key: "shifts", header: "Shifts", sortable: true },
  { key: "hours", header: "Hours", sortable: true },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
];

export const Route = createFileRoute("/volunteers")({
  head: () => ({
    meta: [
      { title: "Volunteers · Ascent Platform" },
      { name: "description", content: "Shift planning and on-ground volunteer coverage per event." },
      { property: "og:title", content: "Volunteers · Ascent Platform" },
      { property: "og:description", content: "Shift planning and on-ground volunteer coverage per event." },
    ],
  }),
  component: VolunteersPage,
});

function VolunteersPage() {
  return (
    <ListPageTemplate<Row>
      title="Volunteers"
      description="Shift planning and on-ground volunteer coverage per event."
      crumbs={[{ label: "People" }, { label: "Volunteers" }]}
      columns={columns}
      rows={volunteers}
      searchKeys={["name", "role", "event"]}
        stats={[{ label: "Volunteers", value: "294", delta: 3.4 }, { label: "Shifts filled", value: "88%", progress: 88 }, { label: "Hours logged", value: "3,420", delta: 8.1 }, { label: "Open shifts", value: "26", hint: "next 7 days" }]}
        createLabel="Add volunteer"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
