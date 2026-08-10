import { createFileRoute } from "@tanstack/react-router";
import { RubricGeneratorPage } from "@/modules/ai-copilot/pages/rubric";

export const Route = createFileRoute("/ai-copilot/rubric")({
  head: () => ({
    meta: [{ title: "Rubric Generator · Ascent Platform" }],
  }),
  component: RubricGeneratorPage,
});
