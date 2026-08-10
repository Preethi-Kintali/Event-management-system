import { createFileRoute } from "@tanstack/react-router";
import { AuthenticationSecurityPage } from "@/modules/security/pages/authentication";

export const Route = createFileRoute("/security/authentication")({
  head: () => ({
    meta: [{ title: "Authentication Settings · Ascent Platform" }],
  }),
  component: AuthenticationSecurityPage,
});
