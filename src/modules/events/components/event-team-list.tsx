import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ds/page-header";
import { useEventTeam, useAddEventTeamMember, useUpdateEventTeamMember, useRemoveEventTeamMember } from "../services/events.api";
import { useOrganizationMembers } from "@/modules/organizations/services/organizations.api";
import { toast } from "sonner";
import { ShieldCheck, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function EventTeamList({ eventId }: { eventId: string }) {
  const { data: team, isLoading } = useEventTeam(eventId);
  const { data: orgMembers } = useOrganizationMembers();
  const addMember = useAddEventTeamMember();
  const updateMember = useUpdateEventTeamMember();
  const removeMember = useRemoveEventTeamMember();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [responsibility, setResponsibility] = useState("");

  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [editResponsibility, setEditResponsibility] = useState("");

  if (isLoading) return <div className="p-4 text-sm">Loading team...</div>;

  const handleAdd = async () => {
    if (!selectedUser || !responsibility) {
      toast.error("Please select a user and enter a responsibility.");
      return;
    }
    try {
      await addMember.mutateAsync({ eventId, userId: selectedUser, responsibility });
      toast.success("Team member added.");
      setIsAddOpen(false);
      setSelectedUser("");
      setResponsibility("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add member");
    }
  };

  const handleUpdate = async () => {
    if (!editMemberId || !editResponsibility) return;
    try {
      await updateMember.mutateAsync({ eventId, memberId: editMemberId, responsibility: editResponsibility });
      toast.success("Responsibility updated.");
      setEditMemberId(null);
      setEditResponsibility("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update member");
    }
  };

  const handleRemove = async (memberId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      try {
        await removeMember.mutateAsync({ eventId, memberId });
        toast.success("Team member removed.");
      } catch (err: any) {
        toast.error(err.message || "Failed to remove member");
      }
    }
  };

  return (
    <SectionCard
      title="Organizing Team"
      description="Manage the staff organizing this event."
      actions={
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add Team Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Event Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Member</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {orgMembers?.map((m) => (
                      <SelectItem key={m.user.id} value={m.user.id}>
                        {m.user.firstName} {m.user.lastName} ({m.user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Responsibility</label>
                <Input
                  placeholder="e.g., Event Manager, Logistics Coordinator"
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} disabled={addMember.isPending}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {team && team.length > 0 ? (
        <ul className="divide-y divide-border">
          {team.map((member) => (
            <li key={member.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{member.user.firstName} {member.user.lastName}</p>
                <p className="text-xs text-muted-foreground">{member.user.email}</p>
                {editMemberId === member.id ? (
                  <div className="flex gap-2 mt-2 items-center">
                    <Input
                      size={20}
                      className="h-8 w-[200px]"
                      value={editResponsibility}
                      onChange={(e) => setEditResponsibility(e.target.value)}
                    />
                    <Button size="sm" onClick={handleUpdate} disabled={updateMember.isPending}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditMemberId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 mt-1 text-xs text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{member.responsibility}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {!editMemberId && (
                  <>
                    <Button size="icon" variant="ghost" onClick={() => {
                      setEditMemberId(member.id);
                      setEditResponsibility(member.responsibility);
                    }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleRemove(member.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg bg-surface mt-2">
          No team members assigned yet.
        </div>
      )}
    </SectionCard>
  );
}
