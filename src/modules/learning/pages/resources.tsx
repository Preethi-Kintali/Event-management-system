import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { LearningService } from "../services/learning.service";
import { Resource } from "../types/learning.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<Resource>[] = [
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
      if (row.status === "Active") statusId = "active";
      if (row.status === "Archived") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function ResourcesPage() {
  const [data, setData] = useState<Resource[]>([]);

  useEffect(() => {
    LearningService.getResources().then(setData);
  }, []);

  return (
    <ListPageTemplate<Resource>
      title="Resource Library"
      description="Central repository for problem statements, datasets, and guides."
      crumbs={[
        { label: "Engagement" },
        { label: "Learning", to: "/learning" },
        { label: "Resources" },
      ]}
      columns={columns}
      rows={data}
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
