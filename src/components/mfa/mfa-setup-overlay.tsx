import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useSetupMfa, useVerifySetupMfa } from "@/modules/security/hooks/security.hooks";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export function MfaSetupOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; otpauth: string } | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [code, setCode] = useState("");
  const { activeOrganization } = useAuth();
  
  const setupMfa = useSetupMfa(activeOrganization || "");
  const verifySetupMfa = useVerifySetupMfa(activeOrganization || "");

  useEffect(() => {
    const handleMfaRequired = () => {
      setIsOpen(true);
      if (!setupData && !recoveryCodes) {
        initiateSetup();
      }
    };

    window.addEventListener("auth:mfa_required", handleMfaRequired);
    return () => window.removeEventListener("auth:mfa_required", handleMfaRequired);
  }, [activeOrganization, setupData, recoveryCodes]);

  const initiateSetup = async () => {
    if (!activeOrganization) return;
    try {
      const data = await setupMfa.mutateAsync();
      setSetupData(data as any);
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate MFA setup");
    }
  };

  const handleVerify = async () => {
    if (code.length < 6) return;
    try {
      const data = await verifySetupMfa.mutateAsync(code);
      setRecoveryCodes((data as any).recoveryCodes);
      toast.success("MFA successfully enabled!");
    } catch (error: any) {
      toast.error(error.message || "Invalid code");
    }
  };

  const handleDone = () => {
    setIsOpen(false);
    setSetupData(null);
    setRecoveryCodes(null);
    setCode("");
    // Reload to bypass the 403 now that MFA is setup
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing if we are forced to enroll, unless they are done
      if (!open && !recoveryCodes) {
        toast.error("MFA is required for this organization.");
        return;
      }
      setIsOpen(open);
    }}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            This organization requires Two-Factor Authentication (2FA) to access its resources.
          </DialogDescription>
        </DialogHeader>

        {recoveryCodes ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 text-emerald-500 rounded-md">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">Two-Factor Authentication is now active.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <AlertTriangle className="w-4 h-4" />
                <Label className="font-semibold">Save your recovery codes</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                If you lose access to your authenticator app, you can use these codes to log in. Each code can only be used once. Keep them in a safe place.
              </p>
              
              <div className="grid grid-cols-2 gap-2 p-4 bg-muted/50 rounded-md font-mono text-sm border border-border">
                {recoveryCodes.map((c, i) => (
                  <div key={i}>{c}</div>
                ))}
              </div>
            </div>

            <Button onClick={handleDone} className="w-full">I have saved my codes</Button>
          </div>
        ) : setupData ? (
          <div className="space-y-6 flex flex-col items-center py-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={setupData.otpauth} size={200} />
            </div>
            
            <div className="text-center space-y-1 w-full">
              <p className="text-sm text-muted-foreground">Scan with Google Authenticator, Authy, or similar app.</p>
              <div className="text-xs font-mono p-2 bg-muted rounded truncate">
                {setupData.secret}
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label>Enter 6-digit code</Label>
              <div className="flex gap-2">
                <Input 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                />
                <Button onClick={handleVerify} disabled={code.length < 6 || verifySetupMfa.isPending}>
                  {verifySetupMfa.isPending ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
