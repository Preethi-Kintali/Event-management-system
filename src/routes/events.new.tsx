import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CreateEventPage } from "@/modules/events/pages/event-create";

const eventNewSearchSchema = z.object({
  proposalId: z.string().optional(),
});

export const Route = createFileRoute("/events/new")({
  validateSearch: eventNewSearchSchema,
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
