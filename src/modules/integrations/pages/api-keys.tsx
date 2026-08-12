import { useState } from "react";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "../hooks/integrations.hooks";
import { ApiKey } from "../types/integrations.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, AlertTriangle } from "lucide-react";

export function ApiKeysPage() {
  const { data = [], isLoading } = useApiKeys();
  const createMutation = useCreateApiKey();
  const revokeMutation = useRevokeApiKey();

  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState("Development");
  const [newKeyExpires, setNewKeyExpires] = useState("30");
  
  const [rawKeyData, setRawKeyData] = useState<{ rawKey: string, name: string } | null>(null);

  const handleCreate = async () => {
    if (!newKeyName.trim()) { toast.error("Key name is required"); return; }
    try {
      const res = await createMutation.mutateAsync({
        name: newKeyName,
        environment: newKeyEnv,
        ...(newKeyExpires ? { expiresInDays: parseInt(newKeyExpires) } : {})
      });
      if (res?.data?.rawKey) {
        setRawKeyData({ rawKey: res.data.rawKey, name: res.data.name });
      }
      setCreateOpen(false);
      setNewKeyName("");
      toast.success("API key created successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to create API key");
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This cannot be undone.")) return;
    try {
      await revokeMutation.mutateAsync(id);
      toast.success("API key revoked");
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke API key");
    }
  };

  const columns: Column<ApiKey>[] = [
    {
      key: "name",
      header: "Key Name",
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "maskedKey",
      header: "Secret Key",
      sortable: false,
      render: (row) => <code className="text-xs bg-muted/50 px-2 py-1 rounded">{row.maskedKey}</code>,
    },
    {
      key: "environment",
      header: "Environment",
      sortable: true,
      render: (row) => <Badge variant="outline">{row.environment}</Badge>,
    },
    { key: "createdBy", header: "Created By", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => {
        let statusId = "pending";
        if (row.status === "Active") statusId = "active";
        if (row.status === "Revoked") statusId = "suspended";
        if (row.status === "Expired") statusId = "archived";
        return <StatusChip status={statusId as any} />;
      },
    },
  ];

  return (
    <>
      <ListPageTemplate<ApiKey>
        title="API Keys"
        description="Manage access credentials for the platform's public API."
        crumbs={[
          { label: "System / Admin" },
          { label: "Integrations", to: "/integrations" },
          { label: "API Keys" },
        ]}
        columns={columns}
        rows={data}
        loading={isLoading}
        searchKeys={["name", "createdBy"]}
        facet={{
          label: "Environment",
          key: "environment",
          options: ["Production", "Staging", "Development"],
        }}
        createLabel="Generate New Key"
        onCreate={() => setCreateOpen(true)}
        rowActions={[
          { label: "Revoke Access", onSelect: (row) => handleRevoke(row.id) },
        ]}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate API Key</DialogTitle>
            <DialogDescription>Create a new API key for external integrations.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Key Name</Label>
              <Input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="e.g. Mobile App Prod" />
            </div>
            <div className="space-y-2">
              <Label>Environment</Label>
              <Select value={newKeyEnv} onValueChange={setNewKeyEnv}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Staging">Staging</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expiration</Label>
              <Select value={newKeyExpires} onValueChange={setNewKeyExpires}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                  <SelectItem value="">Never Expire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>Generate Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rawKeyData} onOpenChange={() => setRawKeyData(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription>
              Please copy this key and store it securely. You will not be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/30 rounded-md border flex items-center justify-between mt-4">
            <code className="text-sm font-mono break-all pr-4">{rawKeyData?.rawKey}</code>
            <Button size="icon" variant="ghost" onClick={() => {
              navigator.clipboard.writeText(rawKeyData?.rawKey || "");
              toast.success("Copied to clipboard");
            }}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4 text-amber-600 bg-amber-500/10 p-3 rounded-md text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>If you lose this key, you will need to generate a new one and revoke this one.</p>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setRawKeyData(null)}>I have saved it safely</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
