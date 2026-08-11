import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCreateTeam, useUpdateTeam, ApiTeam } from "../services/teams.api";
import { useCompetitions } from "@/modules/competitions/services/competitions.api";
import { toast } from "sonner";

interface TeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: ApiTeam | null;
}

export function TeamDialog({ open, onOpenChange, team }: TeamDialogProps) {
  const [name, setName] = useState("");
  const [competitionId, setCompetitionId] = useState("");

  const { data: competitions = [] } = useCompetitions();
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();
  const isEditing = !!team;

  useEffect(() => {
    if (team) {
      setName(team.name);
      setCompetitionId(team.competitionId);
    } else {
      setName(""); setCompetitionId("");
    }
  }, [team, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name, competitionId };
      if (isEditing) {
        await updateMutation.mutateAsync({ id: team.id, ...payload });
        toast.success("Team updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Team created successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message ?? "Failed to save team");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Team" : "Create Team"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update team details." : "Create a new team for a competition."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Team name</Label>
              <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Team Quantum" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-comp">Competition</Label>
              <Select value={competitionId} onValueChange={setCompetitionId} required>
                <SelectTrigger id="team-comp">
                  <SelectValue placeholder="Select a competition..." />
                </SelectTrigger>
                <SelectContent>
                  {competitions.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id}>
                      {comp.name}
                      {comp.event ? ` — ${comp.event.name}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !competitionId}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
