import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { useCourse } from "../hooks/learning.api";
import { useRouterState } from "@tanstack/react-router";
import { PlayCircle, FileText, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function CourseDetailsPage() {
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/").pop() || "";
  const { data: record, isLoading } = useCourse(id);

  if (isLoading) return <div className="p-8">Loading course details...</div>;
  if (!record) return <div className="p-8">Course not found.</div>;

  const instructorName = (record as any).instructor ? `${(record as any).instructor.firstName} ${(record as any).instructor.lastName}` : "Unknown";
  const enrollmentsCount = (record as any)._count?.enrollments || 0;
  const completionRate = 0; // Default value

  return (
    <DetailsPageTemplate
      title={record.title}
      description={`Taught by ${instructorName}`}
      crumbs={[
        { label: "Engagement" },
        { label: "Learning", to: "/learning" },
        { label: "Courses", to: "/learning/courses" },
        { label: record.title },
      ]}
      meta={
        <>
          <StatusChip status={record.status === "PUBLISHED" ? "published" : "draft"} />
          <span className="text-xs text-muted-foreground">{record.category}</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">Edit Content</Button>
          <Button>Unpublish</Button>
        </>
      }
      metrics={[
        { label: "Level", value: record.level },
        { label: "Rating", value: `⭐ 5.0` }, // Mocked
        { label: "Enrollments", value: enrollmentsCount.toString() },
        { label: "Completion", value: `${completionRate}%` },
      ]}
      overview={
        <>
          <SectionCard title="Curriculum Overview" description="Modules and lessons">
            <div className="space-y-4">
              {[
                { title: "1. Fundamentals", lessons: 4, duration: "45m" },
                { title: "2. Core Concepts", lessons: 6, duration: "1h 20m" },
                { title: "3. Advanced Application", lessons: 3, duration: "55m" },
              ].map((mod, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{mod.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {mod.lessons} lessons • {mod.duration}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Student Progress" description="Global completion rates">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-lg">
                      {Math.round(enrollmentsCount * (completionRate / 100))}
                    </p>
                    <p className="text-xs text-muted-foreground">Students Completed</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-4 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-lg">0</p>
                    <p className="text-xs text-muted-foreground">Certificates Issued</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </>
      }
    />
  );
}

