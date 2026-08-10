import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { DeveloperService } from "../services/developer.service";
import { Deployment } from "../types/developer.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<Deployment>[] = [
  {
    key: "version",
    header: "Version / Hash",
    sortable: true,
    render: (row) => (
      <code className="text-xs bg-muted/50 px-2 py-1 rounded font-medium">{row.version}</code>
    ),
  },
  {
    key: "environment",
    header: "Environment",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.environment}</Badge>,
  },
  {
    key: "date",
    header: "Deployed At",
    sortable: true,
    render: (row) => <span className="text-sm">{row.date}</span>,
  },
  { key: "deployedBy", header: "Deployed By", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Success") statusId = "active";
      if (row.status === "In Progress") statusId = "pending";
      if (row.status === "Failed") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function DeploymentsPage() {
  const [data, setData] = useState<Deployment[]>([]);

  useEffect(() => {
    DeveloperService.getDeployments().then(setData);
  }, []);

  return (
    <ListPageTemplate<Deployment>
      title="Deployments"
      description="Track platform version history and release cycles."
      crumbs={[
        { label: "System / Admin" },
        { label: "Developer", to: "/developer" },
        { label: "Deployments" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["version", "deployedBy"]}
      facet={{
        label: "Environment",
        key: "environment",
        options: ["Production", "Staging", "Development"],
      }}
      rowActions={[
        { label: "View Build Logs", onSelect: () => {} },
        { label: "Rollback (Disabled)", onSelect: () => {} },
      ]}
    />
  );
}
