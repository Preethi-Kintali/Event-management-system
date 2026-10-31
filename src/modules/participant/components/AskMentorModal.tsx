import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader2 } from "lucide-react";

interface AskMentorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionText: string;
  onQuestionTextChange: (text: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const AskMentorModal: React.FC<AskMentorModalProps> = ({
  open,
  onOpenChange,
  questionText,
  onQuestionTextChange,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Ask Mentor a Doubt
          </DialogTitle>
          <DialogDescription className="pt-1 text-xs text-muted-foreground">
            Submit your question regarding problem statement or round requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Your Question / Doubt</Label>
            <Textarea
              rows={4}
              placeholder="Describe your technical issue, question regarding problem statement, or round guidelines..."
              value={questionText}
              onChange={(e) => onQuestionTextChange(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!questionText.trim() || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            Submit Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
