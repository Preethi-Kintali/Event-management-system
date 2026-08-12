import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { Timeline } from "@/components/ds/timeline";
import { useCourses, useWorkshops, useLearningDashboard } from "../hooks/learning.api";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BookOpen, MonitorPlay } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LearningDashboard() {
  const { data: courses = [], isLoading: loadingCourses } = useCourses();
  const { data: workshops = [], isLoading: loadingWorkshops } = useWorkshops();
  const { data: stats, isLoading: loadingStats } = useLearningDashboard();

  return (
    <>
      <PageHeader
        title="Learning & Resource Center"
        description="Educational materials, courses, and live workshops."
        crumbs={[{ label: "Engagement" }, { label: "Learning" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Courses" value={stats?.courses?.toString() || "0"} index={0} />
        <StatCard label="Active Workshops" value={workshops.filter((w: any) => w.status === "LIVE").length.toString()} index={1} />
        <StatCard label="Resources" value={stats?.resources?.toString() || "0"} index={2} />
        <StatCard label="Active Learners" value={stats?.activeLearners?.toString() || "0"} index={3} />
        <StatCard
          label="Completion Rate"
          value={`${stats?.completionRate || 0}%`}
          progress={stats?.completionRate || 0}
          index={4}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2 mt-6">
        <SectionCard title="Popular Courses" description="Highest rated active courses">
          {loadingCourses ? (
            <div className="p-4">Loading courses...</div>
          ) : (
            <div className="grid gap-4">
              {courses.slice(0, 3).map((course: any) => (
                <div
                  key={course.id}
                  className="flex items-start gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Link
                        to={`/learning/courses/${course.id}` as any}
                        className="font-semibold hover:underline"
                      >
                        {course.title}
                      </Link>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      By {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "Unknown"} • {course.category}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>👥 {course._count?.enrollments || 0} Enrolled</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to="/learning/courses">View All Courses</Link>
          </Button>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Upcoming Workshops" description="Live sessions">
            {loadingWorkshops ? (
              <div className="p-4">Loading workshops...</div>
            ) : (
              <ul className="divide-y divide-border">
                {workshops
                  .filter((w: any) => w.status !== "COMPLETED")
                  .slice(0, 3)
                  .map((workshop: any) => (
                    <li key={workshop.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MonitorPlay
                          className={`w-4 h-4 ${workshop.status === "LIVE" ? "text-destructive animate-pulse" : "text-muted-foreground"}`}
                        />
                        <div>
                          <p className="text-sm font-medium">{workshop.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(workshop.date).toLocaleString()} • {workshop.duration}
                          </p>
                        </div>
                      </div>
                      <Badge variant={workshop.status === "LIVE" ? "destructive" : "outline"}>
                        {workshop.status}
                      </Badge>
                    </li>
                  ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Recent Activity" description="Platform learning trends">
            <Timeline
              items={[
                {
                  id: "1",
                  title: "New Resource Added",
                  detail: "Global Carbon Dataset uploaded",
                  time: "2 hours ago",
                  state: "done",
                },
                {
                  id: "2",
                  title: "Course Published",
                  detail: "Advanced System Design by Dr. Chen",
                  time: "Yesterday",
                  state: "done",
                },
                {
                  id: "3",
                  title: "Workshop Completed",
                  detail: "Pitch Deck Masterclass finished",
                  time: "Aug 1",
                  state: "done",
                },
              ]}
            />
          </SectionCard>
        </div>
      </div>
    </>
  );
}

