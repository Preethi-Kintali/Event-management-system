import { createFileRoute } from "@tanstack/react-router";
import { OrganizationsPage } from "@/modules/platform-admin/pages/organizations";

export const Route = createFileRoute("/platform-admin/organizations")({
  head: () => ({
    meta: [{ title: "Organizations · Ascent Platform" }],
  }),
  component: OrganizationsPage,
});
