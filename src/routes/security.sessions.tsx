import { createFileRoute } from "@tanstack/react-router";
import { SessionsPage } from "@/modules/security/pages/sessions";

export const Route = createFileRoute("/security/sessions")({
  head: () => ({
    meta: [{ title: "Active Sessions · Ascent Platform" }],
  }),
  component: SessionsPage,
});
