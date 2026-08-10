import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ds/file-upload";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Ascent Platform" },
      { name: "description", content: "Organization preferences, branding, security and notification controls." },
      { property: "og:title", content: "Settings · Ascent Platform" },
      { property: "og:description", content: "Organization preferences, branding, security and notification controls." },
    ],
  }),
  component: SettingsPage,
});

const toggles = [
  { id: "t1", title: "Require MFA for admins", desc: "Enforce two-factor authentication for privileged roles." },
  { id: "t2", title: "SSO enforcement", desc: "Block password sign-in for members of verified domains." },
  { id: "t3", title: "IP allowlist", desc: "Restrict admin console access to approved networks." },
  { id: "t4", title: "Session timeout", desc: "Sign users out after 30 minutes of inactivity." },
];

const channels = [
  { id: "c1", title: "Registration approvals", desc: "Email + in-app when a registration needs review." },
  { id: "c2", title: "Evaluation deadlines", desc: "Remind judges 48 and 12 hours before lock." },
  { id: "c3", title: "Payment failures", desc: "Alert billing owners immediately." },
  { id: "c4", title: "Weekly digest", desc: "Summary of events, submissions and revenue." },
];

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Workspace configuration for Northwind Institute of Technology."
        crumbs={[{ label: "Workspace" }, { label: "Settings" }]}
        actions={<Button onClick={() => toast.success("Settings saved")}>Save changes</Button>}
      />
      <Tabs defaultValue="general">
        <TabsList className="w-full justify-start overflow-x-auto scrollbar-thin">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-6">
          <SectionCard title="Organization preferences" description="Defaults applied to new events">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="org-name">Organization name</Label>
                <Input id="org-name" defaultValue="Northwind Institute of Technology" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org-domain">Primary domain</Label>
                <Input id="org-domain" defaultValue="northwind.edu" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org-tz">Default timezone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger id="org-tz"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">Asia/Kolkata</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="cet">Europe/Berlin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org-currency">Billing currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="org-currency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="inr">INR</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="branding" className="mt-4 space-y-6">
          <SectionCard title="Brand identity" description="Applied to certificates and public pages">
            <div className="grid gap-6 lg:grid-cols-2">
              <FileUpload label="Logo & assets" hint="SVG or PNG, transparent background" />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="accent">Accent colour</Label>
                  <Input id="accent" defaultValue="#2F6BE4" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subdomain">Public subdomain</Label>
                  <Input id="subdomain" defaultValue="northwind.ascent.app" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface/60 p-4">
                  <div>
                    <p className="text-sm font-medium">White-label certificates</p>
                    <p className="text-xs text-muted-foreground">Remove platform branding from PDFs.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-6">
          <Alert>
            <AlertTitle>Security posture: strong</AlertTitle>
            <AlertDescription>
              MFA is enforced for 84% of members. Enable SSO enforcement to reach the enterprise baseline.
            </AlertDescription>
          </Alert>
          <SectionCard title="Access controls" description="Applies to all admin surfaces" padded={false}>
            <ul className="divide-y divide-border">
              {toggles.map((t, i) => (
                <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <Switch defaultChecked={i !== 2} aria-label={t.title} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-6">
          <SectionCard title="Notification settings" description="Choose what your team receives" padded={false}>
            <ul className="divide-y divide-border">
              {channels.map((c, i) => (
                <li key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                  <Switch defaultChecked={i !== 3} aria-label={c.title} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </>
  );
}
