/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/apiClient";
import { API_BASE_URL } from "@/lib/constants";
import { setTokenCookie } from "@/lib/tokenUtils";
import { cookies } from "next/headers";
import { ApiErrorResponse } from "@/type/api.type";
import {
  ChangePasswordResponse,
  ChangePasswordSuccessResponse,
} from "@/type/auth.type";

export const getNewTokenWithRefreshToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!response.ok) {
      return { success: false };
    }

    const { data } = await response.json();

    const { accessToken, refreshToken: newRefreshToken, sessionToken } = data;

    if (accessToken) {
      await setTokenCookie("accessToken", accessToken);
    }

    if (newRefreshToken) {
      await setTokenCookie("refreshToken", newRefreshToken);
    }

    if (sessionToken) {
      await setTokenCookie(
        "better-auth.session_token",
        sessionToken,
        60 * 60 * 24,
      );
    }

    return {
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error("Error refreshing token", error);
    return { success: false };
  }
};

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export const changePasswordService = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<ChangePasswordResponse> => {
  try {
    const response = await httpClient.post<ChangePasswordSuccessResponse>(
      "/auth/change-password",
      payload,
    );

    if (response.success) {
      const { accessToken, refreshToken, token } = response.data;

      await setTokenCookie("accessToken", accessToken);
      await setTokenCookie("refreshToken", refreshToken);
      await setTokenCookie("better-auth.session_token", token);

      return response;
    }
    return {
      ...(typeof response.data === "object" ? response.data : {}),
      success: response.success,
      message: response.message,
    } as ApiErrorResponse;
  } catch (error: any) {
    console.error("Error changing password:", error);

    // Handle axios error response
    if (error?.response?.data) {
      throw new Error(
        error.response.data.message || "Failed to change password",
      );
    }

    throw new Error(
      error?.message || "An error occurred while changing password",
    );
  }
};

interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export const verifyEmailService = async (
  payload: VerifyEmailPayload,
): Promise<VerifyEmailResponse> => {
  try {
    const response = await httpClient.post<VerifyEmailResponse>(
      "/auth/verify-email",
      payload,
    );

    return response;
  } catch (error: any) {
    console.error("Error verifying email:", error);

    // Handle axios error response
    if (error?.response?.data) {
      throw new Error(error.response.data.message || "Failed to verify email");
    }

    throw new Error(
      error?.message || "An error occurred while verifying email",
    );
  }
};

export const logoutService = async (): Promise<void> => {
  try {
    // Call logout API to invalidate tokens on backend
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    // Clear all auth cookies regardless of API response
    const cookieStore = await cookies();
    const authCookies = [
      "accessToken",
      "refreshToken",
      "better-auth.session_token",
    ];

    authCookies.forEach((cookieName) => {
      cookieStore.delete(cookieName);
    });
  }
};
