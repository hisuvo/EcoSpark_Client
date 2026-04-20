"use server";

import { httpClient } from "@/lib/axios/apiClient";
import { IUser } from "@/type/user.type";
import axios from "axios";
import { redirect } from "next/navigation";

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface RegisterSuccessResponse {
  success: true;
  token: string;
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

interface RegisterErrorResponse {
  success: false;
  message: string;
}

type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;

export const RegisterAction = async (
  payload: IRegisterPayload,
): Promise<RegisterResponse> => {
  try {
    const response = await httpClient.post<RegisterSuccessResponse>(
      "/auth/register",
      payload,
    );

    if (response.success) {
      const { user } = response.data || {};
      redirect(`/verify-email?email=${user?.email}`);
    }

    return {
      ...(typeof response.data === "object" ? response.data : {}),
      success: response.success,
      message: response.message,
    } as RegisterErrorResponse;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
