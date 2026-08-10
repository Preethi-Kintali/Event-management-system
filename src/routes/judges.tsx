import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { judges } from "@/lib/mock-data";

type Row = (typeof judges)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Judge", sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
  { key: "org", header: "Organization", sortable: true },
  { key: "expertise", header: "Expertise", sortable: true },
  { key: "assigned", header: "Assigned", sortable: true },
  { key: "completed", header: "Completed", sortable: true },
  { key: "avgScore", header: "Avg score", sortable: true, render: (row) => <span className="tabular-nums">{row.avgScore.toFixed(1)}</span> },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
];

export const Route = createFileRoute("/judges")({
  head: () => ({
    meta: [
      { title: "Judges · Ascent Platform" },
      { name: "description", content: "Judge panel workload, completion rate and scoring calibration." },
      { property: "og:title", content: "Judges · Ascent Platform" },
      { property: "og:description", content: "Judge panel workload, completion rate and scoring calibration." },
    ],
  }),
  component: JudgesPage,
});

function JudgesPage() {
  return (
    <ListPageTemplate<Row>
      title="Judges"
      description="Judge panel workload, completion rate and scoring calibration."
      crumbs={[{ label: "People" }, { label: "Judges" }]}
      columns={columns}
      rows={judges}
      searchKeys={["name", "org", "expertise"]}
        stats={[{ label: "Judges", value: "638", delta: 7.1 }, { label: "Evaluations done", value: "403", progress: 66 }, { label: "Avg turnaround", value: "1.8 days", delta: -9.4 }, { label: "Calibration variance", value: "4.2 pts", hint: "within tolerance" }]}
        createLabel="Invite judge"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
