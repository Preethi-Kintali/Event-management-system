import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileCode } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface ProblemStatementRequiredBannerProps {
  eventId: string;
}

export const ProblemStatementRequiredBanner: React.FC<ProblemStatementRequiredBannerProps> = ({ eventId }) => {
  const navigate = useNavigate();

  return (
    <Card className="border-amber-500/30 bg-amber-500/5 shadow-sm p-6">
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="p-3 bg-amber-500/10 rounded-full text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Problem Statement Selection Required
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Please select a Problem Statement before accessing round submissions.
        </p>
        <Button
          size="sm"
          variant="default"
          className="text-xs font-semibold gap-1.5"
          onClick={() =>
            navigate({
              to: "/participant/problem-statements",
              search: { eventId },
            })
          }
        >
          <FileCode className="h-4 w-4" /> Go to Problem Statements
        </Button>
      </div>
    </Card>
  );
};
