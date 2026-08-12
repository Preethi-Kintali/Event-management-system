import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { SecurityService } from "../services/security.service";
import { SecurityPolicy } from "../types/security.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

import { useSecurityPolicy, useUpdateSecurityPolicy } from "../hooks/security.hooks";
import { useAuth } from "@/lib/auth";

export function AuthenticationSecurityPage() {
  const { activeOrganization } = useAuth();
  const tenantId = activeOrganization || "";
  const { data: policy, isLoading } = useSecurityPolicy(tenantId);
  const updatePolicyMutation = useUpdateSecurityPolicy(tenantId);
  
  const [formData, setFormData] = useState<SecurityPolicy | null>(null);

  useEffect(() => {
    if (policy) setFormData(policy);
  }, [policy]);

  const handleSave = () => {
    if (formData) {
      updatePolicyMutation.mutate(formData);
    }
  };

  if (isLoading || !formData) return null;

  return (
    <>
      <PageHeader
        title="Authentication & Access"
        description="Configure login policies, SSO, and Multi-Factor Authentication."
        crumbs={[
          { label: "System / Admin" },
          { label: "Security", to: "/security" },
          { label: "Authentication" },
        ]}
      />

      <div className="max-w-4xl mt-6">
        <Tabs defaultValue="password">
          <div className="flex justify-between items-center mt-6">
            <TabsList>
              <TabsTrigger value="password">Password Policy</TabsTrigger>
              <TabsTrigger value="mfa">MFA</TabsTrigger>
              <TabsTrigger value="sso">Single Sign-On (SSO)</TabsTrigger>
            </TabsList>
            <Button onClick={handleSave} disabled={updatePolicyMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {updatePolicyMutation.isPending ? "Saving..." : "Save Policies"}
            </Button>
          </div>

          <TabsContent value="password" className="space-y-6">
            <SectionCard
              title="Password Requirements"
              description="Enforce strong passwords for all users."
            >
              <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
                <div className="space-y-2">
                  <Label>Minimum Password Length</Label>
                  <Input 
                    type="number" 
                    value={formData.minPasswordLength} 
                    onChange={e => setFormData({ ...formData, minPasswordLength: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password Expiry (Days)</Label>
                  <Input 
                    type="number" 
                    value={formData.passwordExpiryDays} 
                    onChange={e => setFormData({ ...formData, passwordExpiryDays: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Lockout Threshold</Label>
                  <Input 
                    type="number" 
                    value={formData.lockoutThreshold} 
                    onChange={e => setFormData({ ...formData, lockoutThreshold: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4 max-w-2xl border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Uppercase Letter</Label>
                    <p className="text-xs text-muted-foreground">
                      Password must contain at least one uppercase letter.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Number</Label>
                    <p className="text-xs text-muted-foreground">
                      Password must contain at least one number.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Special Character</Label>
                    <p className="text-xs text-muted-foreground">
                      Password must contain at least one special character.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="mfa" className="space-y-6">
            <SectionCard
              title="Multi-Factor Authentication"
              description="Add an extra layer of security to user accounts."
            >
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface">
                  <div className="space-y-0.5">
                    <Label>Enforce MFA for all users</Label>
                    <p className="text-sm text-muted-foreground">
                      Require every user to configure MFA on their next login.
                    </p>
                  </div>
                  <Switch 
                    checked={formData.mfaEnabled} 
                    onCheckedChange={c => setFormData({ ...formData, mfaEnabled: c })} 
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enforce MFA for Admins only</Label>
                    <p className="text-sm text-muted-foreground">
                      Only require MFA for users with administrative roles.
                    </p>
                  </div>
                  <Switch 
                    checked={formData.mfaRequiredForAdmins}
                    onCheckedChange={c => setFormData({ ...formData, mfaRequiredForAdmins: c })}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <Label>Allowed Authentication Methods</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked />
                      <span className="text-sm">Authenticator App (TOTP)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked />
                      <span className="text-sm">SMS Verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch />
                      <span className="text-sm">Email Verification</span>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="sso" className="space-y-6">
            <SectionCard
              title="Single Sign-On"
              description="Allow users to log in using external identity providers."
            >
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable SAML/SSO Login</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to authenticate using your corporate Identity Provider.
                    </p>
                  </div>
                  <Switch 
                    checked={formData.ssoEnabled}
                    onCheckedChange={c => setFormData({ ...formData, ssoEnabled: c })}
                  />
                </div>
                  
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label>SSO Protocol</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option>SAML 2.0</option>
                      <option>OpenID Connect</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Provider Name</Label>
                    <Input 
                      value={formData.ssoProvider || ""} 
                      onChange={e => setFormData({ ...formData, ssoProvider: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sign-On URL</Label>
                    <Input defaultValue="https://idp.okta.com/app/sso/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>X.509 Certificate</Label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs"
                      defaultValue={
                        "-----BEGIN CERTIFICATE-----\nMIIDpDCCAoygAwIBAgIGAX...\n-----END CERTIFICATE-----"
                      }
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
