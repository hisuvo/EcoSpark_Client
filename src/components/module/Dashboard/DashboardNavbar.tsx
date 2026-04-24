import DashboardNavbarContent from "./DashboardNavbarContent";
import { getNavItemsByRole } from "@/lib/navItems";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { IUser } from "@/type/user.type";

import { UserRole } from "@/type/role.type";

export default async function DashboardNavbar({
  userInfo,
}: {
  userInfo: IUser;
}) {
  if (!userInfo) return null;

  const navItems = getNavItemsByRole(userInfo.role as UserRole);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role as UserRole);

  return (
    <>
      <DashboardNavbarContent
        userInfo={userInfo}
        navItems={navItems}
        dashboardHome={dashboardHome}
      />
    </>
  );
}
