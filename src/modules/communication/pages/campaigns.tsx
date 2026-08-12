import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useCommunications, usePublishCommunication, useArchiveCommunication, useDeleteCommunication, Communication } from "../services/communications.api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

const columns: Column<Communication>[] = [
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (row) => <span className="font-medium">{row.title}</span>,
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.type}</Badge>,
  },
  { key: "audience", header: "Audience", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "PUBLISHED") statusId = "published";
      if (row.status === "DRAFT") statusId = "draft";
      if (row.status === "SCHEDULED") statusId = "active";
      if (row.status === "ARCHIVED") statusId = "archived";
      return <StatusChip status={statusId as any} label={row.status} />;
    },
  },
  {
    key: "publishedAt",
    header: "Published At",
    sortable: true,
    render: (row) => <span>{row.publishedAt ? format(new Date(row.publishedAt), "MMM d, yyyy h:mm a") : "—"}</span>,
  },
];

export function CommunicationCampaignsPage() {
  const { data, isLoading } = useCommunications();
  const publishComm = usePublishCommunication();
  const archiveComm = useArchiveCommunication();
  const deleteComm = useDeleteCommunication();

  return (
    <ListPageTemplate<Communication>
      title="Communications"
      description="Manage announcements, alerts, and targeted broadcasts."
      crumbs={[
        { label: "Engagement" },
        { label: "Communication", to: "/communication" },
        { label: "Campaigns" },
      ]}
      columns={columns}
      rows={data?.data || []}
      searchKeys={["title", "audience"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"],
      }}
      createLabel="New Communication"
      createTo="/communication/campaigns/new"
      rowActions={[
        { 
          label: "Publish", 
          onSelect: (row) => {
            if (row.status === "PUBLISHED") {
              toast.error("Already published");
              return;
            }
            publishComm.mutate(row.id, {
              onSuccess: () => toast.success("Communication published! Notifications dispatched."),
              onError: (e: any) => toast.error(e.message || "Failed to publish")
            });
          } 
        },
        { 
          label: "Archive", 
          onSelect: (row) => {
            archiveComm.mutate(row.id, {
              onSuccess: () => toast.success("Communication archived.")
            });
          } 
        },
        { 
          label: "Delete", 
          onSelect: (row) => {
            deleteComm.mutate(row.id, {
              onSuccess: () => toast.success("Communication deleted."),
              onError: (e: any) => toast.error(e.message || "Cannot delete published communication")
            });
          } 
        },
      ]}
    />
  );
}
