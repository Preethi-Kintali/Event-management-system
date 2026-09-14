import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Clock } from "lucide-react";

export const Route = createFileRoute("/pending-approval")({
  component: PendingApprovalPage,
});

function PendingApprovalPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Request Pending Approval</h1>
          <p className="text-muted-foreground">
            Your Faculty Coordinator request has been submitted. A Manager must approve your request before you can access Faculty Coordinator features.
          </p>
        </div>

        <Button variant="outline" onClick={() => logout()} className="w-full">
          <LogOut className="mr-2 w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
