import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBulkIssueCertificates } from "../services/certificates.api";
import { useEvents } from "@/modules/events/services/events.api";
import { useRegistrations } from "@/modules/registrations/services/registrations.api";
import { BulkIssueCertificatePayload } from "../types/certificate.types";

const bulkSchema = z.object({
  eventId: z.string().min(1, "Event selection is required").uuid("Must be a valid event ID"),
  type: z.enum(["PARTICIPATION", "COMPLETION", "WINNER", "FINALIST", "JUDGE", "MENTOR", "VOLUNTEER"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
});

type BulkValues = z.infer<typeof bulkSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateBulkIssueDialog({ open, onOpenChange }: Props) {
  const { data: events = [] } = useEvents();
  const { data: registrations = [] } = useRegistrations();
  const bulkMutation = useBulkIssueCertificates();
  
  const [step, setStep] = useState<1 | 2>(1);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset } = useForm<BulkValues>({
    resolver: zodResolver(bulkSchema),
    defaultValues: {
      type: "PARTICIPATION",
    },
  });

  const selectedEventId = watch("eventId");
  const selectedType = watch("type");

  // Find eligible participants: filtering registrations by approved status for the selected event
  const eligibleUsers = registrations
    .filter(r => r.eventId === selectedEventId && r.status === "APPROVED")
    .map(r => ({ ...r.user, id: r.userId }));

  const onSubmit = async (data: BulkValues) => {
    if (step === 1) {
      if (eligibleUsers.length === 0) {
        toast.error("No eligible participants found for this event.");
        return;
      }
      setStep(2);
      return;
    }

    const payload = Object.fromEntries(Object.entries({
      ...data,
      userIds: eligibleUsers.map(u => u.id!)
    }).filter(([_, v]) => v !== undefined)) as unknown as BulkIssueCertificatePayload;

    bulkMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success(`Successfully issued ${res.count || eligibleUsers.length} certificates`);
        reset();
        setStep(1);
        onOpenChange(false);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to issue certificates in bulk");
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep(1);
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Issue Certificates</DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Select an event and certificate type to find eligible participants." 
              : `Review and confirm issuance to ${eligibleUsers.length} recipients.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bulkEventId">Event</Label>
                <Select 
                  value={selectedEventId} 
                  onValueChange={(val) => setValue("eventId", val, { shouldValidate: true })}
                >
                  <SelectTrigger id="bulkEventId" className={errors.eventId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.eventId && <p className="text-sm text-destructive">{errors.eventId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bulkType">Certificate Type</Label>
                  <Select 
                    value={selectedType} 
                    onValueChange={(val: any) => setValue("type", val, { shouldValidate: true })}
                  >
                    <SelectTrigger id="bulkType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PARTICIPATION">Participation</SelectItem>
                      <SelectItem value="COMPLETION">Completion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bulkTitle">Title</Label>
                  <Input 
                    id="bulkTitle" 
                    placeholder="e.g. Certificate of Participation" 
                    {...register("title")}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulkDesc">Description (Optional)</Label>
                <Textarea 
                  id="bulkDesc" 
                  placeholder="Custom message for the certificate" 
                  {...register("description")}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="bg-muted p-4 rounded-xl border border-border">
              <h4 className="font-medium mb-2">Issuance Summary</h4>
              <ul className="text-sm space-y-1 text-muted-foreground mb-4">
                <li><span className="font-medium text-foreground">Event:</span> {events.find(e => e.id === selectedEventId)?.name}</li>
                <li><span className="font-medium text-foreground">Type:</span> {selectedType}</li>
                <li><span className="font-medium text-foreground">Recipients:</span> {eligibleUsers.length} valid registrations</li>
              </ul>
              <div className="max-h-32 overflow-y-auto border-t border-border pt-2 text-xs">
                {eligibleUsers.map(u => (
                  <div key={u.id} className="py-1">{u.firstName} {u.lastName} ({u.email})</div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {step === 1 ? "Next Step" : isSubmitting ? "Issuing..." : "Confirm Bulk Issue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
