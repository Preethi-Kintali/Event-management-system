import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { subscriptions } from "@/lib/mock-data";

type Row = (typeof subscriptions)[number];

const columns: Column<Row>[] = [
  { key: "org", header: "Organization", sortable: true, render: (row) => <span className="font-medium">{row.org}</span> },
  { key: "plan", header: "Plan", sortable: true },
  { key: "seats", header: "Seats", sortable: true },
  { key: "used", header: "Used", sortable: true },
  { key: "mrr", header: "MRR", sortable: true },
  { key: "renewal", header: "Renews", sortable: true },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
];

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [
      { title: "Subscriptions · Ascent Platform" },
      { name: "description", content: "Plan, seat and renewal management for every tenant organization." },
      { property: "og:title", content: "Subscriptions · Ascent Platform" },
      { property: "og:description", content: "Plan, seat and renewal management for every tenant organization." },
    ],
  }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  return (
    <ListPageTemplate<Row>
      title="Subscriptions"
      description="Plan, seat and renewal management for every tenant organization."
      crumbs={[{ label: "Administration" }, { label: "Subscriptions" }]}
      columns={columns}
      rows={subscriptions}
      searchKeys={["org", "plan"]}
        stats={[{ label: "MRR", value: "$108,600", delta: 11.4, hint: "vs last month" }, { label: "Net revenue retention", value: "118%", delta: 2.8 }, { label: "Seats billed", value: "37,000", progress: 92 }, { label: "At-risk renewals", value: "4", hint: "next 60 days" }]}
        facet={{ label: "Plan", key: "plan", options: ["Enterprise", "Growth", "Starter"] }}
        createLabel="Add subscription"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
