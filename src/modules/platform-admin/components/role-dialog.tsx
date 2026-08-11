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
import { useCreateRole, useUpdateRole, usePermissions } from "../services/roles.api";
import { PlatformRole } from "../types/platform-admin.types";
import { Checkbox } from "@/components/ui/checkbox";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: PlatformRole | null;
}

export function RoleDialog({ open, onOpenChange, role }: RoleDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: availablePermissions = [] } = usePermissions();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();

  const isEditing = !!role;

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      // Wait, PlatformRole permissions from backend:
      // role.permissions is an array of { permission: { id, action } }
      // The frontend mock type might be different. Let's assume we map the IDs.
      const perms = (role as any).permissions?.map((p: any) => p.permission?.id || p.id) || [];
      setSelectedPermissions(perms);
    } else {
      setName("");
      setDescription("");
      setSelectedPermissions([]);
    }
  }, [role, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && role) {
        await updateMutation.mutateAsync({ 
          id: role.id, 
          name, 
          description, 
          permissions: selectedPermissions 
        });
      } else {
        await createMutation.mutateAsync({ 
          name, 
          description, 
          permissions: selectedPermissions 
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Role" : "Create Role"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update role permissions and details."
                : "Define a new role and assign permissions."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Event Manager"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Can manage events"
              />
            </div>
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-border p-3 rounded-md">
                {availablePermissions.map((p: any) => (
                  <div key={p.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`perm-${p.id}`} 
                      checked={selectedPermissions.includes(p.id)}
                      onCheckedChange={() => togglePermission(p.id)}
                    />
                    <label
                      htmlFor={`perm-${p.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {p.action}
                    </label>
                  </div>
                ))}
                {availablePermissions.length === 0 && (
                  <span className="text-sm text-muted-foreground">Loading permissions...</span>
                )}
              </div>
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
