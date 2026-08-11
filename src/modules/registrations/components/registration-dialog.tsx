import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useUpdateRegistration, ApiRegistration } from "../services/registrations.api";
import { toast } from "sonner";

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration?: ApiRegistration | null;
}

export function RegistrationDialog({ open, onOpenChange, registration }: RegistrationDialogProps) {
  const [status, setStatus] = useState("PENDING");

  const updateMutation = useUpdateRegistration();

  useEffect(() => {
    if (registration) {
      setStatus(registration.status);
    } else {
      setStatus("PENDING");
    }
  }, [registration, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration) return;
    try {
      await updateMutation.mutateAsync({ id: registration.id, status });
      toast.success("Registration status updated");
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message ?? "Failed to update registration");
    }
  };

  const participantName = registration?.user
    ? `${registration.user.firstName ?? ""} ${registration.user.lastName ?? ""}`.trim() || registration.user.email
    : "Participant";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Registration</DialogTitle>
            <DialogDescription>
              Manage registration status for <strong>{participantName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reg-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="reg-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
