import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useDiscussions } from "../hooks/community.api";
import { Badge } from "@/components/ui/badge";

type DiscussionRow = {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  status: string;
};

const columns: Column<DiscussionRow>[] = [
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
      if (row.status === "OPEN") statusId = "active";
      if (row.status === "RESOLVED") statusId = "published";
      if (row.status === "LOCKED") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function DiscussionsPage() {
  const { data: discussions = [], isLoading } = useDiscussions();

  const rows: DiscussionRow[] = discussions.map((d: any) => ({
    id: d.id,
    title: d.title,
    author: d.author ? `${d.author.firstName} ${d.author.lastName}` : "Unknown",
    category: d.category,
    replies: d._count?.replies || 0,
    views: d.views || 0,
    lastActivity: new Date(d.updatedAt).toLocaleDateString(),
    status: d.status,
  }));

  if (isLoading) {
    return <div className="p-8">Loading discussions...</div>;
  }

  return (
    <ListPageTemplate<DiscussionRow>
      title="Discussion Forum"
      description="Manage community conversations, questions, and ideas."
      crumbs={[
        { label: "Engagement" },
        { label: "Community", to: "/community" },
        { label: "Discussions" },
      ]}
      columns={columns}
      rows={rows}
      searchKeys={["title", "author", "category"]}
      facet={{ label: "Status", key: "status", options: ["OPEN", "RESOLVED", "LOCKED"] }}
      createLabel="New Discussion"
      rowActions={[
        { label: "View Thread", onSelect: () => {} },
        { label: "Lock Discussion", onSelect: () => {} },
        { label: "Delete", onSelect: () => {} },
      ]}
    />
  );
}

