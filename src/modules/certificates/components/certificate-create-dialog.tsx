import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { useCreateCertificate } from "../services/certificates.api";
import { useEvents } from "@/modules/events/services/events.api";
import { useRegistrations } from "@/modules/registrations/services/registrations.api";
import { CreateCertificatePayload } from "../types/certificate.types";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  eventId: z.string().min(1, "Event selection is required").uuid("Must be a valid event ID"),
  userId: z.string().min(1, "Recipient user ID is required").uuid("Must be a valid UUID"),
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
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: events = [] } = useEvents();
  const createMutation = useCreateCertificate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "PARTICIPATION",
      userId: "",
      eventId: "",
    },
  });

  const selectedEventId = watch("eventId");
  const selectedType = watch("type");
  const selectedUserId = watch("userId");

  const { data: registrations = [], isLoading: isLoadingRegistrations } = useRegistrations(selectedEventId, debouncedSearch);

  // Reset user selection when event changes
  useEffect(() => {
    if (selectedEventId) {
      setValue("userId", "", { shouldValidate: false });
    }
  }, [selectedEventId, setValue]);

  const onSubmit = async (data: FormValues) => {
    const payload = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined)) as unknown as CreateCertificatePayload;
    createMutation.mutate(payload, {
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

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="userId">Recipient</Label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="userId"
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  disabled={!selectedEventId || isLoadingRegistrations}
                  className={cn(
                    "w-full justify-between",
                    !selectedUserId && "text-muted-foreground",
                    errors.userId ? "border-destructive" : ""
                  )}
                >
                  {selectedUserId
                    ? registrations.find((r) => r.userId === selectedUserId)?.user?.firstName
                      ? `${registrations.find((r) => r.userId === selectedUserId)?.user?.firstName} ${registrations.find((r) => r.userId === selectedUserId)?.user?.lastName}`
                      : registrations.find((r) => r.userId === selectedUserId)?.user?.email
                    : !selectedEventId 
                      ? "Select an event first" 
                      : isLoadingRegistrations 
                        ? "Loading participants..." 
                        : "Select participant..."}
                  {isLoadingRegistrations ? (
                    <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
                  ) : (
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[450px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Search participant by name or email..." 
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>No eligible participants found.</CommandEmpty>
                    <CommandGroup>
                      {registrations.map((reg) => (
                        <CommandItem
                          key={reg.id}
                          value={`${reg.user?.firstName} ${reg.user?.lastName} ${reg.user?.email}`} // Make it searchable by name and email
                          onSelect={() => {
                            setValue("userId", reg.userId, { shouldValidate: true });
                            setComboboxOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedUserId === reg.userId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{reg.user?.firstName} {reg.user?.lastName}</span>
                            <span className="text-xs text-muted-foreground">{reg.user?.email}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
