import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useMyTransactions } from "@/modules/payments/hooks/payments.hooks";

export function ParticipantTransactionsPage() {
  const { data: transactions = [], isLoading } = useMyTransactions();

  const columns: Column<any>[] = [
    {
      key: "event",
      header: "Event",
      render: (row) => <span className="font-medium">{row.event?.name || "-"}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span>
          {row.currency.toUpperCase()} {row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusChip status={row.status.toLowerCase()} />,
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <ListPageTemplate<any>
      title="My Transactions"
      description="View your event registration payments."
      crumbs={[{ label: "Participant" }, { label: "Transactions" }]}
      columns={columns}
      rows={transactions}
      loading={isLoading}
      searchKeys={["event.name"]}
    />
  );
}
