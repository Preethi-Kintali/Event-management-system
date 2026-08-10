import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { events } from "@/lib/mock-data";

type Row = (typeof events)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Event", sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
  { key: "org", header: "Organization", sortable: true },
  { key: "category", header: "Category", sortable: true },
  { key: "mode", header: "Mode", sortable: true },
  { key: "location", header: "Location", sortable: true },
  { key: "start", header: "Starts", sortable: true },
  { key: "registrations", header: "Registrations", sortable: true, render: (row) => <span className="tabular-nums">{row.registrations.toLocaleString()}</span> },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
];

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events · Ascent Platform" },
      { name: "description", content: "Every event across your organizations with registrations, mode and lifecycle state." },
      { property: "og:title", content: "Events · Ascent Platform" },
      { property: "og:description", content: "Every event across your organizations with registrations, mode and lifecycle state." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <ListPageTemplate<Row>
      title="Events"
      description="Every event across your organizations with registrations, mode and lifecycle state."
      crumbs={[{ label: "Programs" }, { label: "Events" }]}
      columns={columns}
      rows={events}
      searchKeys={["name", "org", "location"]}
        stats={[{ label: "Total events", value: "486", delta: 8.9, hint: "vs last year" }, { label: "Live now", value: "12", hint: "3 hybrid, 9 online" }, { label: "Registrations", value: "42,800", delta: 14.6 }, { label: "Capacity filled", value: "81%", progress: 81 }]}
        facet={{ label: "Mode", key: "mode", options: ["Onsite", "Online", "Hybrid"] }}
        createLabel="Create event"
        createTo="/events/new"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
