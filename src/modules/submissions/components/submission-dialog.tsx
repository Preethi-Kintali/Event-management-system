import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useUpdateSubmission, ApiSubmission } from "../services/submissions.api";
import { toast } from "sonner";

interface SubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission?: ApiSubmission | null;
}

export function SubmissionDialog({ open, onOpenChange, submission }: SubmissionDialogProps) {
  const [status, setStatus] = useState("SUBMITTED");

  const updateMutation = useUpdateSubmission();

  useEffect(() => {
    if (submission) {
      setStatus(submission.status);
    } else {
      setStatus("SUBMITTED");
    }
  }, [submission, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;
    try {
      await updateMutation.mutateAsync({ id: submission.id, status });
      toast.success("Submission status updated");
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message ?? "Failed to update submission");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Submission</DialogTitle>
            <DialogDescription>
              Manage submission status for <strong>{submission?.title ?? "submission"}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sub-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="sub-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="IN_REVIEW">In Review</SelectItem>
                  <SelectItem value="EVALUATED">Evaluated</SelectItem>
                  <SelectItem value="DISQUALIFIED">Disqualified</SelectItem>
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
