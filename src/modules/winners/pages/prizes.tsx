import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { WinnersService } from "../services/winners.service";
import { PrizeDistribution } from "../types/winners.types";
import { useEffect, useState } from "react";

const columns: Column<PrizeDistribution>[] = [
  {
    key: "winner",
    header: "Recipient",
    sortable: true,
    render: (row) => <span className="font-medium">{row.winner}</span>,
  },
  { key: "competition", header: "Competition", sortable: true },
  { key: "prize", header: "Prize Type", sortable: true },
  {
    key: "amount",
    header: "Value",
    sortable: true,
    render: (row) => <span className="tabular-nums font-semibold">{row.amount}</span>,
  },
  {
    key: "distributionDate",
    header: "Distribution Date",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-muted-foreground">{row.distributionDate || "—"}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Distributed") statusId = "published";
      if (row.status === "Processing") statusId = "active";
      if (row.status === "Pending") statusId = "draft";
      if (row.status === "Failed") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
  {
    key: "reference",
    header: "Reference",
    sortable: false,
    render: (row) => <span className="text-xs font-mono">{row.reference || "—"}</span>,
  },
];

export function PrizeDistributionPage() {
  const [data, setData] = useState<PrizeDistribution[]>([]);

  useEffect(() => {
    WinnersService.getPrizes().then(setData);
  }, []);

  return (
    <ListPageTemplate<PrizeDistribution>
      title="Prize Distribution"
      description="Track and process grants, cash prizes, and physical awards."
      crumbs={[{ label: "Engagement" }, { label: "Winners", to: "/winners" }, { label: "Prizes" }]}
      columns={columns}
      rows={data}
      searchKeys={["winner", "competition", "reference"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["Pending", "Processing", "Distributed", "Failed"],
      }}
      rowActions={[
        { label: "Update Status", onSelect: () => {} },
        { label: "Add Reference", onSelect: () => {} },
        { label: "View Winner", onSelect: () => {} },
      ]}
    />
  );
}
