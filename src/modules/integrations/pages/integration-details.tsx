import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { useIntegrations } from "../hooks/integrations.hooks";
import { IntegrationConnection } from "../types/integrations.types";
import { useRouterState } from "@tanstack/react-router";
import { RefreshCw, Unplug, CheckCircle2, AlertCircle } from "lucide-react";

export function IntegrationDetailsPage() {
  const { data = [] } = useIntegrations();
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/").pop() || "";

  const record = (data.find((c) => c.id === id) || data[0] || null) as any as IntegrationConnection;

  if (!record) return null;

  return (
    <DetailsPageTemplate
      title={record.name}
      description="Integration Configuration & Logs"
      crumbs={[
        { label: "System / Admin" },
        { label: "Integrations", to: "/integrations" },
        { label: "Connected", to: "/integrations/connected" },
        { label: record.name },
      ]}
      meta={
        <>
          <StatusChip status={record.status === "Connected" ? "published" : "suspended"} />
          <span className="text-xs text-muted-foreground">{record.category}</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Test Connection
          </Button>
          <Button variant="outline" className="text-destructive">
            <Unplug className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </>
      }
      metrics={[
        { label: "Status", value: record.status },
        { label: "Connected By", value: record.connectedBy },
        { label: "Last Sync", value: record.lastSync },
        { label: "API Usage", value: record.apiUsage.toLocaleString() },
      ]}
      overview={
        <>
          <SectionCard title="Configuration" description="OAuth scopes and mapping">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded border border-border bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase mb-2">Granted Scopes</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Read User Profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Write to Repository
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Read Email Addresses
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded border border-border bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase mb-2">Sync Settings</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-sm">Auto-sync Frequency</span>
                    <span className="text-sm font-medium">15 Minutes</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-sm">Sync Direction</span>
                    <span className="text-sm font-medium">Bidirectional</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Recent Sync Events" description="Integration transaction logs">
            <div className="rounded border border-border overflow-hidden bg-surface">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-2 font-medium">Event</th>
                    <th className="px-4 py-2 font-medium">Time</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2">Webhook Delivered (Repo Push)</td>
                    <td className="px-4 py-2 text-muted-foreground">2 mins ago</td>
                    <td className="px-4 py-2 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">120ms</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Full User Sync</td>
                    <td className="px-4 py-2 text-muted-foreground">1 hour ago</td>
                    <td className="px-4 py-2 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">4.2s</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">OAuth Token Refresh</td>
                    <td className="px-4 py-2 text-muted-foreground">2 hours ago</td>
                    <td className="px-4 py-2 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">80ms</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Permission Scope Check</td>
                    <td className="px-4 py-2 text-muted-foreground">Yesterday</td>
                    <td className="px-4 py-2 text-destructive">
                      <AlertCircle className="w-4 h-4" />
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">50ms</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      }
    />
  );
}
