import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useBadges } from "../services/badges.api";
import { Badge as UIBadge } from "@/components/ui/badge";

const columns: Column<any>[] = [
  {
    key: "name",
    header: "Badge",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: "type", header: "Type", sortable: true },
  {
    key: "recipients",
    header: "Recipients",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row._count?.awards || 0}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "ACTIVE") statusId = "active";
      if (row.status === "ARCHIVED") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
  { 
    key: "createdAt", 
    header: "Created Date", 
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleDateString()}</span>
  },
];

export function BadgeListPage() {
  const { data = [] } = useBadges();

  return (
    <ListPageTemplate<any>
      title="Badge Management"
      description="Create and manage platform-wide achievement badges."
      crumbs={[
        { label: "Engagement" },
        { label: "Badges", to: "/badges" },
        { label: "All Badges" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "type"]}
      facet={{
        label: "Type",
        key: "type",
        options: ["PARTICIPATION", "WINNER", "ACHIEVEMENT", "FINALIST"],
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
