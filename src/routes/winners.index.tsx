import { createFileRoute } from "@tanstack/react-router";
import { WinnersDashboard } from "@/modules/winners/pages/dashboard";

export const Route = createFileRoute("/winners/")({
  head: () => ({
    meta: [{ title: "Winner Management · Eventura Platform" }],
  }),
  component: WinnersDashboard,
});
