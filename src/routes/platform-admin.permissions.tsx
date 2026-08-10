import { createFileRoute } from "@tanstack/react-router";
import { PermissionsPage } from "@/modules/platform-admin/pages/permissions";

export const Route = createFileRoute("/platform-admin/permissions")({
  head: () => ({
    meta: [{ title: "Roles & Permissions · Ascent Platform" }],
  }),
  component: PermissionsPage,
});
