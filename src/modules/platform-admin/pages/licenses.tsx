import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { PlatformAdminService } from "../services/platform-admin.service";
import { License } from "../types/platform-admin.types";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const columns: Column<License>[] = [
  {
    key: "org",
    header: "Organization",
    sortable: true,
    render: (row) => <span className="font-medium">{row.org}</span>,
  },
  { key: "type", header: "License Type", sortable: true },
  { key: "seats", header: "Seats", sortable: true },
  {
    key: "usedSeats",
    header: "Usage",
    sortable: true,
    render: (row) => (
      <div className="space-y-1.5 w-full min-w-24">
        <div className="flex justify-between text-xs">
          <span>{row.usedSeats} used</span>
          <span>{row.seats - row.usedSeats} remaining</span>
        </div>
        <Progress value={(row.usedSeats / row.seats) * 100} className="h-1.5" />
      </div>
    ),
  },
  { key: "startDate", header: "Start Date", sortable: true },
  { key: "expiryDate", header: "Expiry Date", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

export function LicensesPage() {
  const [data, setData] = useState<License[]>([]);

  useEffect(() => {
    PlatformAdminService.getLicenses().then(setData);
  }, []);

  return (
    <ListPageTemplate<License>
      title="License Management"
      description="Monitor seat allocations and utilization across organizations."
      crumbs={[{ label: "Platform" }, { label: "Licenses" }]}
      columns={columns}
      rows={data}
      searchKeys={["org", "type"]}
      stats={[
        { label: "Total Licenses", value: "128", delta: 5 },
        { label: "Active Seats", value: "30,120", progress: 85 },
      ]}
      facet={{ label: "Type", key: "type", options: ["Starter", "Growth", "Enterprise"] }}
      createLabel="Allocate License"
    />
  );
}
