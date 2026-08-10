import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { registrations } from "@/lib/mock-data";

type Row = (typeof registrations)[number];

const columns: Column<Row>[] = [
  {
    key: "participant",
    header: "Participant",
    sortable: true,
    render: (row) => <span className="font-medium">{row.participant}</span>,
  },
  { key: "email", header: "Email", sortable: true },
  { key: "event", header: "Event", sortable: true },
  { key: "type", header: "Type", sortable: true },
  { key: "amount", header: "Amount", sortable: true },
  { key: "paid", header: "Payment", sortable: true },
  { key: "submitted", header: "Submitted", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

export function RegistrationsListPage() {
  return (
    <ListPageTemplate<Row>
      title="Registrations"
      description="Approve, review and reconcile participant registrations and payments."
      crumbs={[{ label: "Programs" }, { label: "Registrations" }]}
      columns={columns}
      rows={registrations}
      searchKeys={["participant", "email", "event"]}
      stats={[
        { label: "Registrations", value: "8,320", delta: 11.5, hint: "this month" },
        { label: "Pending approval", value: "24", hint: "SLA 48 hours" },
        { label: "Paid conversion", value: "63%", progress: 63 },
        { label: "Refunds", value: "$1,240", delta: -6.2 },
      ]}
      facet={{ label: "Payment", key: "paid", options: ["Paid", "Free", "Pending", "Waived"] }}
      createLabel="Add registration"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
