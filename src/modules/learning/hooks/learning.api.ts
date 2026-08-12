import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import { Course, CourseEnrollment, LearningResource, Workshop } from "@prisma/client";

// Dashboard
export function useLearningDashboard() {
  return useQuery({
    queryKey: ["learning", "dashboard"],
    queryFn: () => fetchApi<{ success: boolean; data: any }>("/api/v1/learning/dashboard").then(r => r.data),
  });
}

// Courses
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchApi<{ success: boolean; data: Course[] }>("/api/v1/learning/courses").then(r => r.data),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => fetchApi<{ success: boolean; data: Course }>(`/api/v1/learning/courses/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

// Enrollments
export function useCourseEnrollments(id: string) {
  return useQuery({
    queryKey: ["courses", id, "enrollments"],
    queryFn: () => fetchApi<{ success: boolean; data: CourseEnrollment[] }>(`/api/v1/learning/courses/${id}/enrollments`).then(r => r.data),
    enabled: !!id,
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => fetchApi(`/api/v1/learning/courses/${courseId}/enroll`, { method: "POST" }),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId, "enrollments"] });
    },
  });
}

// Resources
export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: () => fetchApi<{ success: boolean; data: LearningResource[] }>("/api/v1/learning/resources").then(r => r.data),
  });
}

// Workshops
export function useWorkshops() {
  return useQuery({
    queryKey: ["workshops"],
    queryFn: () => fetchApi<{ success: boolean; data: Workshop[] }>("/api/v1/learning/workshops").then(r => r.data),
  });
}
