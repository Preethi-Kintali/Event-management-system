import { createFileRoute } from "@tanstack/react-router";
import { ManagerAttendancePage } from "@/modules/manager/pages/attendance";

export const Route = createFileRoute("/manager/attendance")({
  head: () => ({ meta: [{ title: "ManagerAttendancePage · Ascent Platform" }] }),
  component: ManagerAttendancePage,
});
