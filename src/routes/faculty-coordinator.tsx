import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/faculty-coordinator")({
  component: FacultyCoordinatorLayout,
});

function FacultyCoordinatorLayout() {
  const { user } = useAuth();
  
  const roleName = user?.memberships?.[0]?.role?.name || "Participant";
  if (roleName !== "Faculty Coordinator") {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Unauthorized. You are not a Faculty Coordinator.
      </div>
    );
  }

  return <Outlet />;
}
