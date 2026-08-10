import { createFileRoute } from "@tanstack/react-router";
import { AIValidationDashboard } from "@/modules/ai-validation/pages/dashboard";

export const Route = createFileRoute("/ai-validation/")({
  head: () => ({
    meta: [{ title: "AI Validation · Ascent Platform" }],
  }),
  component: AIValidationDashboard,
});
