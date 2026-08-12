import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import {
  Certificate,
  CreateCertificatePayload,
  BulkIssueCertificatePayload,
} from "../types/certificate.types";

export const CERTIFICATE_KEYS = {
  all: ["certificates"] as const,
  list: () => [...CERTIFICATE_KEYS.all, "list"] as const,
  detail: (id: string) => [...CERTIFICATE_KEYS.all, "detail", id] as const,
  verify: (code: string) => ["verify_certificate", code] as const,
};

export function useCertificates() {
  return useQuery({
    queryKey: CERTIFICATE_KEYS.list(),
    queryFn: () => fetchApi("/certificates") as Promise<Certificate[]>,
  });
}

export function useCertificate(id: string) {
  return useQuery({
    queryKey: CERTIFICATE_KEYS.detail(id),
    queryFn: () => fetchApi(`/certificates/${id}`) as Promise<Certificate>,
    enabled: !!id,
  });
}

export function useVerifyCertificate(code: string) {
  return useQuery({
    queryKey: CERTIFICATE_KEYS.verify(code),
    queryFn: () => fetchApi(`/certificates/verify/${code}`) as Promise<Certificate>,
    enabled: !!code,
    retry: false,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCertificatePayload) =>
      fetchApi("/certificates", {
        method: "POST",
        body: JSON.stringify(data),
      }) as Promise<Certificate>,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.list() }),
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCertificatePayload> }) =>
      fetchApi(`/certificates/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }) as Promise<Certificate>,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.list() });
    },
  });
}

export function useBulkIssueCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkIssueCertificatePayload) =>
      fetchApi("/certificates/bulk-issue", {
        method: "POST",
        body: JSON.stringify(data),
      }) as Promise<any>,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.list() }),
  });
}

export function useRevokeCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/certificates/${id}/revoke`, {
        method: "POST",
      }) as Promise<Certificate>,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.list() });
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/certificates/${id}`, {
        method: "DELETE",
      }) as Promise<void>,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CERTIFICATE_KEYS.list() }),
  });
}
