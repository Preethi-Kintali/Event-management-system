import { createFileRoute } from "@tanstack/react-router";
import { AIValidationQueuePage } from "@/modules/ai-validation/pages/queue";

export const Route = createFileRoute("/ai-validation/queue")({
  head: () => ({
    meta: [{ title: "Validation Queue · Ascent Platform" }],
  }),
  component: AIValidationQueuePage,
});
