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

export function AuthenticationSecurityPage() {
  const [policy, setPolicy] = useState<SecurityPolicy | null>(null);

  useEffect(() => {
    SecurityService.getPolicy().then(setPolicy);
  }, []);

  if (!policy) return null;

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
        actions={
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        }
      />

      <div className="max-w-4xl mt-6">
        <Tabs defaultValue="password">
          <TabsList className="mb-6">
            <TabsTrigger value="password">Password Policy</TabsTrigger>
            <TabsTrigger value="mfa">Multi-Factor Auth</TabsTrigger>
            <TabsTrigger value="sso">Single Sign-On (SSO)</TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="space-y-6">
            <SectionCard
              title="Password Requirements"
              description="Enforce strong passwords for all users."
            >
              <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
                <div className="space-y-2">
                  <Label>Minimum Password Length</Label>
                  <Input type="number" defaultValue={policy.minPasswordLength} />
                </div>
                <div className="space-y-2">
                  <Label>Password Expiry (Days)</Label>
                  <Input type="number" defaultValue={policy.passwordExpiryDays} />
                </div>
                <div className="space-y-2">
                  <Label>Failed Login Lockout Threshold</Label>
                  <Input type="number" defaultValue={policy.lockoutThreshold} />
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
                    <Label className="text-base">Enable MFA Platform-wide</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to configure 2FA on their accounts.
                    </p>
                  </div>
                  <Switch defaultChecked={policy.mfaEnabled} />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enforce for Administrators</Label>
                    <p className="text-sm text-muted-foreground">
                      Require MFA for any user with Admin privileges.
                    </p>
                  </div>
                  <Switch defaultChecked={policy.mfaRequiredForAdmins} />
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
                    <Label>Enable Enterprise SSO</Label>
                    <p className="text-xs text-muted-foreground">Allow login via SAML or OIDC.</p>
                  </div>
                  <Switch defaultChecked={policy.ssoEnabled} />
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label>Identity Provider Type</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option>SAML 2.0</option>
                      <option>OpenID Connect</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Provider Name</Label>
                    <Input defaultValue={policy.ssoProvider} />
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
