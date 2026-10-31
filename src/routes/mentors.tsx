import { createFileRoute } from "@tanstack/react-router";
import { MentorsPage } from "@/modules/mentors/pages/mentors-page";

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Mentors · Eventura Platform" },
      {
        name: "description",
        content: "Mentor allocation, team assignments and coaching activity.",
      },
      { property: "og:title", content: "Mentors · Eventura Platform" },
      {
        property: "og:description",
        content: "Mentor allocation, team assignments and coaching activity.",
      },
    ],
  }),
  component: MentorsPage,
});
