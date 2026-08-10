import { createFileRoute } from "@tanstack/react-router";
import { WorkflowDetailsPage } from "@/modules/workflows/pages/workflow-details";

export const Route = createFileRoute("/workflows/$id")({
  head: () => ({
    meta: [{ title: "Workflow Details · Ascent Platform" }],
  }),
  component: WorkflowDetailsPage,
});
