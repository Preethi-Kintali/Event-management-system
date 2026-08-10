import { createFileRoute } from "@tanstack/react-router";
import { AIAssistantPage } from "@/modules/ai-copilot/pages/assistant";

export const Route = createFileRoute("/ai-copilot/assistant")({
  head: () => ({
    meta: [{ title: "AI Assistant · Ascent Platform" }],
  }),
  component: AIAssistantPage,
});
