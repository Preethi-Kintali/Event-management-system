import { createFileRoute } from "@tanstack/react-router";
import { ExecutionsPage } from "@/modules/workflows/pages/executions";

export const Route = createFileRoute("/workflows/executions")({
  head: () => ({
    meta: [{ title: "Execution History · Ascent Platform" }],
  }),
  component: ExecutionsPage,
});
