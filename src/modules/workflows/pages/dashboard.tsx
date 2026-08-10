import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { WorkflowsService } from "../services/workflows.service";
import { WorkflowDashboardSummary, WorkflowExecution } from "../types/workflows.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Plus, CheckCircle2, AlertCircle, PlayCircle, Loader2 } from "lucide-react";
import { TrendAreaChart } from "@/components/ds/charts";

export function WorkflowsDashboard() {
  const [summary, setSummary] = useState<WorkflowDashboardSummary | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);

  useEffect(() => {
    WorkflowsService.getDashboardSummary().then(setSummary);
    WorkflowsService.getExecutions().then(setExecutions);
  }, []);

  return (
    <>
      <PageHeader
        title="Workflow Automation"
        description="Build and monitor automated rules across the platform."
        crumbs={[{ label: "AI & Automation" }, { label: "Workflows" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/workflows/templates">Browse Templates</Link>
            </Button>
            <Button asChild>
              <Link to="/workflows/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Link>
            </Button>
          </div>
        }
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active Workflows" value={summary.activeWorkflows.toString()} index={0} />
          <StatCard
            label="Total Executions (30d)"
            value={(summary.totalExecutions / 1000).toFixed(1) + "k"}
            delta={5.4}
            index={1}
          />
          <StatCard
            label="Success Rate"
            value={`${summary.successRate}%`}
            progress={summary.successRate}
            index={2}
          />
          <StatCard
            label="Failed Executions"
            value={summary.failedExecutions.toString()}
            index={3}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Execution Volume"
          description="Automated actions triggered over time"
          className="xl:col-span-2"
        >
          <TrendAreaChart
            data={[
              { date: "Mon", success: 1200, failed: 20 },
              { date: "Tue", success: 1350, failed: 15 },
              { date: "Wed", success: 1100, failed: 10 },
              { date: "Thu", success: 2100, failed: 55 },
              { date: "Fri", success: 1800, failed: 25 },
              { date: "Sat", success: 900, failed: 5 },
              { date: "Sun", success: 850, failed: 12 },
            ]}
            xKey="date"
            series={[
              { key: "success", label: "Successful", color: "hsl(var(--primary))" },
              { key: "failed", label: "Failed", color: "hsl(var(--destructive))" },
            ]}
            height={300}
          />
        </SectionCard>

        <SectionCard
          title="Recent Activity"
          description="Latest automation runs"
          className="xl:col-span-1"
        >
          <div className="space-y-4">
            {executions.map((exec) => (
              <div
                key={exec.id}
                className="flex gap-3 items-start border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="mt-0.5">
                  {exec.status === "Successful" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                  {exec.status === "Failed" && <AlertCircle className="w-4 h-4 text-destructive" />}
                  {exec.status === "Running" && (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-medium truncate pr-2">{exec.workflowName}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {exec.started.split(" ")[1]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{exec.triggerEvent}</p>
                  {exec.error && (
                    <p className="text-[10px] text-destructive mt-1 bg-destructive/10 px-2 py-1 rounded inline-block">
                      {exec.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full text-xs" asChild>
              <Link to="/workflows/executions">View All History</Link>
            </Button>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
