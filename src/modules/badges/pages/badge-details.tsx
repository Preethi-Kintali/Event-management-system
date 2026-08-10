import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { BadgesService } from "../services/badges.service";
import { Badge } from "../types/badges.types";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Award, ShieldCheck } from "lucide-react";

export function BadgeDetailsPage() {
  const [record, setRecord] = useState<Badge | null>(null);
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/").pop() || "";

  useEffect(() => {
    BadgesService.getBadgeById(id).then((r) => setRecord(r || null));
  }, [id]);

  if (!record) return null;

  return (
    <DetailsPageTemplate
      title={record.name}
      description={record.description}
      crumbs={[{ label: "Engagement" }, { label: "Badges", to: "/badges" }, { label: record.name }]}
      meta={
        <>
          <StatusChip
            status={
              record.status === "Active"
                ? "active"
                : record.status === "Draft"
                  ? "draft"
                  : "archived"
            }
          />
          <span className="text-xs text-muted-foreground">Created {record.createdDate}</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">Edit Badge</Button>
          <Button variant="outline">Archive</Button>
        </>
      }
      metrics={[
        { label: "Category", value: record.category },
        { label: "Level", value: record.level },
        { label: "XP Value", value: record.points.toString() },
        { label: "Total Recipients", value: record.recipients.toString() },
      ]}
      overview={
        <>
          <SectionCard title="Badge Art" description="Visual representation">
            <div className="flex items-center justify-center p-12 bg-muted/30 rounded-lg border border-dashed border-border">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-primary/20 shadow-inner">
                <Award className="w-16 h-16 text-primary" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Award Criteria" description="Rules for earning">
            <div className="flex gap-4">
              <ShieldCheck className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Automated Triggers</p>
                <p className="text-sm text-muted-foreground">{record.description}</p>
              </div>
            </div>
          </SectionCard>
        </>
      }
    />
  );
}
