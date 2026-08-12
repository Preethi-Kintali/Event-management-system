import { useState } from "react";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useWebhooks, useCreateWebhook, useUpdateWebhook, useDeleteWebhook, useWebhookDeliveries, usePingWebhook } from "../hooks/integrations.hooks";
import { Webhook } from "../types/integrations.types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ds/form-controls";

export function WebhooksPage() {
  const { data = [], isLoading } = useWebhooks();
  const createMutation = useCreateWebhook();
  const updateMutation = useUpdateWebhook();
  const deleteMutation = useDeleteWebhook();
  const pingMutation = usePingWebhook();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logsWebhookId, setLogsWebhookId] = useState<string | null>(null);

  const { data: deliveries = [], isLoading: isLoadingDeliveries } = useWebhookDeliveries(logsWebhookId);
  
  const [formName, setFormName] = useState("");
  const [formEndpoint, setFormEndpoint] = useState("");
  const [formEvents, setFormEvents] = useState<string[]>([]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormEndpoint("");
    setFormEvents([]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (webhook: Webhook) => {
    setEditingId(webhook.id);
    setFormName(webhook.name);
    setFormEndpoint(webhook.endpoint);
    setFormEvents(webhook.events);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formEndpoint.trim() || formEvents.length === 0) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: { name: formName, endpoint: formEndpoint, events: formEvents }
        });
        toast.success("Webhook updated");
      } else {
        await createMutation.mutateAsync({
          name: formName,
          endpoint: formEndpoint,
          events: formEvents
        });
        toast.success("Webhook created");
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save webhook");
    }
  };

  const handleToggleStatus = async (webhook: Webhook) => {
    const newStatus = webhook.status === "Disabled" ? "Active" : "Disabled";
    try {
      await updateMutation.mutateAsync({
        id: webhook.id,
        data: { status: newStatus }
      });
      toast.success(`Webhook ${newStatus.toLowerCase()}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Webhook deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete webhook");
    }
  };

  const handlePing = async (id: string) => {
    try {
      toast.info("Sending ping...");
      const res = await pingMutation.mutateAsync(id);
      if (res?.data?.status === "Success") {
        toast.success(`Ping successful (${res.data.responseCode})`);
      } else {
        toast.error(`Ping failed (${res?.data?.responseCode || "Network Error"})`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to ping webhook");
    }
  };

  const columns: Column<Webhook>[] = [
    {
      key: "name",
      header: "Webhook Name",
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "endpoint",
      header: "Endpoint URL",
      sortable: false,
      render: (row) => (
        <code className="text-[10px] text-muted-foreground truncate max-w-[200px] block">
          {row.endpoint}
        </code>
      ),
    },
    {
      key: "events",
      header: "Events",
      sortable: false,
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.events.map((e) => (
            <Badge key={e} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
              {e}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => {
        let statusId = "pending";
        if (row.status === "Active") statusId = "active";
        if (row.status === "Failing") statusId = "suspended";
        if (row.status === "Disabled") statusId = "draft";
        return <StatusChip status={statusId as any} />;
      },
    },
    {
      key: "successRate",
      header: "Delivery Rate",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 w-24">
          <Progress
            value={row.successRate}
            className={`h-1.5 ${row.successRate < 90 ? "[&>div]:bg-destructive" : ""}`}
          />
          <span className="text-xs">{row.successRate}%</span>
        </div>
      ),
    },
    {
      key: "lastDelivery",
      header: "Last Delivery",
      sortable: true,
      render: (row) => <span className="text-xs text-muted-foreground">{row.lastDelivery ? new Date(row.lastDelivery).toLocaleDateString() : 'Never'}</span>,
    },
  ];

  return (
    <>
      <ListPageTemplate<Webhook>
        title="Webhooks"
        description="Configure HTTP callbacks to receive real-time event notifications."
        crumbs={[
          { label: "System / Admin" },
          { label: "Integrations", to: "/integrations" },
          { label: "Webhooks" },
        ]}
        columns={columns}
        rows={data}
        loading={isLoading}
        searchKeys={["name", "endpoint"]}
        facet={{ label: "Status", key: "status", options: ["Active", "Failing", "Disabled"] }}
        createLabel="Add Webhook Endpoint"
        onCreate={handleOpenCreate}
        rowActions={[
          { label: "Edit Configuration", onSelect: (row) => handleOpenEdit(row) },
          { label: "View Delivery Logs", onSelect: (row) => setLogsWebhookId(row.id) },
          { label: "Ping / Test", onSelect: (row) => handlePing(row.id) },
          { label: "Toggle Status", onSelect: (row: any) => handleToggleStatus(row) },
          { label: "Delete", onSelect: (row) => handleDelete(row.id) },
        ]}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Webhook" : "Add Webhook"}</DialogTitle>
            <DialogDescription>
              Receive real-time HTTPS callbacks when events occur.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Production CRM Sync" />
            </div>
            <div className="space-y-2">
              <Label>Endpoint URL</Label>
              <Input type="url" value={formEndpoint} onChange={e => setFormEndpoint(e.target.value)} placeholder="https://api.yourdomain.com/webhook" />
            </div>
            <div className="space-y-2">
              <Label>Events to send</Label>
              <MultiSelect
                label="Events"
                options={["user.created", "user.updated", "payment.succeeded", "payment.failed", "event.started", "registration.completed"]}
                value={formEvents}
                onChange={setFormEvents}
                placeholder="Select events..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? "Save Changes" : "Create Webhook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!logsWebhookId} onOpenChange={(o) => !o && setLogsWebhookId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Webhook Delivery Logs</DialogTitle>
            <DialogDescription>
              Recent delivery attempts for this webhook.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingDeliveries ? (
              <div className="text-sm text-muted-foreground text-center py-4">Loading logs...</div>
            ) : deliveries.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">No deliveries yet.</div>
            ) : (
              <div className="max-h-[60vh] overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-2">Time</th>
                      <th className="text-left font-medium p-2">Event</th>
                      <th className="text-left font-medium p-2">Status</th>
                      <th className="text-left font-medium p-2">Code</th>
                      <th className="text-left font-medium p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((d: any) => (
                      <tr key={d.id} className="border-b last:border-0">
                        <td className="p-2 whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(d.createdAt).toLocaleString()}
                        </td>
                        <td className="p-2">
                          <Badge variant="secondary" className="font-mono text-[10px] py-0">{d.event}</Badge>
                        </td>
                        <td className="p-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${d.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-2 text-xs font-mono">
                          {d.responseCode || 'N/A'}
                        </td>
                        <td className="p-2 text-xs text-muted-foreground">
                          {d.durationMs ? `${d.durationMs}ms` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogsWebhookId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

