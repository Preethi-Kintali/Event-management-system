import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export type ApiRegistration = {
  id: string;
  eventId: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  event?: { name: string };
  user?: { firstName: string | null; lastName: string | null; email: string };
};

export type CreateRegistrationInput = {
  eventId: string;
  userId: string;
  status?: string;
};

export function useRegistrations(eventId?: string, search?: string) {
  return useQuery({
    queryKey: ["registrations", { eventId, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (eventId) params.append("eventId", eventId);
      if (search) params.append("search", search);
      params.append("limit", "50");
      
      const queryString = params.toString();
      const url = queryString ? `/registrations?${queryString}` : "/registrations";
      
      const res = await fetchApi(url);
      return res.data as ApiRegistration[];
    },
  });
}

export function useRegistration(id: string) {
  return useQuery({
    queryKey: ["registrations", id],
    queryFn: async () => {
      const res = await fetchApi(`/registrations/${id}`);
      return res.data as ApiRegistration;
    },
    enabled: !!id,
  });
}

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateRegistrationInput) => {
      const res = await fetchApi("/registrations", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data as ApiRegistration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<CreateRegistrationInput> & { id: string; status?: string }) => {
      const res = await fetchApi(`/registrations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return res.data as ApiRegistration;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrations", variables.id] });
    },
  });
}

export function useDeleteRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/registrations/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}
