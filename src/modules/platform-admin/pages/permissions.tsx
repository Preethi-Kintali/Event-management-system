import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { PlatformAdminService } from "../services/platform-admin.service";
import { PlatformRole } from "../types/platform-admin.types";
import { useEffect, useState } from "react";

const columns: Column<PlatformRole>[] = [
  {
    key: "name",
    header: "Role Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: "scope", header: "Scope", sortable: true },
  {
    key: "description",
    header: "Description",
    sortable: false,
    render: (row) => (
      <span className="text-muted-foreground truncate max-w-[300px] block">{row.description}</span>
    ),
  },
  { key: "users", header: "Users", sortable: true },
  { key: "permissions", header: "Permissions", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

export function PermissionsPage() {
  const [data, setData] = useState<PlatformRole[]>([]);

  useEffect(() => {
    PlatformAdminService.getRoles().then(setData);
  }, []);

  return (
    <ListPageTemplate<PlatformRole>
      title="Roles & Permissions"
      description="Manage enterprise access controls and role-based permissions."
      crumbs={[{ label: "Platform" }, { label: "Roles" }]}
      columns={columns}
      rows={data}
      searchKeys={["name", "scope", "description"]}
      facet={{
        label: "Scope",
        key: "scope",
        options: ["Global", "Organization", "Event", "Competition"],
      }}
      createLabel="Create Role"
    />
  );
}
