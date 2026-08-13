import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/participant")({
  component: ParticipantLayout,
});

function ParticipantLayout() {
  const { user } = useAuth();
  
  const roleName = user?.memberships?.[0]?.role?.name || "Participant";
  if (roleName !== "Participant") {
    // If not a participant, redirect or show unauthorized
    return <div>Unauthorized. You are not a participant.</div>;
  }

  return <Outlet />;
}
