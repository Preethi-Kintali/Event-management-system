import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { submissions } from "@/lib/mock-data";

type Row = (typeof submissions)[number];

const columns: Column<Row>[] = [
  {
    key: "id",
    header: "ID",
    sortable: true,
    render: (row) => <span className="font-mono text-xs">{row.id}</span>,
  },
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (row) => <span className="font-medium">{row.title}</span>,
  },
  { key: "team", header: "Team", sortable: true },
  { key: "competition", header: "Competition", sortable: true },
  { key: "round", header: "Round", sortable: true },
  {
    key: "score",
    header: "Score",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.score ? row.score.toFixed(1) : "—"}</span>,
  },
  { key: "reviewers", header: "Reviewers", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

export function SubmissionsListPage() {
  return (
    <ListPageTemplate<Row>
      title="Submissions"
      description="Every submission with round, score and reviewer coverage."
      crumbs={[{ label: "Programs" }, { label: "Submissions" }]}
      columns={columns}
      rows={submissions}
      searchKeys={["title", "team", "competition"]}
      stats={[
        { label: "Submissions", value: "8,960", delta: 17.3 },
        { label: "Awaiting review", value: "88", hint: "Round 2 closes soon" },
        { label: "Avg score", value: "76.4", delta: 1.8 },
        { label: "Reviewer coverage", value: "92%", progress: 92 },
      ]}
      facet={{ label: "Round", key: "round", options: ["Draft", "Round 1", "Round 2", "Final"] }}
      createLabel="Import submissions"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
