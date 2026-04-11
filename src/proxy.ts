import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import { UserRole } from "./type/role.type";
import { TokenPayload } from "./type/token.type";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
} from "./lib/authUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { getNewTokenWithRefreshToken } from "./services/auth.service";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const refreshTokenMiddleware = async (refreshToken: string) => {
  try {
    const refresh = getNewTokenWithRefreshToken(refreshToken);
    if (!refresh) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in refresh token middleware", error);
    return false;
  }
};

// Example of default export
export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const decodedAccessToken =
      accessToken &&
      jwtUtils.verifyToken(accessToken, JWT_ACCESS_SECRET as string).data;

    const isVerifyAccessToken =
      accessToken &&
      jwtUtils.verifyToken(accessToken, JWT_ACCESS_SECRET as string).success;

    let userRole: UserRole | null = null;

    if (isVerifyAccessToken) {
      const decod = decodedAccessToken as TokenPayload;
      userRole = decod.role;
    }

    const routerOwner = getRouteOwner(pathname);

    if (
      isVerifyAccessToken &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken))
    ) {
      const requestHeaders = new Headers(request.headers);
      NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      try {
        const refresh = await refreshTokenMiddleware(refreshToken);
        if (refresh) {
          requestHeaders.set("x-token-refreshed", "1");
        }
      } catch (error) {
        console.error("Error in refresh token middleware", error);
        return NextResponse.next();
      }
    }

    if (isAuthRoute(pathname) && isVerifyAccessToken) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    if (routerOwner === null) {
      return NextResponse.next();
    }

    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }

    if (routerOwner === "ADMIN" || routerOwner === "MEMBER") {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware", error);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
