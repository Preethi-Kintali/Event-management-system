import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { competitions } from "@/lib/mock-data";

type Row = (typeof competitions)[number];

const columns: Column<Row>[] = [
  { key: "name", header: "Competition", sortable: true, render: (row) => <span className="font-medium">{row.name}</span> },
  { key: "event", header: "Event", sortable: true },
  { key: "type", header: "Type", sortable: true },
  { key: "rounds", header: "Rounds", sortable: true },
  { key: "teams", header: "Teams", sortable: true },
  { key: "submissions", header: "Submissions", sortable: true },
  { key: "prize", header: "Prize pool", sortable: true },
  { key: "deadline", header: "Deadline", sortable: true },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
];

export const Route = createFileRoute("/competitions/")({
  head: () => ({
    meta: [
      { title: "Competitions · Ascent Platform" },
      { name: "description", content: "Hackathons, case studies and challenges with rounds, teams and prize pools." },
      { property: "og:title", content: "Competitions · Ascent Platform" },
      { property: "og:description", content: "Hackathons, case studies and challenges with rounds, teams and prize pools." },
    ],
  }),
  component: CompetitionsPage,
});

function CompetitionsPage() {
  return (
    <ListPageTemplate<Row>
      title="Competitions"
      description="Hackathons, case studies and challenges with rounds, teams and prize pools."
      crumbs={[{ label: "Programs" }, { label: "Competitions" }]}
      columns={columns}
      rows={competitions}
      searchKeys={["name", "event", "type"]}
        stats={[{ label: "Active competitions", value: "64", delta: 5.2 }, { label: "Teams", value: "3,120", delta: 9.8 }, { label: "Submissions", value: "8,960", delta: 17.3 }, { label: "Prize pool", value: "$2.4M", hint: "committed this cycle" }]}
        facet={{ label: "Type", key: "type", options: ["Hackathon", "Hardware", "Design", "Case Study", "Simulation"] }}
        createLabel="New competition"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
