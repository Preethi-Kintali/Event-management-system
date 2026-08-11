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
import { useCreateCertificate } from "../services/certificates.api";
import { useEvents } from "@/modules/events/services/events.api";

const formSchema = z.object({
  userId: z.string().uuid("Recipient user ID is required"),
  eventId: z.string().uuid("Event selection is required"),
  type: z.enum(["PARTICIPATION", "COMPLETION", "WINNER", "FINALIST", "JUDGE", "MENTOR", "VOLUNTEER"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateCreateDialog({ open, onOpenChange }: Props) {
  const { data: events = [] } = useEvents();
  const createMutation = useCreateCertificate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "PARTICIPATION",
    },
  });

  const selectedEventId = watch("eventId");
  const selectedType = watch("type");

  const onSubmit = async (data: FormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Certificate issued successfully");
        reset();
        onOpenChange(false);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to issue certificate");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Issue Certificate</DialogTitle>
          <DialogDescription>
            Issue a single digital certificate. For multiple recipients, use Bulk Issue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="eventId">Event</Label>
            <Select 
              value={selectedEventId} 
              onValueChange={(val) => setValue("eventId", val, { shouldValidate: true })}
            >
              <SelectTrigger id="eventId" className={errors.eventId ? "border-destructive" : ""}>
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

          <div className="space-y-2">
            <Label htmlFor="userId">Recipient User ID</Label>
            <Input 
              id="userId" 
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" 
              {...register("userId")}
              className={errors.userId ? "border-destructive" : ""}
            />
            {errors.userId && <p className="text-sm text-destructive">{errors.userId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Certificate Type</Label>
              <Select 
                value={selectedType} 
                onValueChange={(val: any) => setValue("type", val, { shouldValidate: true })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARTICIPATION">Participation</SelectItem>
                  <SelectItem value="COMPLETION">Completion</SelectItem>
                  <SelectItem value="WINNER">Winner</SelectItem>
                  <SelectItem value="FINALIST">Finalist</SelectItem>
                  <SelectItem value="JUDGE">Judge</SelectItem>
                  <SelectItem value="MENTOR">Mentor</SelectItem>
                  <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. Winner Certificate" 
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Custom message for the certificate" 
              {...register("description")}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Issuing..." : "Issue Certificate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
