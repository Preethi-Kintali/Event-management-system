import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { License } from "../types/platform-admin.types";
import { usePlatformSubscriptions } from "../hooks/platform-admin.hooks";
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
          <span>{Math.max(0, row.seats - row.usedSeats)} remaining</span>
        </div>
        <Progress value={(row.usedSeats / row.seats) * 100} className="h-1.5" />
      </div>
    ),
  },
  { 
    key: "startDate", 
    header: "Start Date", 
    sortable: true,
    render: (row) => <span>{new Date(row.startDate).toLocaleDateString()}</span>
  },
  { 
    key: "expiryDate", 
    header: "Expiry Date", 
    sortable: true,
    render: (row) => <span>{new Date(row.expiryDate).toLocaleDateString()}</span>
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

export function LicensesPage() {
  const { data = [], isLoading, isError } = usePlatformSubscriptions();

  const totalSeats = data.reduce((acc, curr) => acc + curr.seats, 0);
  const totalUsed = data.reduce((acc, curr) => acc + curr.usedSeats, 0);

  return (
    <ListPageTemplate<License>
      title="License Management"
      description="Monitor seat allocations and utilization across organizations."
      crumbs={[{ label: "Platform" }, { label: "Licenses" }]}
      columns={columns}
      rows={data}
      loading={isLoading}
      error={isError}
      searchKeys={["org", "type"]}
      stats={[
        { label: "Total Licenses", value: data.length.toString(), delta: 0 },
        { label: "Active Seats", value: totalUsed.toLocaleString(), progress: totalSeats > 0 ? Math.round((totalUsed / totalSeats) * 100) : 0 },
      ]}
      facet={{ label: "Type", key: "type", options: Array.from(new Set(data.map(l => l.type))) }}
      createLabel="Allocate License"
    />
  );
}

