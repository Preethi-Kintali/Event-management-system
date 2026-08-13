import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateOrganization, useUpdateOrganization } from "../services/organizations.api";
import { Organization } from "../types/platform-admin.types";

interface OrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization | null;
}

export function OrganizationDialog({ open, onOpenChange, organization }: OrganizationDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();

  const isEditing = !!organization;

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      // Generate slug if missing.
      setSlug(organization.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    } else {
      setName("");
      setSlug("");
    }
  }, [organization, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: organization.id, name, slug });
      } else {
        await createMutation.mutateAsync({ name, slug, status: "ACTIVE" });
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Organization" : "Create Organization"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the organization here. Click save when you're done."
                : "Add a new organization to the platform."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEditing) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                placeholder="Acme Corp"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="acme-corp"
                required
                pattern="^[a-z0-9-]+$"
                title="Only lowercase letters, numbers, and hyphens"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
