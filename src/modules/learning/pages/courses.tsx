import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { LearningService } from "../services/learning.service";
import { Course } from "../types/learning.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const columns: Column<Course>[] = [
  {
    key: "course",
    header: "Course Title",
    sortable: true,
    render: (row) => <span className="font-medium">{row.course}</span>,
  },
  { key: "category", header: "Category", sortable: true },
  { key: "instructor", header: "Instructor", sortable: true },
  {
    key: "level",
    header: "Level",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.level}</Badge>,
  },
  {
    key: "enrollments",
    header: "Enrollments",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.enrollments}</span>,
  },
  {
    key: "rating",
    header: "Rating",
    sortable: true,
    render: (row) => <span className="tabular-nums">⭐ {row.rating}</span>,
  },
  {
    key: "completionRate",
    header: "Completion",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-24">
        <Progress value={row.completionRate} className="h-1.5" />
        <span className="text-xs">{row.completionRate}%</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Published") statusId = "active";
      if (row.status === "Draft") statusId = "draft";
      if (row.status === "Archived") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function CoursesListPage() {
  const [data, setData] = useState<Course[]>([]);

  useEffect(() => {
    LearningService.getCourses().then(setData);
  }, []);

  return (
    <ListPageTemplate<Course>
      title="Courses"
      description="Manage educational curriculums and learning tracks."
      crumbs={[
        { label: "Engagement" },
        { label: "Learning", to: "/learning" },
        { label: "Courses" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["course", "category", "instructor"]}
      facet={{ label: "Level", key: "level", options: ["Beginner", "Intermediate", "Advanced"] }}
      createLabel="Create Course"
      rowActions={[
        { label: "View Content", onSelect: () => {} },
        { label: "Edit Settings", onSelect: () => {} },
      ]}
    />
  );
}
