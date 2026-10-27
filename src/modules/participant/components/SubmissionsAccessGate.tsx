import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface SubmissionsAccessGateProps {
  accessStatus: {
    allowed?: boolean;
    registrationStatus?: string;
    isPaidEvent?: boolean;
    paymentStatus?: string;
  };
}

export const SubmissionsAccessGate: React.FC<SubmissionsAccessGateProps> = ({ accessStatus }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm rounded-xl">
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="p-4 bg-amber-100 dark:bg-amber-900/50 rounded-full">
          <Lock className="h-10 w-10 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">🔒 Submissions Locked</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Complete your event registration and payment to access problem statements and round submissions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
          <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-background">
            Registration:{" "}
            {accessStatus.registrationStatus === "PENDING_PAYMENT"
              ? "Pending Payment ⚠️"
              : accessStatus.registrationStatus === "APPROVED" ||
                accessStatus.registrationStatus === "CONFIRMED" ||
                accessStatus.registrationStatus === "PAID"
              ? "Confirmed ✓"
              : accessStatus.registrationStatus || "Pending"}
          </Badge>
          {accessStatus.isPaidEvent && (
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-background">
              Payment:{" "}
              {accessStatus.paymentStatus === "SUCCEEDED" || accessStatus.paymentStatus === "PAID"
                ? "Paid ✓"
                : accessStatus.paymentStatus || "Pending"}
            </Badge>
          )}
        </div>
        <Button
          className="gap-2 text-xs font-semibold"
          onClick={() => navigate({ to: "/participant/discover-events" })}
        >
          Complete Registration
        </Button>
      </div>
    </Card>
  );
};
