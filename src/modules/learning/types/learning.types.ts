export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type WorkshopStatus = "Upcoming" | "Live" | "Completed" | "Cancelled";
export type ResourceType =
  | "Problem Statement"
  | "Dataset"
  | "Template"
  | "Video"
  | "Study Material"
  | "Research Paper"
  | "Guide";

export interface Course {
  id: string;
  course: string;
  category: string;
  instructor: string;
  enrollments: number;
  rating: number;
  completionRate: number;
  level: CourseLevel;
  status: "Published" | "Draft" | "Archived";
}

export interface Workshop {
  id: string;
  workshop: string;
  instructor: string;
  date: string;
  duration: string;
  participants: number;
  status: WorkshopStatus;
}

export interface Resource {
  id: string;
  resource: string;
  type: ResourceType;
  category: string;
  downloads: number;
  uploadedBy: string;
  date: string;
  status: "Active" | "Archived";
}

export interface LearningDashboardSummary {
  totalCourses: number;
  activeWorkshops: number;
  resources: number;
  enrollments: number;
  completionRate: number;
}
