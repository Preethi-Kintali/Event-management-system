import { createFileRoute } from "@tanstack/react-router";
import { WorkflowListPage } from "@/modules/workflows/pages/workflow-list";

export const Route = createFileRoute("/workflows/list")({
  head: () => ({
    meta: [{ title: "Workflow List · Ascent Platform" }],
  }),
  component: WorkflowListPage,
});
