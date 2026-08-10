import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { WorkflowsService } from "../services/workflows.service";
import { Workflow } from "../types/workflows.types";
import { useEffect, useState } from "react";
import { useRouterState, Link } from "@tanstack/react-router";
import { Edit3, Pause, Play, CheckCircle2, AlertCircle } from "lucide-react";

export function WorkflowDetailsPage() {
  const [record, setRecord] = useState<Workflow | null>(null);
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/").pop() || "";

  useEffect(() => {
    WorkflowsService.getWorkflowById(id).then((data) => {
      setRecord(data || null);
    });
  }, [id]);

  if (!record) return null;

  return (
    <DetailsPageTemplate
      title={record.name}
      description="Workflow configuration and performance."
      crumbs={[
        { label: "AI & Automation" },
        { label: "Workflows", to: "/workflows" },
        { label: "Rules", to: "/workflows/list" },
        { label: record.name },
      ]}
      meta={
        <StatusChip
          status={
            record.status === "Active"
              ? "active"
              : record.status === "Paused"
                ? "draft"
                : "suspended"
          }
        />
      }
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to="/workflows/new">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Workflow
            </Link>
          </Button>
          {record.status === "Active" ? (
            <Button variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
        </>
      }
      metrics={[
        { label: "Trigger", value: record.trigger },
        { label: "Executions", value: record.executions.toLocaleString() },
        { label: "Success Rate", value: `${record.successRate}%` },
        { label: "Last Run", value: record.lastRun },
      ]}
      overview={
        <>
          <SectionCard title="Rule Definition" description="Visual summary of this automation">
            <div className="flex flex-col items-center max-w-xl mx-auto py-6">
              <div className="w-full border border-border rounded p-4 bg-muted/30 flex justify-between items-center">
                <div className="text-sm font-medium">Trigger: {record.trigger}</div>
                <div className="text-xs text-muted-foreground px-2 py-1 bg-surface rounded">
                  Start
                </div>
              </div>
              <div className="h-6 w-px bg-border"></div>
              {record.actions.map((action, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  <div className="w-full border border-border rounded p-4 bg-surface flex justify-between items-center">
                    <div className="text-sm font-medium">Action: {action}</div>
                    <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                      Execute
                    </div>
                  </div>
                  {i < record.actions.length - 1 && <div className="h-6 w-px bg-border"></div>}
                </div>
              ))}
              <div className="h-6 w-px bg-border"></div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest border border-border px-3 py-1 rounded-full">
                End
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Recent Executions" description="Logs for this specific workflow">
            <div className="rounded border border-border overflow-hidden bg-surface">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3">{record.lastRun}</td>
                    <td className="px-4 py-3 text-emerald-500 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Success
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">1.2s</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">2 hours ago</td>
                    <td className="px-4 py-3 text-emerald-500 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Success
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">1.4s</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Yesterday</td>
                    <td className="px-4 py-3 text-destructive font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Failed
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">5.0s</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="link" asChild>
                <Link to="/workflows/executions">View All Logs</Link>
              </Button>
            </div>
          </SectionCard>
        </>
      }
    />
  );
}
