import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddRecruitmentCandidate, useRecruitmentJobs } from "../hooks/recruitment.api";
import { useUsers } from "@/modules/users/services/users.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CandidateCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateCreateDialog({ open, onOpenChange }: CandidateCreateDialogProps) {
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: jobs = [], isLoading: jobsLoading } = useRecruitmentJobs();
  const addMutation = useAddRecruitmentCandidate();

  const [candidateId, setCandidateId] = useState("");
  const [jobId, setJobId] = useState("");
  const [stage, setStage] = useState("NEW");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId || !jobId) {
      toast.error("Please select a candidate and a job role.");
      return;
    }
    try {
      await addMutation.mutateAsync({ candidateId, jobId, stage });
      toast.success("Candidate added successfully");
      onOpenChange(false);
      setCandidateId("");
      setJobId("");
      setStage("NEW");
    } catch (error: any) {
      toast.error(error.message || "Failed to add candidate");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              Add a new candidate to the recruitment pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="candidate">Candidate</Label>
              <Select value={candidateId} onValueChange={setCandidateId} disabled={usersLoading}>
                <SelectTrigger id="candidate">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="job">Job Role</Label>
              <Select value={jobId} onValueChange={setJobId} disabled={jobsLoading}>
                <SelectTrigger id="job">
                  <SelectValue placeholder="Select job role" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} ({job.company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stage">Initial Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New / Application</SelectItem>
                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                  <SelectItem value="OFFER">Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMutation.isPending || !candidateId || !jobId}>
              {addMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Candidate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
