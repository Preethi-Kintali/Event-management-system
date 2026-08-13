import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCreateManagerEvent, useUpdateManagerEvent } from "../hooks/manager.api";
import { ApiEvent } from "@/modules/events/services/events.api";
import { toast } from "sonner";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: ApiEvent | null;
}

export function ManagerEventDialog({ open, onOpenChange, event }: EventDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("DRAFT");

  const createMutation = useCreateManagerEvent();
  const updateMutation = useUpdateManagerEvent();
  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDescription(event.description ?? "");
      setStartTime(event.startTime.slice(0, 16));
      setEndTime(event.endTime.slice(0, 16));
      setStatus(event.status);
    } else {
      setName(""); setDescription(""); setStartTime(""); setEndTime(""); setStatus("DRAFT");
    }
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        ...(description ? { description } : {}),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        status,
      };
      if (isEditing) {
        await updateMutation.mutateAsync({ id: event.id, data: payload });
        toast.success("Event updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Event created successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message ?? "Failed to save event");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Event" : "Create Event"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update event details." : "Create a new event under this organization."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ev-name">Name</Label>
              <Input id="ev-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Global AI Hackathon" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ev-desc">Description</Label>
              <Textarea id="ev-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the event..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ev-start">Start time</Label>
                <Input id="ev-start" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ev-end">End time</Label>
                <Input id="ev-end" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ev-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="ev-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="LIVE">Live</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
