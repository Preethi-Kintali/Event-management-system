import { createFileRoute } from "@tanstack/react-router";
import { AttendanceRecordsPage } from "@/modules/attendance/pages/records";

export const Route = createFileRoute("/attendance/records")({
  head: () => ({
    meta: [{ title: "Attendance Records · Ascent Platform" }],
  }),
  component: AttendanceRecordsPage,
});
