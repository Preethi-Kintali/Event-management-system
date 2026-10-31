import { createFileRoute } from "@tanstack/react-router";
import { EventSchedulePage } from "@/modules/events/pages/event-schedule";

export const Route = createFileRoute("/events/schedule")({
  head: () => ({
    meta: [
      { title: "Event schedule · Eventura Platform" },
      {
        name: "description",
        content: "Agenda builder with tracks, speakers and session types for every event day.",
      },
      { property: "og:title", content: "Event schedule · Eventura Platform" },
      {
        property: "og:description",
        content: "Agenda builder with tracks, speakers and session types for every event day.",
      },
    ],
  }),
  component: EventSchedulePage,
});
