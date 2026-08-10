import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { DeveloperService } from "../services/developer.service";
import { ApiMetric } from "../types/developer.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<ApiMetric>[] = [
  {
    key: "method",
    header: "Method",
    sortable: true,
    render: (row) => (
      <Badge
        variant="outline"
        className={`font-mono text-[10px] w-14 justify-center ${
          row.method === "GET"
            ? "text-blue-500 border-blue-500/20 bg-blue-500/10"
            : row.method === "POST"
              ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
              : row.method === "PUT" || row.method === "PATCH"
                ? "text-amber-500 border-amber-500/20 bg-amber-500/10"
                : "text-destructive border-destructive/20 bg-destructive/10"
        }`}
      >
        {row.method}
      </Badge>
    ),
  },
  {
    key: "endpoint",
    header: "Endpoint",
    sortable: true,
    render: (row) => <code className="text-xs">{row.endpoint}</code>,
  },
  {
    key: "requests",
    header: "Total Requests",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.requests.toLocaleString()}</span>,
  },
  {
    key: "avgResponseMs",
    header: "Avg Latency",
    sortable: true,
    render: (row) => (
      <span
        className={`tabular-nums ${row.avgResponseMs > 1000 ? "text-destructive font-medium" : ""}`}
      >
        {row.avgResponseMs}ms
      </span>
    ),
  },
  {
    key: "errorRate",
    header: "Error Rate",
    sortable: true,
    render: (row) => (
      <span className={`tabular-nums ${row.errorRate > 1 ? "text-destructive font-medium" : ""}`}>
        {row.errorRate}%
      </span>
    ),
  },
  {
    key: "status",
    header: "Health",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Healthy") statusId = "active";
      if (row.status === "High Latency") statusId = "draft";
      if (row.status === "Failing") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function ApiManagementPage() {
  const [data, setData] = useState<ApiMetric[]>([]);

  useEffect(() => {
    DeveloperService.getApiMetrics().then(setData);
  }, []);

  return (
    <ListPageTemplate<ApiMetric>
      title="API Management"
      description="Monitor REST API endpoint usage, performance, and error rates."
      crumbs={[
        { label: "System / Admin" },
        { label: "Developer", to: "/developer" },
        { label: "API" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["endpoint", "method"]}
      facet={{ label: "Method", key: "method", options: ["GET", "POST", "PUT", "PATCH", "DELETE"] }}
      rowActions={[
        { label: "View Metrics", onSelect: () => {} },
        { label: "View Error Logs", onSelect: () => {} },
        { label: "Configure Rate Limit", onSelect: () => {} },
      ]}
    />
  );
}
