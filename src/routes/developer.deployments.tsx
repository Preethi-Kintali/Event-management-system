import { createFileRoute } from "@tanstack/react-router";
import { DeploymentsPage } from "@/modules/developer-admin/pages/deployments";

export const Route = createFileRoute("/developer/deployments")({
  head: () => ({
    meta: [{ title: "Deployments · Ascent Platform" }],
  }),
  component: DeploymentsPage,
});
