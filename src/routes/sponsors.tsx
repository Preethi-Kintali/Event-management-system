import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { sponsors } from "@/lib/mock-data";

type Row = (typeof sponsors)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Sponsor", sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
  { key: "tier", header: "Tier", sortable: true },
  { key: "value", header: "Committed value", sortable: true },
  { key: "events", header: "Events", sortable: true },
  { key: "contact", header: "Contact" },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
];

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Sponsors · Ascent Platform" },
      { name: "description", content: "Sponsorship tiers, committed value and deliverable tracking." },
      { property: "og:title", content: "Sponsors · Ascent Platform" },
      { property: "og:description", content: "Sponsorship tiers, committed value and deliverable tracking." },
    ],
  }),
  component: SponsorsPage,
});

function SponsorsPage() {
  return (
    <ListPageTemplate<Row>
      title="Sponsors"
      description="Sponsorship tiers, committed value and deliverable tracking."
      crumbs={[{ label: "People" }, { label: "Sponsors" }]}
      columns={columns}
      rows={sponsors}
      searchKeys={["name", "tier", "contact"]}
        stats={[{ label: "Sponsors", value: "84", delta: 9.2 }, { label: "Committed value", value: "$4.1M", delta: 16.8 }, { label: "Deliverables met", value: "91%", progress: 91 }, { label: "Renewals pending", value: "7", hint: "this quarter" }]}
        facet={{ label: "Tier", key: "tier", options: ["Platinum", "Gold", "Silver"] }}
        createLabel="Add sponsor"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
