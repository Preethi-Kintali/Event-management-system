import { createFileRoute } from "@tanstack/react-router";
import { RecommendationsPage } from "@/modules/ai-copilot/pages/recommendations";

export const Route = createFileRoute("/ai-copilot/recommendations")({
  head: () => ({
    meta: [{ title: "AI Recommendations · Ascent Platform" }],
  }),
  component: RecommendationsPage,
});
