import { createFileRoute } from "@tanstack/react-router";
import { RegistrationsListPage } from "@/modules/registrations/pages/registrations-list";

export const Route = createFileRoute("/registrations")({
  head: () => ({
    meta: [
      { title: "Registrations · Eventura Platform" },
      {
        name: "description",
        content: "Approve, review and reconcile participant registrations and payments.",
      },
      { property: "og:title", content: "Registrations · Eventura Platform" },
      {
        property: "og:description",
        content: "Approve, review and reconcile participant registrations and payments.",
      },
    ],
  }),
  component: RegistrationsListPage,
});
