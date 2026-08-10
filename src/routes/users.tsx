import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { users } from "@/lib/mock-data";

type Row = (typeof users)[number];

const columns: Column<Row>[] = [
  {
    key: "name",
    header: "User",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: "email", header: "Email", sortable: true },
  { key: "role", header: "Role", sortable: true },
  { key: "org", header: "Organization", sortable: true },
  {
    key: "mfa",
    header: "MFA",
    sortable: true,
    render: (row) => (row.mfa ? <StatusChip status="approved" /> : <StatusChip status="pending" />),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
  { key: "lastActive", header: "Last active" },
];

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users · Ascent Platform" },
      {
        name: "description",
        content: "Directory of every platform user with roles, organizations and security posture.",
      },
      { property: "og:title", content: "Users · Ascent Platform" },
      {
        property: "og:description",
        content: "Directory of every platform user with roles, organizations and security posture.",
      },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  return (
    <ListPageTemplate<Row>
      title="Users"
      description="Directory of every platform user with roles, organizations and security posture."
      crumbs={[{ label: "Administration" }, { label: "Users" }]}
      columns={columns}
      rows={users}
      searchKeys={["name", "email", "role"]}
      stats={[
        { label: "Total users", value: "42,318", delta: 4.2, hint: "active last 30 days" },
        { label: "Admins", value: "98", hint: "across all tenants" },
        { label: "MFA adoption", value: "84%", progress: 84 },
        { label: "Suspended", value: "12", delta: -18.5, hint: "vs last month" },
      ]}
      facet={{
        label: "Role",
        key: "role",
        options: [
          "Platform Admin",
          "Organization Admin",
          "Event Manager",
          "Judge",
          "Mentor",
          "Reviewer",
          "Volunteer",
          "Recruiter",
        ],
      }}
      createLabel="Invite user"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
