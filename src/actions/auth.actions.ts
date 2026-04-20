"use server";

import { API_BASE_URL } from "@/lib/constants";
import { cookies } from "next/headers";

import { performHeadlessTokenRefresh } from "@/lib/auth/refresh-token";

export const refreshTokenAction = async (refreshToken: string) => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const data = await performHeadlessTokenRefresh(refreshToken, sessionToken);

    if (!data) {
      return { success: false };
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken: newSessionToken,
    } = data;

    if (accessToken) {
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
      const expiresIn = tokenPayload.exp - Math.floor(Date.now() / 1000);
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: expiresIn,
      });
    }

    if (newRefreshToken) {
      const refreshPayload = JSON.parse(atob(newRefreshToken.split(".")[1]));
      const refreshExpiresIn =
        refreshPayload.exp - Math.floor(Date.now() / 1000);
      cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: refreshExpiresIn,
      });
    }

    if (newSessionToken) {
      cookieStore.set("better-auth.session_token", newSessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { success: false };
  }
};
