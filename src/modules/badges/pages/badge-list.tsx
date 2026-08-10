import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { BadgesService } from "../services/badges.service";
import { Badge } from "../types/badges.types";
import { useEffect, useState } from "react";
import { Badge as UIBadge } from "@/components/ui/badge";

const columns: Column<Badge>[] = [
  {
    key: "name",
    header: "Badge",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: "category", header: "Category", sortable: true },
  {
    key: "level",
    header: "Level",
    sortable: true,
    render: (row) => {
      let color = "bg-muted text-muted-foreground";
      if (row.level === "Gold") color = "bg-yellow-500/10 text-yellow-600";
      if (row.level === "Silver") color = "bg-slate-300/20 text-slate-500";
      if (row.level === "Bronze") color = "bg-amber-700/10 text-amber-700";
      if (row.level === "Platinum") color = "bg-sky-500/10 text-sky-600";
      if (row.level === "Diamond") color = "bg-indigo-500/10 text-indigo-600";
      return (
        <UIBadge variant="secondary" className={`shadow-none ${color}`}>
          {row.level}
        </UIBadge>
      );
    },
  },
  {
    key: "points",
    header: "XP",
    sortable: true,
    render: (row) => <span className="tabular-nums font-mono text-xs">{row.points}</span>,
  },
  {
    key: "recipients",
    header: "Recipients",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.recipients}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Active") statusId = "active";
      if (row.status === "Draft") statusId = "draft";
      if (row.status === "Archived") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
  { key: "createdDate", header: "Created Date", sortable: true },
];

export function BadgeListPage() {
  const [data, setData] = useState<Badge[]>([]);

  useEffect(() => {
    BadgesService.getBadges().then(setData);
  }, []);

  return (
    <ListPageTemplate<Badge>
      title="Badge Management"
      description="Create and manage platform-wide achievement badges."
      crumbs={[
        { label: "Engagement" },
        { label: "Badges", to: "/badges" },
        { label: "All Badges" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "category", "level"]}
      facet={{
        label: "Level",
        key: "level",
        options: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
      }}
      createLabel="Create Badge"
      createTo="/badges/new"
      rowActions={[
        { label: "View Details", onSelect: () => {} },
        { label: "Edit", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
