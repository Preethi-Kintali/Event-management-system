import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { mentors } from "@/lib/mock-data";

type Row = (typeof mentors)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Mentor", sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
  { key: "expertise", header: "Expertise", sortable: true },
  { key: "org", header: "Organization", sortable: true },
  { key: "teams", header: "Teams", sortable: true },
  { key: "hours", header: "Hours", sortable: true },
  { key: "rating", header: "Rating", sortable: true, render: (row) => <span className="tabular-nums">{row.rating.toFixed(1)}</span> },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
];

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Mentors · Ascent Platform" },
      { name: "description", content: "Mentor allocation, coaching hours and participant ratings." },
      { property: "og:title", content: "Mentors · Ascent Platform" },
      { property: "og:description", content: "Mentor allocation, coaching hours and participant ratings." },
    ],
  }),
  component: MentorsPage,
});

function MentorsPage() {
  return (
    <ListPageTemplate<Row>
      title="Mentors"
      description="Mentor allocation, coaching hours and participant ratings."
      crumbs={[{ label: "People" }, { label: "Mentors" }]}
      columns={columns}
      rows={mentors}
      searchKeys={["name", "expertise", "org"]}
        stats={[{ label: "Mentors", value: "402", delta: 5.5 }, { label: "Coaching hours", value: "1,860", delta: 12.7 }, { label: "Avg rating", value: "4.7", hint: "out of 5" }, { label: "Unassigned", value: "18", hint: "awaiting matching" }]}
        createLabel="Invite mentor"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
