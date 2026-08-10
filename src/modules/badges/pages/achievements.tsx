import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { BadgesService } from "../services/badges.service";
import { Achievement } from "../types/badges.types";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const columns: Column<Achievement>[] = [
  {
    key: "name",
    header: "Milestone",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "criteria",
    header: "Criteria",
    sortable: false,
    render: (row) => (
      <span className="text-muted-foreground text-sm truncate block max-w-[250px]">
        {row.criteria}
      </span>
    ),
  },
  {
    key: "xp",
    header: "XP Reward",
    sortable: true,
    render: (row) => <span className="tabular-nums font-mono text-xs">{row.xp}</span>,
  },
  {
    key: "progress",
    header: "Global Progress",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-32">
        <Progress value={row.progress} className="h-1.5" />
        <span className="text-xs">{row.progress}%</span>
      </div>
    ),
  },
  {
    key: "recipients",
    header: "Completed By",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.recipients}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Completed") statusId = "published";
      if (row.status === "In Progress") statusId = "active";
      if (row.status === "Locked") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function AchievementsPage() {
  const [data, setData] = useState<Achievement[]>([]);

  useEffect(() => {
    BadgesService.getAchievements().then(setData);
  }, []);

  return (
    <ListPageTemplate<Achievement>
      title="Global Achievements"
      description="Manage overarching platform milestones and quests."
      crumbs={[
        { label: "Engagement" },
        { label: "Badges", to: "/badges" },
        { label: "Achievements" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "criteria"]}
      facet={{ label: "Status", key: "status", options: ["In Progress", "Completed", "Locked"] }}
      createLabel="New Milestone"
      rowActions={[
        { label: "View Details", onSelect: () => {} },
        { label: "Edit Criteria", onSelect: () => {} },
      ]}
    />
  );
}
