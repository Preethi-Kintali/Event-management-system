import { createFileRoute } from "@tanstack/react-router";
import { EventDescriptionGenerator } from "@/modules/ai-copilot/pages/event-description";

export const Route = createFileRoute("/ai-copilot/event-description")({
  head: () => ({
    meta: [{ title: "Event Description Generator · Ascent Platform" }],
  }),
  component: EventDescriptionGenerator,
});
