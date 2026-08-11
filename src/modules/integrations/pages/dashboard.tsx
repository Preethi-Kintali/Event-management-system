import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { IntegrationsService } from "../services/integrations.service";
import { IntegrationDashboardSummary, IntegrationConnection } from "../types/integrations.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Plus, Webhook, Key, CheckCircle2, AlertCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function IntegrationsDashboard() {
  const [summary, setSummary] = useState<IntegrationDashboardSummary | null>(null);
  const [connected, setConnected] = useState<IntegrationConnection[]>([]);

  useEffect(() => {
    IntegrationsService.getDashboardSummary().then(setSummary);
    IntegrationsService.getConnected().then(setConnected);
  }, []);

  return (
    <>
      <PageHeader
        title="Integration Hub"
        description="Connect third-party services and manage API credentials."
        crumbs={[{ label: "System / Admin" }, { label: "Integrations" }]}
        actions={
          <Button asChild>
            <Link to="/integrations/marketplace">
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Link>
          </Button>
        }
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Connected" value={summary.connected.toString()} index={0} />
          <StatCard
            label="Connection Errors"
            value={summary.errors.toString()}
            delta={-1}
            index={1}
          />
          <StatCard
            label="API Calls (30d)"
            value={(summary.apiCalls30d / 1000000).toFixed(1) + "M"}
            delta={14.2}
            index={2}
          />
          <StatCard
            label="Webhook Events"
            value={(summary.webhookEvents30d / 1000).toFixed(1) + "K"}
            index={3}
          />
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="h-10 justify-start" asChild>
              <Link to="/integrations/api-keys">
                <Key className="w-4 h-4 mr-2 text-primary" /> Manage API Keys
              </Link>
            </Button>
            <Button variant="outline" className="h-10 justify-start" asChild>
              <Link to="/integrations/webhooks">
                <Webhook className="w-4 h-4 mr-2 text-primary" /> Manage Webhooks
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Active Integrations" description="Recently synced services">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Sync</th>
                  <th className="px-4 py-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {connected.map((conn) => (
                  <tr key={conn.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium flex items-center gap-3">
                      <Avatar className="w-6 h-6 rounded bg-muted">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/icons/svg?seed=${conn.name}&icon=plug`}
                        />
                        <AvatarFallback>{conn.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conn.name}
                    </td>
                    <td className="px-4 py-3">
                      {conn.status === "Connected" ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-destructive text-xs font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> Error
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{conn.lastSync}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="link" size="sm" asChild className="h-auto p-0">
                        <Link to={`/integrations/${conn.id}` as any}>Configure</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="API Usage" description="Top consumers">
            <div className="space-y-4 pt-2">
              {[
                { label: "Internal Dashboard", val: 850000, pct: 58 },
                { label: "Mobile App Production", val: 420000, pct: 29 },
                { label: "Partner Portal Sync", val: 180000, pct: 13 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {item.val.toLocaleString()} reqs
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
