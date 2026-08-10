import { Course, Workshop, Resource, LearningDashboardSummary } from "../types/learning.types";

export const LearningService = {
  async getDashboardSummary(): Promise<LearningDashboardSummary> {
    return {
      totalCourses: 24,
      activeWorkshops: 8,
      resources: 142,
      enrollments: 4500,
      completionRate: 68.5,
    };
  },

  async getCourses(): Promise<Course[]> {
    return [
      {
        id: "crs_1",
        course: "Introduction to React",
        category: "Web Development",
        instructor: "Sarah Jenkins",
        enrollments: 1200,
        rating: 4.8,
        completionRate: 72,
        level: "Beginner",
        status: "Published",
      },
      {
        id: "crs_2",
        course: "Advanced System Design",
        category: "Architecture",
        instructor: "Dr. Chen",
        enrollments: 850,
        rating: 4.9,
        completionRate: 64,
        level: "Advanced",
        status: "Published",
      },
      {
        id: "crs_3",
        course: "AI for Startups",
        category: "Business",
        instructor: "Markus Volkov",
        enrollments: 2100,
        rating: 4.7,
        completionRate: 81,
        level: "Intermediate",
        status: "Published",
      },
      {
        id: "crs_4",
        course: "Data Privacy & Ethics",
        category: "Compliance",
        instructor: "Anita Desai",
        enrollments: 350,
        rating: 4.5,
        completionRate: 50,
        level: "Beginner",
        status: "Draft",
      },
    ];
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    const courses = await this.getCourses();
    return courses.find((c) => c.id === id) || courses[0];
  },

  async getWorkshops(): Promise<Workshop[]> {
    return [
      {
        id: "wks_1",
        workshop: "Building Serverless APIs",
        instructor: "David Miller",
        date: "2026-08-15 10:00",
        duration: "2 Hours",
        participants: 145,
        status: "Upcoming",
      },
      {
        id: "wks_2",
        workshop: "Design Thinking Sprint",
        instructor: "Lina Fox",
        date: "2026-08-10 14:00",
        duration: "4 Hours",
        participants: 320,
        status: "Live",
      },
      {
        id: "wks_3",
        workshop: "Pitch Deck Masterclass",
        instructor: "Omar Tariq",
        date: "2026-08-01 09:00",
        duration: "1.5 Hours",
        participants: 410,
        status: "Completed",
      },
    ];
  },

  async getResources(): Promise<Resource[]> {
    return [
      {
        id: "res_1",
        resource: "Hackathon Starter Template",
        type: "Template",
        category: "Development",
        downloads: 3400,
        uploadedBy: "System",
        date: "2026-01-10",
        status: "Active",
      },
      {
        id: "res_2",
        resource: "Global Carbon Dataset",
        type: "Dataset",
        category: "Data Science",
        downloads: 1200,
        uploadedBy: "Dr. Chen",
        date: "2026-05-22",
        status: "Active",
      },
      {
        id: "res_3",
        resource: "How to Pitch to Investors",
        type: "Video",
        category: "Business",
        downloads: 850,
        uploadedBy: "Markus Volkov",
        date: "2026-06-15",
        status: "Active",
      },
      {
        id: "res_4",
        resource: "Problem Statement: Healthcare",
        type: "Problem Statement",
        category: "Healthcare",
        downloads: 540,
        uploadedBy: "System",
        date: "2026-07-01",
        status: "Active",
      },
    ];
  },
};
