import { createFileRoute } from "@tanstack/react-router";
import { TeamsListPage } from "@/modules/teams/pages/teams-list";

export const Route = createFileRoute("/teams/")({
  head: () => ({
    meta: [
      { title: "Teams · Ascent Platform" },
      {
        name: "description",
        content: "Team formation, membership and progress across all competitions.",
      },
      { property: "og:title", content: "Teams · Ascent Platform" },
      {
        property: "og:description",
        content: "Team formation, membership and progress across all competitions.",
      },
    ],
  }),
  component: TeamsListPage,
});
