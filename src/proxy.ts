/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtUtils } from "@/lib/jwtUtils";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isValideRedirectForRole,
} from "@/lib/authUtils";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./type/role.type";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { performHeadlessTokenRefresh } from "./lib/auth/refresh-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // 0. Token Refresh Logic
  if (accessToken && refreshToken && (await isTokenExpiringSoon(accessToken))) {
    const newData = await performHeadlessTokenRefresh(
      refreshToken,
      sessionToken,
    );

    if (newData) {
      const response = NextResponse.next();

      // Update cookies in the response
      if (newData.accessToken) {
        const tokenPayload = jwtUtils.decodeToken(newData.accessToken);
        const expiresIn =
          (tokenPayload.exp as number) - Math.floor(Date.now() / 1000);

        response.cookies.set("accessToken", newData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: expiresIn,
        });
      }

      if (newData.refreshToken) {
        const refreshPayload = jwtUtils.decodeToken(newData.refreshToken);
        const refreshExpiresIn =
          (refreshPayload.exp as number) - Math.floor(Date.now() / 1000);

        response.cookies.set("refreshToken", newData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: refreshExpiresIn,
        });
      }

      if (newData.sessionToken) {
        response.cookies.set("better-auth.session_token", newData.sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24,
        });
      }

      return response;
    }
  }

  let decodedToken: any = null;

  if (accessToken) {
    decodedToken = jwtUtils.decodeToken(accessToken);
  }

  const role = (decodedToken?.role as UserRole) || null;

  // 1. If user is logged in and tries to access auth routes (login, register, etc.)
  if (accessToken && isAuthRoute(pathname)) {
    if (role) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(role), request.url),
      );
    }
  }

  // 2. Role-based protection for dashboard routes
  const routeOwner = getRouteOwner(pathname);

  if (routeOwner) {
    // If not logged in or invalid token (no role), redirect to login
    if (!accessToken || !role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has permission for this route
    if (!isValideRedirectForRole(pathname, role)) {
      // Redirect to their own dashboard if they are trying to access someone else's
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(role), request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/my-profile",
    "/change-password",
    "/ideas", // Added to ensure ideas page can also trigger refresh
  ],
};
