"use server";

import {
  getDefaultDashboardRoute,
  isValideRedirectForRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/apiClient";
import { setTokenCookie } from "@/lib/tokenUtils";
import { LoginResponse, LoginSuccessResponse } from "@/type/auth.type";
import { UserRole } from "@/type/role.type";
import { ILoginPayload } from "@/zod/auth.validation";
import axios from "axios";
import { redirect } from "next/navigation";

export const loginAction = async (
  payload: ILoginPayload,
  redirectpath?: string,
): Promise<LoginResponse> => {
  try {
    const response = await httpClient.post<LoginSuccessResponse>(
      "/auth/login",
      payload,
    );

    if (response.success) {
      const { accessToken, refreshToken, token, user } = response.data || {};

      if (accessToken) await setTokenCookie("accessToken", accessToken);
      if (refreshToken) await setTokenCookie("refreshToken", refreshToken);
      if (token) await setTokenCookie("better-auth.session_token", token);

      const { email, emailVerified, role, needPasswordChange } = user;

      if (!emailVerified) {
        redirect(`/verify-email?email=${email}`);
      } else if (needPasswordChange) {
        redirect(`/reset-password?email=${email}`);
      } else {
        const targetpath =
          redirectpath &&
          isValideRedirectForRole(redirectpath, role as UserRole)
            ? redirectpath
            : getDefaultDashboardRoute(role as UserRole);

        redirect(targetpath);
      }
    }

    // Consolidated response ensures success and message are always available
    return {
      ...(typeof response.data === "object" ? response.data : {}),
      success: response.success,
      message: response.message,
    } as LoginResponse;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    // Check if email is not verified - redirect to verify page
    if (
      errorMessage.toLowerCase().includes("email") &&
      (errorMessage.toLowerCase().includes("not verify") ||
        errorMessage.toLowerCase().includes("verify") ||
        errorMessage.toLowerCase().includes("verified"))
    ) {
      redirect(`/verify-email?email=${payload.email}`);
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};
