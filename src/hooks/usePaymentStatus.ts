import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "@/services/payment.service";

export const usePaymentStatus = (ideaId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["payment-status", ideaId],
    queryFn: () => getPaymentStatus(ideaId),
    enabled,
  });
};
