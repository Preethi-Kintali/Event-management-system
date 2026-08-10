import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { PlatformAdminService } from "../services/platform-admin.service";
import { Organization } from "../types/platform-admin.types";
import { useEffect, useState } from "react";

const columns: Column<Organization>[] = [
  {
    key: "name",
    header: "Organization",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: "type", header: "Type", sortable: true },
  { key: "plan", header: "Plan", sortable: true },
  { key: "members", header: "Users", sortable: true },
  { key: "events", header: "Events", sortable: true },
  { key: "created", header: "Created Date", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

export function OrganizationsPage() {
  const [data, setData] = useState<Organization[]>([]);

  useEffect(() => {
    PlatformAdminService.getOrganizations().then(setData);
  }, []);

  return (
    <ListPageTemplate<Organization>
      title="Organizations"
      description="Manage all organizations across the platform."
      crumbs={[{ label: "Platform" }, { label: "Organizations" }]}
      columns={columns}
      rows={data}
      searchKeys={["name", "type", "plan"]}
      stats={[
        { label: "Total Organizations", value: "8", delta: 12.5 },
        { label: "Active Organizations", value: "5", progress: 62 },
      ]}
      facet={{
        label: "Type",
        key: "type",
        options: ["University", "Corporate", "Non-profit", "Government", "Community"],
      }}
      createLabel="Add Organization"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Approve", onSelect: () => {} },
        { label: "Suspend", onSelect: () => {} },
      ]}
    />
  );
}
