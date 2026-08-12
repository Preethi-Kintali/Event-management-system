import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useTemplates } from "../services/communications.api";
import { MessageTemplate } from "../types/communication.types";
import { Badge } from "@/components/ui/badge";

const columns: Column<MessageTemplate>[] = [
  {
    key: "name",
    header: "Template Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "channel",
    header: "Channel",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.channel}</Badge>,
  },
  { key: "category", header: "Category", sortable: true },
  { key: "lastUpdated", header: "Last Updated", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Active") statusId = "active";
      if (row.status === "Draft") statusId = "draft";
      if (row.status === "Archived") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function CommunicationTemplatesPage() {
  const { data = [] } = useTemplates();

  return (
    <ListPageTemplate<any>
      title="Message Templates"
      description="Manage reusable content templates across all channels."
      crumbs={[
        { label: "Engagement" },
        { label: "Communication", to: "/communication" },
        { label: "Templates" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "category"]}
      facet={{
        label: "Channel",
        key: "channel",
        options: ["Email", "SMS", "WhatsApp", "Push", "In-App"],
      }}
      createLabel="Create Template"
      rowActions={[
        { label: "Preview", onSelect: () => {} },
        { label: "Edit", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
      ]}
    />
  );
}
