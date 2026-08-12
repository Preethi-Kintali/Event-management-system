import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useMessageLogs } from "../services/communications.api";
import { MessageLog } from "../types/communication.types";
import { Badge } from "@/components/ui/badge";

const columns: Column<MessageLog>[] = [
  {
    key: "recipient",
    header: "Recipient",
    sortable: true,
    render: (row) => <span className="font-medium">{row.recipient}</span>,
  },
  {
    key: "channel",
    header: "Channel",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.channel}</Badge>,
  },
  { key: "campaign", header: "Campaign", sortable: true },
  {
    key: "sentAt",
    header: "Sent At",
    sortable: true,
    render: (row) => <span className="tabular-nums text-xs">{row.sentAt || "—"}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Delivered") statusId = "published";
      if (row.status === "Sent") statusId = "active";
      if (row.status === "Failed") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
  {
    key: "failureReason",
    header: "Details",
    sortable: false,
    render: (row) => <span className="text-xs text-destructive">{row.failureReason || ""}</span>,
  },
];

export function CommunicationLogsPage() {
  const { data = [] } = useMessageLogs();

  return (
    <ListPageTemplate<any>
      title="Message Logs"
      description="Direct delivery tracking and error logs for all messages."
      crumbs={[
        { label: "Engagement" },
        { label: "Communication", to: "/communication" },
        { label: "Logs" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["recipient", "campaign"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["Queued", "Sent", "Delivered", "Failed", "Read"],
      }}
      rowActions={[{ label: "View Payload", onSelect: () => {} }]}
    />
  );
}
