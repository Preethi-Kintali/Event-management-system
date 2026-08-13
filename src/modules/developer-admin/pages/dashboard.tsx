import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { SystemDashboardSummary, ServiceHealth } from "../types/developer.types";
import { useDeveloperSummary, useDeveloperHealth } from "../hooks/developer.hooks";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Server, Activity, Database, CloudRain, Cpu, DatabaseZap, Clock } from "lucide-react";
import { TrendAreaChart } from "@/components/ds/charts";

export function DeveloperDashboard() {
  const { data: summary } = useDeveloperSummary();
  const { data: health } = useDeveloperHealth();

  return (
    <>
      <PageHeader
        title="System Administration"
        description="Monitor infrastructure, API traffic, and application health."
        crumbs={[{ label: "System / Admin" }, { label: "Developer" }]}
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="API Requests (24h)"
            value={(summary.apiRequests24h / 1000000).toFixed(2) + "M"}
            delta={4.2}
            index={0}
          />
          <StatCard
            label="Error Rate"
            value={`${summary.globalErrorRate}%`}
            delta={-0.05}
            index={1}
          />
          <StatCard
            label="Avg Response Time"
            value={`${summary.avgResponseTimeMs}ms`}
            delta={-12}
            index={2}
          />
          <StatCard
            label="Pending Queue Jobs"
            value={summary.queueSizeTotal.toString()}
            index={3}
          />
        </div>
      )}

      <div className="grid gap-6 mt-6 xl:grid-cols-3">
        <SectionCard
          title="System Resources"
          description="Current infrastructure utilization"
          className="xl:col-span-1"
        >
          {summary && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-muted-foreground" />{" "}
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className="text-sm tabular-nums">{summary.cpuUsagePct}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${summary.cpuUsagePct}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <DatabaseZap className="w-4 h-4 text-muted-foreground" />{" "}
                    <span className="text-sm font-medium">Memory Usage</span>
                  </div>
                  <span className="text-sm tabular-nums">{summary.memoryUsagePct}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${summary.memoryUsagePct > 80 ? "bg-amber-500" : "bg-primary"}`}
                    style={{ width: `${summary.memoryUsagePct}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />{" "}
                    <span className="text-sm font-medium">Storage Volume</span>
                  </div>
                  <span className="text-sm tabular-nums">{summary.storageUsagePct}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${summary.storageUsagePct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-border grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full text-xs h-9" asChild>
              <Link to="/developer/health">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> All Services
              </Link>
            </Button>
            <Button variant="outline" className="w-full text-xs h-9" asChild>
              <Link to="/developer/logs">
                <Activity className="w-3.5 h-3.5 mr-1.5" /> View Logs
              </Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="API Traffic"
          description="Requests per minute across all endpoints"
          className="xl:col-span-2"
        >
          <TrendAreaChart
            data={Array.from({ length: 24 }).map((_, i) => ({
              time: `${i}:00`,
              requests: Math.floor(Math.random() * 5000) + 2000 + (i > 8 && i < 18 ? 3000 : 0),
            }))}
            xKey="time"
            series={[{ key: "requests", label: "Requests/min" }]}
            height={250}
          />
        </SectionCard>
      </div>
    </>
  );
}
