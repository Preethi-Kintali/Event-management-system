import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { AICopilotService } from "../services/ai-copilot.service";
import { AICopilotDashboardSummary, AIRequest } from "../types/ai-copilot.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Sparkles, MessageSquare, FileText, CheckCircle2, XCircle } from "lucide-react";

export function AICopilotDashboard() {
  const [summary, setSummary] = useState<AICopilotDashboardSummary | null>(null);
  const [requests, setRequests] = useState<AIRequest[]>([]);

  useEffect(() => {
    AICopilotService.getDashboardSummary().then(setSummary);
    AICopilotService.getRecentRequests().then(setRequests);
  }, []);

  return (
    <>
      <PageHeader
        title="AI Copilot"
        description="Monitor artificial intelligence usage and performance across the platform."
        crumbs={[{ label: "AI & Automation" }, { label: "AI Copilot" }]}
        actions={
          <Button asChild>
            <Link to="/ai-copilot/assistant">
              <Sparkles className="w-4 h-4 mr-2" />
              Ask AI Assistant
            </Link>
          </Button>
        }
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total Requests"
            value={summary.totalRequests.toLocaleString()}
            delta={12.5}
            index={0}
          />
          <StatCard
            label="Success Rate"
            value={`${summary.successRate}%`}
            progress={summary.successRate}
            index={1}
          />
          <StatCard
            label="Tokens Used"
            value={(summary.tokensUsed / 1000000).toFixed(1) + "M"}
            index={2}
          />
          <StatCard
            label="Avg Latency"
            value={`${summary.avgResponseTimeMs}ms`}
            delta={-4.2}
            index={3}
          />
          <StatCard label="Est. Cost" value={`$${summary.estimatedCostUSD.toFixed(2)}`} index={4} />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Quick Actions"
          description="Generate content with AI"
          className="xl:col-span-1"
        >
          <div className="grid gap-3">
            <Button variant="outline" className="justify-start h-12" asChild>
              <Link to="/ai-copilot/event-description">
                <FileText className="w-4 h-4 mr-3 text-primary" />
                Generate Event Description
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12" asChild>
              <Link to="/ai-copilot/rubric">
                <FileText className="w-4 h-4 mr-3 text-emerald-500" />
                Generate Evaluation Rubric
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12" asChild>
              <Link to="/ai-copilot/email">
                <MessageSquare className="w-4 h-4 mr-3 text-blue-500" />
                Generate Email Template
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12" asChild>
              <Link to="/ai-copilot/reports">
                <FileText className="w-4 h-4 mr-3 text-amber-500" />
                Generate Insights Report
              </Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Activity"
          description="Latest API requests to the LLM"
          className="xl:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Feature</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Tokens</th>
                  <th className="px-4 py-3 font-medium text-right">Latency</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{req.feature}</td>
                    <td className="px-4 py-3">
                      {req.status === "Success" ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-destructive">
                          <XCircle className="w-4 h-4" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{req.tokens}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {req.durationMs}ms
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{req.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
