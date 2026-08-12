import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useCourses } from "../hooks/learning.api";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// A mapped type for the table display
type CourseRow = {
  id: string;
  course: string;
  category: string;
  instructor: string;
  level: string;
  enrollments: number;
  completionRate: number;
  status: string;
};

const columns: Column<CourseRow>[] = [
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
    key: "completionRate",
    header: "Avg Completion",
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
      if (row.status === "PUBLISHED") statusId = "active";
      if (row.status === "DRAFT") statusId = "draft";
      if (row.status === "ARCHIVED") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function CoursesListPage() {
  const { data: courses = [], isLoading } = useCourses();

  // Map API data to table row format
  const rows: CourseRow[] = courses.map((c: any) => {
    const enrollments = c.enrollments || [];
    const completed = enrollments.filter((e: any) => e.status === "COMPLETED" || e.progress === 100).length;
    const completionRate = enrollments.length > 0 ? Math.round((completed / enrollments.length) * 100) : 0;

    return {
      id: c.id,
      course: c.title,
      category: c.category,
      instructor: c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : "Unknown",
      level: c.level,
      enrollments: c._count?.enrollments || 0,
      completionRate,
      status: c.status,
    };
  });

  if (isLoading) {
    return <div className="p-8">Loading courses...</div>;
  }

  return (
    <ListPageTemplate<CourseRow>
      title="Courses"
      description="Manage educational curriculums and learning tracks."
      crumbs={[
        { label: "Engagement" },
        { label: "Learning", to: "/learning" },
        { label: "Courses" },
      ]}
      columns={columns}
      rows={rows}
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

