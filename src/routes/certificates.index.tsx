import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { certificates } from "@/lib/mock-data";

type Row = (typeof certificates)[number];

const columns: Column<Row>[] = [
  {
    key: "recipient",
    header: "Recipient",
    sortable: true,
    render: (row) => <span className="font-medium">{row.recipient}</span>,
  },
  { key: "template", header: "Template", sortable: true },
  { key: "event", header: "Event", sortable: true },
  {
    key: "serial",
    header: "Serial",
    sortable: true,
    render: (row) => <span className="font-mono text-xs">{row.serial}</span>,
  },
  { key: "issued", header: "Issued", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

export const Route = createFileRoute("/certificates/")({
  head: () => ({
    meta: [
      { title: "Certificates · Ascent Platform" },
      {
        name: "description",
        content: "Issue, verify and reissue participation and winner certificates.",
      },
      { property: "og:title", content: "Certificates · Ascent Platform" },
      {
        property: "og:description",
        content: "Issue, verify and reissue participation and winner certificates.",
      },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  return (
    <ListPageTemplate<Row>
      title="Certificates"
      description="Issue, verify and reissue participation and winner certificates."
      crumbs={[{ label: "Evaluation" }, { label: "Certificates" }]}
      columns={columns}
      rows={certificates}
      searchKeys={["recipient", "event", "serial"]}
      stats={[
        { label: "Certificates issued", value: "18,420", delta: 24.1 },
        { label: "Pending approval", value: "62", hint: "batch NW-2026" },
        { label: "Verification checks", value: "3,180", delta: 11.2 },
        { label: "Templates", value: "14", hint: "6 published" },
      ]}
      facet={{
        label: "Template",
        key: "template",
        options: ["Winner — Hackathon", "Participation", "Finalist", "Fellowship Completion"],
      }}
      createLabel="Generate batch"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
