import { createFileRoute } from "@tanstack/react-router";
import { CompliancePage } from "@/modules/security/pages/compliance";

export const Route = createFileRoute("/security/compliance")({
  head: () => ({
    meta: [{ title: "Compliance Settings · Ascent Platform" }],
  }),
  component: CompliancePage,
});
