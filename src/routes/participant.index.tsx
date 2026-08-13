import { createFileRoute } from "@tanstack/react-router";
import { ParticipantDashboard } from "@/modules/participant/pages/dashboard";

export const Route = createFileRoute("/participant/")({
  head: () => ({
    meta: [{ title: "Participant Dashboard · Ascent Platform" }],
  }),
  component: ParticipantDashboard,
});
