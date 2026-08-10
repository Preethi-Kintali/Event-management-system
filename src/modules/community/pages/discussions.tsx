import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { CommunityService } from "../services/community.service";
import { Discussion } from "../types/community.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<Discussion>[] = [
  {
    key: "title",
    header: "Discussion Title",
    sortable: true,
    render: (row) => <span className="font-medium">{row.title}</span>,
  },
  { key: "author", header: "Author", sortable: true },
  {
    key: "category",
    header: "Category",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.category}</Badge>,
  },
  {
    key: "replies",
    header: "Replies",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.replies}</span>,
  },
  {
    key: "views",
    header: "Views",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.views}</span>,
  },
  {
    key: "lastActivity",
    header: "Last Activity",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.lastActivity}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Open") statusId = "active";
      if (row.status === "Resolved") statusId = "published";
      if (row.status === "Locked") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function DiscussionsPage() {
  const [data, setData] = useState<Discussion[]>([]);

  useEffect(() => {
    CommunityService.getDiscussions().then(setData);
  }, []);

  return (
    <ListPageTemplate<Discussion>
      title="Discussion Forum"
      description="Manage community conversations, questions, and ideas."
      crumbs={[
        { label: "Engagement" },
        { label: "Community", to: "/community" },
        { label: "Discussions" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["title", "author", "category"]}
      facet={{ label: "Status", key: "status", options: ["Open", "Resolved", "Locked"] }}
      createLabel="New Discussion"
      rowActions={[
        { label: "View Thread", onSelect: () => {} },
        { label: "Lock Discussion", onSelect: () => {} },
        { label: "Delete", onSelect: () => {} },
      ]}
    />
  );
}
