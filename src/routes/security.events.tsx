import { createFileRoute } from "@tanstack/react-router";
import { EventsPage } from "@/modules/security/pages/events";

export const Route = createFileRoute("/security/events")({
  head: () => ({
    meta: [{ title: "Audit Logs · Ascent Platform" }],
  }),
  component: EventsPage,
});
