import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Save, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard, type Crumb } from "@/components/ds/page-header";
import { Stepper } from "@/components/ds/timeline";

export interface WizardStep {
  title: string;
  description: string;
  content: ReactNode;
}

export function FormPageTemplate({
  title,
  description,
  crumbs,
  steps,
  publishLabel = "Publish",
  actions,
}: {
  title: string;
  description: string;
  crumbs: Crumb[];
  steps: WizardStep[];
  publishLabel?: string;
  actions?: ReactNode;
}) {
  const [current, setCurrent] = useState(0);
  const step = steps[current]!;
  const last = current === steps.length - 1;

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        crumbs={crumbs}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Draft saved")}>
              <Save className="h-4 w-4" />
              Save draft
            </Button>
            <Button onClick={() => toast.success(`${publishLabel} succeeded`)}>
              <Send className="h-4 w-4" />
              {publishLabel}
            </Button>
          </>
        }
      />

      <div className="card-surface p-5">
        <Stepper
          steps={steps.map((s) => s.title)}
          current={current}
          onStepClick={(index) => setCurrent(index)}
        />
      </div>

      <motion.div
        key={current}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionCard title={step.title} description={step.description}>
          {step.content}
        </SectionCard>
      </motion.div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Step {current + 1} of {steps.length} · changes autosave every 30 seconds
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          >
            Back
          </Button>
          <Button
            onClick={() =>
              last
                ? toast.success(`${publishLabel} succeeded`)
                : setCurrent((c) => Math.min(steps.length - 1, c + 1))
            }
          >
            {last ? publishLabel : "Continue"}
          </Button>
        </div>
      </div>
    </>
  );
}
