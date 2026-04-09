import { UserRole } from "@/type/role.type";
import { RouteConfig } from "@/type/routeConfig.type";

// Centaralize Route Registary
const routeRegistary: RouteConfig[] = [
  {
    role: "ADMIN",
    exact: ["/dashboard/admin"],
    pattern: [/^\/dashboard\/admin/],
    priority: 100, // Highly specific
  },
  {
    role: "MEMBER",
    exact: ['/dashboard/member','/payment/success'],
    pattern: [/^\/dashboard\/member/],
    priority: 90,
  },
  {
    role:"COMMON",
    pattern: [],
    exact: ["/my-profile", "/change-password"],
    priority:80,
  }
];

// Route macting
const isRouteMatch = (pathname: string, config: RouteConfig): boolean => {
  if (config.exact.includes(pathname)) {
    return true;
  }

  return config.pattern.some((regex) => regex.test(pathname));
};

// Get Route Owner
export const getRouteOwner = (pathname: string): UserRole | null => {
  const sortedRoute = [...routeRegistary].sort(
    (a, b) => a.priority - b.priority,
  );

  for (const route of sortedRoute) {
    if (isRouteMatch(pathname, route)) {
      return route.role;
    }
  }

  return null;
};

export const getDefaultDashboardRoute = (role:UserRole) => {
  const route = routeRegistary.find((r) => r.role === role);
  if(route){
    return route.exact[0];
  }
  return "/";
}

export const isValideRedirectForRole = (role:UserRole,redirectPath:string) => {
  const route = routeRegistary.find((r) => r.role === role);
  if(route){
    return route.exact.includes(redirectPath);
  }
  return false;
}