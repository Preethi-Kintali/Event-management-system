import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { CommunityService } from "../services/community.service";
import { Group } from "../types/community.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, Minus } from "lucide-react";

const columns: Column<Group>[] = [
  {
    key: "group",
    header: "Group Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.group}</span>,
  },
  { key: "category", header: "Category", sortable: true },
  {
    key: "members",
    header: "Members",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.members}</span>,
  },
  {
    key: "activity",
    header: "Activity",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-1.5 text-xs font-medium">
        {row.activity === "Very High" && <TrendingUp className="w-4 h-4 text-emerald-500" />}
        {row.activity === "High" && <Activity className="w-4 h-4 text-emerald-500" />}
        {row.activity === "Medium" && <Minus className="w-4 h-4 text-amber-500" />}
        {row.activity}
      </div>
    ),
  },
  {
    key: "createdDate",
    header: "Created Date",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.createdDate}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Active") statusId = "active";
      if (row.status === "Inactive") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function GroupsPage() {
  const [data, setData] = useState<Group[]>([]);

  useEffect(() => {
    CommunityService.getGroups().then(setData);
  }, []);

  return (
    <ListPageTemplate<Group>
      title="Community Groups"
      description="Interest-based cohorts and member collectives."
      crumbs={[
        { label: "Engagement" },
        { label: "Community", to: "/community" },
        { label: "Groups" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["group", "category"]}
      facet={{ label: "Status", key: "status", options: ["Active", "Inactive"] }}
      createLabel="Create Group"
      rowActions={[
        { label: "View Group", onSelect: () => {} },
        { label: "Join Group", onSelect: () => {} },
        { label: "Manage Members", onSelect: () => {} },
      ]}
    />
  );
}
