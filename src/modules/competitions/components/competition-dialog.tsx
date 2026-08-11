import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCompetition, useUpdateCompetition, ApiCompetition } from "../services/competitions.api";
import { useEvents } from "@/modules/events/services/events.api";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competition?: ApiCompetition | null;
}

export function CompetitionDialog({ open, onOpenChange, competition }: CompetitionDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventId, setEventId] = useState("");

  const { data: events = [] } = useEvents();
  const createMutation = useCreateCompetition();
  const updateMutation = useUpdateCompetition();
  const isEditing = !!competition;

  useEffect(() => {
    if (competition) {
      setName(competition.name);
      setDescription(competition.description ?? "");
      setEventId(competition.eventId);
    } else {
      setName(""); setDescription(""); setEventId("");
    }
  }, [competition, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name, ...(description ? { description } : {}), eventId };
      if (isEditing) {
        await updateMutation.mutateAsync({ id: competition.id, ...payload });
        toast.success("Competition updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Competition created successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message ?? "Failed to save competition");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Competition" : "Create Competition"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update competition details." : "Add a competition track to an event."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="comp-name">Name</Label>
              <Input id="comp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="AI Accessibility Track" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comp-desc">Description</Label>
              <Textarea id="comp-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the competition..." rows={2} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comp-event">Event</Label>
              <Select value={eventId} onValueChange={setEventId} required>
                <SelectTrigger id="comp-event">
                  <SelectValue placeholder="Select an event..." />
                </SelectTrigger>
                <SelectContent>
                  {events.map((ev) => (
                    <SelectItem key={ev.id} value={ev.id}>{ev.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !eventId}>{isLoading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
