"use server";

import { API_BASE_URL } from "@/lib/constants";
import { setTokenCookie } from "@/lib/tokenUtils";

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
      return false;
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
  } catch (error) {
    console.error("Error refreshing token", error);
    return false;
  }
};
