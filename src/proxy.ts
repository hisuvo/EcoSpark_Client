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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

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
  ],
};
