"use server";

import { httpClient } from "@/lib/axios/apiClient";
import { ApiResponse } from "@/type/api.type";

export const createCheckoutSession = async (
  ideaId: string,
): Promise<{ url: string }> => {
  const response = await httpClient.post<ApiResponse<{ url: string }>>(
    "/payments/create-checkout-session",
    {
      ideaId,
    },
  );

  return response.data.data;
};
