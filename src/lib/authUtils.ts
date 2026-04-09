import { UserRole } from "@/type/role.type";

const authRoute = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export const isAuthRoute = (pathname: string) => {
  return authRoute.includes(pathname);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
  pattern: [],
  exact: ["/my-profile", "/change-password"],
};

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard\/admin/],
  exact: [],
};

export const memberProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard\/member/],
  exact: ["/payment/success"],
};

export const isRouteMatches = (pathname: string, route: RouteConfig) => {
  if (route.exact.includes(pathname)) {
    return true;
  }

  return route.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

// This function inside check Owner Route
export const getRouteOwner = (pathname: string): UserRole | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, memberProtectedRoutes)) {
    return "MEMBER";
  }

  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }

  return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === "ADMIN") {
    return "/dashboard/admin";
  }

  if (role === "MEMBER") {
    return "/dashboard/member";
  }

  if (role === "COMMON") {
    return "/my-profile";
  }

  return "/";
};

export const isValideRedirectForRole = (
  redirectpath: string,
  role: UserRole,
) => {
  const routerOwner = getRouteOwner(redirectpath);

  if (routerOwner === null || routerOwner === "COMMON") {
    return true;
  }

  if (routerOwner === role) {
    return true;
  }

  // routerOwner and role don't match then return below statement
  return false;
};
