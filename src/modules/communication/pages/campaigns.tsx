import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { CommunicationService } from "../services/communication.service";
import { Campaign } from "../types/communication.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";

const columns: Column<Campaign>[] = [
  {
    key: "name",
    header: "Campaign Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "channel",
    header: "Channel",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.channel}</Badge>,
  },
  { key: "audience", header: "Audience", sortable: true },
  {
    key: "delivered",
    header: "Delivery",
    sortable: false,
    render: (row) => {
      if (row.status === "Draft" || row.status === "Scheduled")
        return <span className="text-muted-foreground">—</span>;
      const rate = row.sent > 0 ? (row.delivered / row.sent) * 100 : 0;
      return (
        <div className="flex items-center gap-2 w-24">
          <Progress value={rate} className="h-1.5" />
          <span className="text-xs">{Math.round(rate)}%</span>
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Completed") statusId = "published";
      if (row.status === "Draft") statusId = "draft";
      if (row.status === "Sending") statusId = "active";
      if (row.status === "Failed") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
  {
    key: "scheduledDate",
    header: "Date",
    sortable: true,
    render: (row) => <span>{row.scheduledDate || "—"}</span>,
  },
];

export function CommunicationCampaignsPage() {
  const [data, setData] = useState<Campaign[]>([]);

  useEffect(() => {
    CommunicationService.getCampaigns().then(setData);
  }, []);

  return (
    <ListPageTemplate<Campaign>
      title="Campaigns"
      description="Manage mass communications and targeted broadcasts."
      crumbs={[
        { label: "Engagement" },
        { label: "Communication", to: "/communication" },
        { label: "Campaigns" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "audience"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["Draft", "Scheduled", "Sending", "Completed", "Failed"],
      }}
      createLabel="New Campaign"
      createTo="/communication/campaigns/new"
      rowActions={[
        { label: "View Report", onSelect: () => {} },
        { label: "Edit", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Pause", onSelect: () => {} },
      ]}
    />
  );
}
