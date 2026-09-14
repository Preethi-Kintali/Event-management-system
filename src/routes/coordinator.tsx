import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/coordinator")({
  component: CoordinatorLayout,
});

function CoordinatorLayout() {
  const { user } = useAuth();
  
  const roleName = user?.memberships?.[0]?.role?.name || "Participant";
  if (roleName !== "Student Coordinator") {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Unauthorized. You are not a Student Coordinator.
      </div>
    );
  }

  return <Outlet />;
}
