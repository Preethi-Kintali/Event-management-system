import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { WinnersService } from "../services/winners.service";
import { Winner } from "../types/winners.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<Winner>[] = [
  {
    key: "winner",
    header: "Winner",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium">{row.winner}</p>
        {row.team && <p className="text-xs text-muted-foreground">Team: {row.team}</p>}
      </div>
    ),
  },
  { key: "competition", header: "Competition", sortable: true },
  {
    key: "position",
    header: "Position",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.position}</Badge>,
  },
  { key: "prize", header: "Prize", sortable: false },
  {
    key: "score",
    header: "Score",
    sortable: true,
    render: (row) => <span className="tabular-nums font-mono text-xs">{row.score}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Prize Distributed") statusId = "published";
      if (row.status === "Announced") statusId = "active";
      if (row.status === "Selected") statusId = "draft";
      if (row.status === "Prize Pending") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
  {
    key: "announcementDate",
    header: "Announced",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-muted-foreground">{row.announcementDate || "—"}</span>
    ),
  },
];

export function WinnerListPage() {
  const [data, setData] = useState<Winner[]>([]);

  useEffect(() => {
    WinnersService.getWinners().then(setData);
  }, []);

  return (
    <ListPageTemplate<Winner>
      title="Winners List"
      description="Database of all competition champions, finalists, and prize recipients."
      crumbs={[
        { label: "Engagement" },
        { label: "Winners", to: "/winners" },
        { label: "All Winners" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["winner", "competition", "team"]}
      facet={{
        label: "Position",
        key: "position",
        options: ["Winner", "Runner-up", "Second Runner-up", "Finalist", "Special Mention"],
      }}
      createLabel="Select Winners"
      createTo="/winners/selection"
      rowActions={[
        { label: "View Profile", onSelect: () => {} },
        { label: "Process Prize", onSelect: () => {} },
        { label: "Generate Certificate", onSelect: () => {} },
      ]}
    />
  );
}
