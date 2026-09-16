import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegisterTeamForEvent } from "../hooks/participant.api";
import { toast } from "sonner";
import { Trash2, Plus, Users, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { ApiEvent } from "@/modules/events/services/events.api";

interface TeamRegistrationWizardProps {
  event: ApiEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function TeamRegistrationWizard({ event, open, onOpenChange, onSuccess }: TeamRegistrationWizardProps) {
  const [step, setStep] = useState(1);
  const [competitionId, setCompetitionId] = useState<string>("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const registerTeamMutation = useRegisterTeamForEvent();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const addMember = () => {
    if (!newMemberEmail) return;
    if (members.includes(newMemberEmail)) {
      toast.error("Email already added.");
      return;
    }
    const currentSize = members.length + 1; // +1 for the lead
    if (event.maxTeamSize && currentSize >= event.maxTeamSize) {
      toast.error(`Maximum team size is ${event.maxTeamSize}.`);
      return;
    }
    setMembers([...members, newMemberEmail]);
    setNewMemberEmail("");
  };

  const removeMember = (email: string) => {
    setMembers(members.filter(m => m !== email));
  };

  const handleSubmit = async () => {
    const currentSize = members.length + 1;
    if (event.minTeamSize && currentSize < event.minTeamSize) {
      toast.error(`Minimum team size is ${event.minTeamSize}. You need ${event.minTeamSize - currentSize} more members.`);
      return;
    }
    if (event.maxTeamSize && currentSize > event.maxTeamSize) {
      toast.error(`Maximum team size is ${event.maxTeamSize}. You have too many members.`);
      return;
    }
    
    try {
      await registerTeamMutation.mutateAsync({
        eventId: event.id,
        competitionId,
        teamName,
        members
      });
      toast.success("Successfully registered team for event!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to register team");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Team Registration - {event.name}</DialogTitle>
          <DialogDescription>
            {step === 1 && "Select the track or competition you are entering."}
            {step === 2 && "Give your team a name."}
            {step === 3 && `Invite team members (Min: ${event.minTeamSize || 1}, Max: ${event.maxTeamSize || 'Unlimited'}).`}
            {step === 4 && "Review your registration details."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <Label>Competition / Track</Label>
              <Select value={competitionId} onValueChange={setCompetitionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a competition" />
                </SelectTrigger>
                <SelectContent>
                  {event.competitions?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                  {!event.competitions?.length && (
                    <div className="p-2 text-sm text-muted-foreground text-center">No competitions available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>Team Name</Label>
              <Input 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)} 
                placeholder="Awesome Team" 
                autoFocus 
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-surface/50 p-3 rounded-lg border text-sm mb-4">
                <strong>You</strong> will be automatically added as the Team Captain.
                <div className="text-muted-foreground mt-1">
                  Team size limit: {event.minTeamSize || 1} - {event.maxTeamSize || 'Unlimited'} members
                </div>
              </div>

              <div className="flex gap-2">
                <Input 
                  value={newMemberEmail} 
                  onChange={(e) => setNewMemberEmail(e.target.value)} 
                  placeholder="friend@example.com" 
                  type="email"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
                />
                <Button type="button" variant="secondary" onClick={addMember} disabled={!!event.maxTeamSize && (members.length + 1) >= event.maxTeamSize}>
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>

              {members.length > 0 && (
                <div className="border rounded-lg divide-y">
                  {members.map(email => (
                    <div key={email} className="flex items-center justify-between p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {email}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeMember(email)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3 bg-surface/30">
                <div className="grid grid-cols-3 text-sm">
                  <div className="text-muted-foreground font-medium">Track</div>
                  <div className="col-span-2">{event.competitions?.find((c:any) => c.id === competitionId)?.name}</div>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <div className="text-muted-foreground font-medium">Team Name</div>
                  <div className="col-span-2 font-semibold">{teamName}</div>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <div className="text-muted-foreground font-medium">Members</div>
                  <div className="col-span-2">
                    <div>You (Captain)</div>
                    {members.map(m => <div key={m}>{m}</div>)}
                    <div className="text-xs text-muted-foreground mt-1">Total: {members.length + 1}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1 || registerTeamMutation.isPending}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          {step < 4 ? (
            <Button onClick={handleNext} disabled={(step === 1 && !competitionId) || (step === 2 && !teamName)}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={registerTeamMutation.isPending}>
              {registerTeamMutation.isPending ? "Registering..." : (
                <><Check className="w-4 h-4 mr-2" /> Confirm Registration</>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
