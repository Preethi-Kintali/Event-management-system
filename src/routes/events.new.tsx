import { createFileRoute } from "@tanstack/react-router";
import { CreateEventPage } from "@/modules/events/pages/event-create";

export const Route = createFileRoute("/events/new")({
  head: () => ({
    meta: [
      { title: "Create event · Ascent Platform" },
      {
        name: "description",
        content:
          "Multi-step event creation with validation, scheduling, media and publishing controls.",
      },
      { property: "og:title", content: "Create event · Ascent Platform" },
      {
        property: "og:description",
        content:
          "Multi-step event creation with validation, scheduling, media and publishing controls.",
      },
    ],
  }),
  component: CreateEventPage,
});
