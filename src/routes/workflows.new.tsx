import { createFileRoute } from "@tanstack/react-router";
import { WorkflowBuilderPage } from "@/modules/workflows/pages/workflow-builder";

export const Route = createFileRoute("/workflows/new")({
  head: () => ({
    meta: [{ title: "Workflow Builder · Ascent Platform" }],
  }),
  component: WorkflowBuilderPage,
});
