import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useResources } from "../hooks/learning.api";
import { Badge } from "@/components/ui/badge";

type ResourceRow = {
  id: string;
  resource: string;
  type: string;
  category: string;
  downloads: number;
  uploadedBy: string;
  date: string;
  status: string;
};

const columns: Column<ResourceRow>[] = [
  {
    key: "resource",
    header: "Resource Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.resource}</span>,
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.type}</Badge>,
  },
  { key: "category", header: "Category", sortable: true },
  {
    key: "downloads",
    header: "Downloads/Views",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.downloads}</span>,
  },
  { key: "uploadedBy", header: "Uploaded By", sortable: true },
  {
    key: "date",
    header: "Date Added",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.date}</span>,
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
];

export function ResourcesPage() {
  const { data: resources = [], isLoading } = useResources();

  const rows: ResourceRow[] = resources.map((r: any) => ({
    id: r.id,
    resource: r.title,
    type: r.type,
    category: r.category,
    downloads: r.downloads || 0,
    uploadedBy: r.uploadedBy ? `${r.uploadedBy.firstName} ${r.uploadedBy.lastName}` : "Unknown",
    date: new Date(r.createdAt).toLocaleDateString(),
    status: r.status,
  }));

  if (isLoading) {
    return <div className="p-8">Loading resources...</div>;
  }

  return (
    <ListPageTemplate<ResourceRow>
      title="Resource Library"
      description="Central repository for problem statements, datasets, and guides."
      crumbs={[
        { label: "Engagement" },
        { label: "Learning", to: "/learning" },
        { label: "Resources" },
      ]}
      columns={columns}
      rows={rows}
      searchKeys={["resource", "type", "category", "uploadedBy"]}
      facet={{
        label: "Type",
        key: "type",
        options: [
          "Problem Statement",
          "Dataset",
          "Template",
          "Video",
          "Study Material",
          "Research Paper",
          "Guide",
        ],
      }}
      createLabel="Upload Resource"
      rowActions={[
        { label: "Download/View", onSelect: () => {} },
        { label: "Edit Metadata", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}

