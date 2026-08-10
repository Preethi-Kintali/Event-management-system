import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ds/status-chip";
import { PlatformAdminService } from "../services/platform-admin.service";
import { SubscriptionPlan } from "../types/platform-admin.types";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

export function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    PlatformAdminService.getSubscriptionPlans().then(setPlans);
  }, []);

  return (
    <>
      <PageHeader
        title="Subscription Plans"
        description="Manage tier offerings, features and pricing."
        crumbs={[{ label: "Platform" }, { label: "Subscriptions" }]}
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <SectionCard
            key={plan.id}
            title={plan.name}
            description={plan.status === "active" ? "Active Plan" : "Draft"}
            padded={true}
          >
            <div className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-sm text-muted-foreground">
                  /{plan.billingPeriod === "monthly" ? "mo" : "yr"}
                </span>
              </div>
              <p className="text-sm font-medium">{plan.activeSubscribers} active organizations</p>

              <div className="pt-4 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Features
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex gap-2">
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
                <Button variant="outline" className="w-full">
                  Archive
                </Button>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
