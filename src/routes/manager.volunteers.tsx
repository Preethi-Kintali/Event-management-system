import { createFileRoute } from "@tanstack/react-router";
import { ManagerVolunteersPage } from "@/modules/manager/pages/volunteers";

export const Route = createFileRoute("/manager/volunteers")({
  head: () => ({ meta: [{ title: "ManagerVolunteersPage · Ascent Platform" }] }),
  component: ManagerVolunteersPage,
});
