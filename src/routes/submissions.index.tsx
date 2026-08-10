import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsListPage } from "@/modules/submissions/pages/submissions-list";

export const Route = createFileRoute("/submissions/")({
  head: () => ({
    meta: [
      { title: "Submissions · Ascent Platform" },
      { name: "description", content: "Every submission with round, score and reviewer coverage." },
      { property: "og:title", content: "Submissions · Ascent Platform" },
      {
        property: "og:description",
        content: "Every submission with round, score and reviewer coverage.",
      },
    ],
  }),
  component: SubmissionsListPage,
});
