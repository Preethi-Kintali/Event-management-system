import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCreateRegistration } from "@/modules/registrations/services/registrations.api";
import { useCreateAttendanceSession, useCheckIn, useAttendanceSessions } from "@/modules/attendance/services/attendance.api";
import { useOrganizationMembers } from "@/modules/organizations/services/organizations.api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface AdminExecutionDataToolProps {
  eventId: string;
}

export function AdminExecutionDataTool({ eventId }: AdminExecutionDataToolProps) {
  const queryClient = useQueryClient();
  const createRegistration = useCreateRegistration();
  const createSession = useCreateAttendanceSession();
  const checkIn = useCheckIn();
  const { hasPermission } = useAuth();

  const { data: members = [] } = useOrganizationMembers();
  const { data: sessions = [] } = useAttendanceSessions();
  const eventSessions = sessions.filter((s: any) => s.eventId === eventId);

  const [userIdReg, setUserIdReg] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [userIdCheckIn, setUserIdCheckIn] = useState("");
  const [sessionIdCheckIn, setSessionIdCheckIn] = useState("");

  // Safety check: Only show this tool if the user has events.update (Manager/Admin)
  if (!hasPermission("events.update")) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg bg-surface">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>You do not have permission to access the Admin Execution Utility.</p>
      </div>
    );
  }

  const handleAddRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRegistration.mutateAsync({
        eventId,
        userId: userIdReg,
        status: "APPROVED"
      });
      toast.success("Registration manually added");
      setUserIdReg("");
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "execution-summary"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "dashboard"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to add registration");
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startTime = new Date().toISOString();
      const endTime = new Date(Date.now() + 3600000).toISOString(); // +1 hour
      await createSession.mutateAsync({
        eventId,
        name: sessionName,
        startTime,
        endTime,
        status: "LIVE"
      });
      toast.success("Attendance session created");
      setSessionName("");
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "execution-summary"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to create session");
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await checkIn.mutateAsync({
        sessionId: sessionIdCheckIn,
        userId: userIdCheckIn,
        method: "MANUAL",
        status: "PRESENT"
      });
      toast.success("User checked in");
      setUserIdCheckIn("");
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "execution-summary"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to check in");
    }
  };

  return (
    <div className="grid gap-8 sm:grid-cols-2 p-4">
      <div className="col-span-2 mb-2 p-4 border border-destructive/50 bg-destructive/5 rounded-lg text-destructive-foreground">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Internal Admin Utility
        </div>
        <p className="text-sm mt-1">
          This tool is provided exclusively for Managers and Admins to manually inject execution data using real organization users.
          It ensures foreign-key relationships are maintained for testing the final AI reporting pipeline.
        </p>
      </div>

      {/* Registrations */}
      <div className="p-4 bg-surface border rounded-lg">
        <h3 className="font-semibold text-lg mb-4">1. Manually Add Registration</h3>
        <form onSubmit={handleAddRegistration} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Select User</Label>
            <select 
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={userIdReg} 
              onChange={(e) => setUserIdReg(e.target.value)} 
              required
            >
              <option value="">-- Select a User --</option>
              {members.map((m: any) => (
                <option key={m.userId} value={m.userId}>
                  {m.user?.firstName} {m.user?.lastName} ({m.user?.email})
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={createRegistration.isPending || !userIdReg}>
            Add Approved Registration
          </Button>
        </form>
      </div>

      {/* Attendance Sessions */}
      <div className="p-4 bg-surface border rounded-lg">
        <h3 className="font-semibold text-lg mb-4">2. Create Attendance Session</h3>
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Session Name</Label>
            <Input 
              placeholder="e.g. Day 1 Check-in" 
              value={sessionName} 
              onChange={(e) => setSessionName(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" disabled={createSession.isPending || !sessionName}>
            Create Session
          </Button>
        </form>
      </div>

      {/* Manual Check-in */}
      <div className="p-4 bg-surface border rounded-lg sm:col-span-2">
        <h3 className="font-semibold text-lg mb-4">3. Check-in Registered User</h3>
        <form onSubmit={handleCheckIn} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label>Select Session</Label>
            <select 
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={sessionIdCheckIn} 
              onChange={(e) => setSessionIdCheckIn(e.target.value)} 
              required
            >
              <option value="">-- Select a session --</option>
              {eventSessions.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Select User</Label>
            <select 
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={userIdCheckIn} 
              onChange={(e) => setUserIdCheckIn(e.target.value)} 
              required
            >
              <option value="">-- Select a User --</option>
              {members.map((m: any) => (
                <option key={m.userId} value={m.userId}>
                  {m.user?.firstName} {m.user?.lastName} ({m.user?.email})
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={checkIn.isPending || !sessionIdCheckIn || !userIdCheckIn}>
            Mark Present
          </Button>
        </form>
      </div>
    </div>
  );
}
