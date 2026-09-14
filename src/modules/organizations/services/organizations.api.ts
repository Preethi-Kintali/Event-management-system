import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

export type OrganizationMember = {
  id: string;
  userId: string;
  organizationId: string;
  roleId: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export function useOrganizationMembers() {
  const { activeOrganization } = useAuth();
  
  return useQuery({
    queryKey: ["organization", "members"],
    queryFn: async () => {
      // Use the active organizationId
      const orgId = activeOrganization;
      if (!orgId) throw new Error("No organization ID found");
      const res = await fetchApi(`/organizations/${orgId}/members`);
      return res.data as OrganizationMember[];
    },
    enabled: !!activeOrganization,
  });
}
