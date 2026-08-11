import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { Timeline } from "@/components/ds/timeline";
import { LearningService } from "../services/learning.service";
import { LearningDashboardSummary, Course, Workshop } from "../types/learning.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BookOpen, MonitorPlay } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LearningDashboard() {
  const [summary, setSummary] = useState<LearningDashboardSummary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    LearningService.getDashboardSummary().then(setSummary);
    LearningService.getCourses().then((c) => setCourses(c.slice(0, 3)));
    LearningService.getWorkshops().then((w) => setWorkshops(w.slice(0, 3)));
  }, []);

  return (
    <>
      <PageHeader
        title="Learning & Resource Center"
        description="Educational materials, courses, and live workshops."
        crumbs={[{ label: "Engagement" }, { label: "Learning" }]}
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Courses" value={summary.totalCourses.toString()} index={0} />
          <StatCard label="Active Workshops" value={summary.activeWorkshops.toString()} index={1} />
          <StatCard label="Resources" value={summary.resources.toString()} index={2} />
          <StatCard label="Enrollments" value={summary.enrollments.toString()} index={3} />
          <StatCard
            label="Completion Rate"
            value={`${summary.completionRate}%`}
            progress={summary.completionRate}
            index={4}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Popular Courses" description="Highest rated active courses">
          <div className="grid gap-4">
            {courses.map((course) => (
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
                      {course.course}
                    </Link>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    By {course.instructor} • {course.category}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>⭐ {course.rating} Rating</span>
                    <span>👥 {course.enrollments} Enrolled</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to="/learning/courses">View All Courses</Link>
          </Button>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Upcoming Workshops" description="Live sessions">
            <ul className="divide-y divide-border">
              {workshops
                .filter((w) => w.status !== "Completed")
                .map((workshop) => (
                  <li key={workshop.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MonitorPlay
                        className={`w-4 h-4 ${workshop.status === "Live" ? "text-destructive animate-pulse" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className="text-sm font-medium">{workshop.workshop}</p>
                        <p className="text-xs text-muted-foreground">
                          {workshop.date} • {workshop.duration}
                        </p>
                      </div>
                    </div>
                    <Badge variant={workshop.status === "Live" ? "destructive" : "outline"}>
                      {workshop.status}
                    </Badge>
                  </li>
                ))}
            </ul>
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
