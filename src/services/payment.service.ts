/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/apiClient";

export const getPaymentStatus = async (ideaId: string) => {
  try {
    const res = await httpClient.get<boolean>(`/payments/${ideaId}/status`);
    return res;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch payment status",
    );
  }
};


export const createPaymentIntent = async (ideaId: string) => {
  try {
    const res = await httpClient.post<{ client_secret: string }>(
      `/payments/${ideaId}/pay`,
      {},
    );
    return res;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Payment intent failed");
  }
};

