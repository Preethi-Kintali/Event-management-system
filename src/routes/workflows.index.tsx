import { createFileRoute } from "@tanstack/react-router";
import { WorkflowsDashboard } from "@/modules/workflows/pages/dashboard";

export const Route = createFileRoute("/workflows/")({
  head: () => ({
    meta: [{ title: "Workflow Automation · Ascent Platform" }],
  }),
  component: WorkflowsDashboard,
});
