import { createFileRoute } from "@tanstack/react-router";
import { AICopilotDashboard } from "@/modules/ai-copilot/pages/dashboard";

export const Route = createFileRoute("/ai-copilot/")({
  head: () => ({
    meta: [{ title: "AI Copilot · Ascent Platform" }],
  }),
  component: AICopilotDashboard,
});
