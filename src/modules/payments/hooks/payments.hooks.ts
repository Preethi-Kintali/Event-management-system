import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["payments", "plans"],
    queryFn: async () => {
      const response = await fetchApi<{ data: any[] }>("/api/v1/payments/plans");
      return response.data;
    },
  });
};

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ["payments", "subscription"],
    queryFn: async () => {
      const response = await fetchApi<{ data: any }>("/api/v1/payments/subscription");
      return response.data;
    },
  });
};

export const usePaymentTransactions = () => {
  return useQuery({
    queryKey: ["payments", "transactions"],
    queryFn: async () => {
      const response = await fetchApi<{ data: any[] }>("/api/v1/payments/transactions");
      return response.data;
    },
  });
};

export const usePaymentInvoices = () => {
  return useQuery({
    queryKey: ["payments", "invoices"],
    queryFn: async () => {
      const response = await fetchApi<{ data: any[] }>("/api/v1/payments/invoices");
      return response.data;
    },
  });
};

export const usePaymentDashboard = () => {
  return useQuery({
    queryKey: ["payments", "dashboard"],
    queryFn: async () => {
      const response = await fetchApi<{ data: any }>("/api/v1/payments/dashboard");
      return response.data;
    },
  });
};

export const useUpdateBillingProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetchApi<{ data: any }>("/api/v1/payments/billing-profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "subscription"] });
    },
  });
};

export const useCheckout = () => {
  return useMutation({
    mutationFn: async (data: { planId: string; successUrl: string; cancelUrl: string; couponCode?: string }) => {
      const response = await fetchApi<{ data: { url: string } }>("/api/v1/payments/checkout", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await fetchApi<{ data: any }>(`/api/v1/payments/coupons/validate?code=${code}`);
      return response.data;
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { paymentId: string; amount?: number; reason?: string }) => {
      const response = await fetchApi<{ data: any }>("/api/v1/payments/refund", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "dashboard"] });
    },
  });
};

export const exportPaymentsCSV = async () => {
  const token = localStorage.getItem("auth_token");
  const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL'] || "http://localhost:5000"}/api/v1/payments/export?format=csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-organization-id": localStorage.getItem("active_organization_id") || "",
    },
  });
  
  if (!response.ok) throw new Error("Export failed");
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payments_${new Date().getTime()}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
