import { createFileRoute } from "@tanstack/react-router";
import { TemplatesPage } from "@/modules/workflows/pages/templates";

export const Route = createFileRoute("/workflows/templates")({
  head: () => ({
    meta: [{ title: "Workflow Templates · Ascent Platform" }],
  }),
  component: TemplatesPage,
});
