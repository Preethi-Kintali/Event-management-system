import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { recruitment } from "@/lib/mock-data";

type Row = (typeof recruitment)[number];

const columns: Column<Row>[] = [
  { key: "candidate", header: "Candidate", sortable: true, render: (row) => <span className="font-medium">{row.candidate}</span> },
  { key: "role", header: "Role", sortable: true },
  { key: "company", header: "Company", sortable: true },
  { key: "stage", header: "Stage", sortable: true },
  { key: "score", header: "Score", sortable: true, render: (row) => <span className="tabular-nums">{row.score}</span> },
  { key: "source", header: "Sourced from", sortable: true },
  { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
];

export const Route = createFileRoute("/recruitment")({
  head: () => ({
    meta: [
      { title: "Recruitment · Ascent Platform" },
      { name: "description", content: "Convert competition performance into hiring pipelines and offers." },
      { property: "og:title", content: "Recruitment · Ascent Platform" },
      { property: "og:description", content: "Convert competition performance into hiring pipelines and offers." },
    ],
  }),
  component: RecruitmentPage,
});

function RecruitmentPage() {
  return (
    <ListPageTemplate<Row>
      title="Recruitment"
      description="Convert competition performance into hiring pipelines and offers."
      crumbs={[{ label: "People" }, { label: "Recruitment" }]}
      columns={columns}
      rows={recruitment}
      searchKeys={["candidate", "role", "company"]}
        stats={[{ label: "Candidates", value: "1,284", delta: 21.4 }, { label: "Interviews", value: "186", delta: 8.6 }, { label: "Offers", value: "42", delta: 14.9 }, { label: "Offer acceptance", value: "78%", progress: 78 }]}
        facet={{ label: "Stage", key: "stage", options: ["Shortlisted", "Interview", "Offer", "Rejected"] }}
        createLabel="Add candidate"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
