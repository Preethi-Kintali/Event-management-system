import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/manager")({
  beforeLoad: ({ context }) => {
    // The auth context provides the user. We assume it's passed or available.
    // If we can't access hooks inside beforeLoad directly, we can check inside the component.
  },
  component: ManagerLayout,
});

function ManagerLayout() {
  const { user } = useAuth();
  
  const roleName = user?.memberships?.[0]?.role?.name || "Participant";
  if (roleName !== "Manager" && roleName !== "Organization Admin") {
    // If not a manager, redirect to unauthorized or participant
    return <div>Unauthorized. You are not a manager.</div>;
  }

  return <Outlet />;
}
