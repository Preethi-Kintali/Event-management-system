import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsListPage } from "@/modules/submissions/pages/submissions-list";

export const Route = createFileRoute("/submissions/")({
  head: () => ({
    meta: [
      { title: "Submissions · Eventura Platform" },
      { name: "description", content: "Every submission with round, score and reviewer coverage." },
      { property: "og:title", content: "Submissions · Eventura Platform" },
      {
        property: "og:description",
        content: "Every submission with round, score and reviewer coverage.",
      },
    ],
  }),
  component: SubmissionsListPage,
});
