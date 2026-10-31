import { createFileRoute } from "@tanstack/react-router";
import { ManagerSubmissionsPage } from "@/modules/manager/pages/submissions";

export const Route = createFileRoute("/manager/submissions")({
  head: () => ({ meta: [{ title: "ManagerSubmissionsPage · Eventura Platform" }] }),
  component: ManagerSubmissionsPage,
});
