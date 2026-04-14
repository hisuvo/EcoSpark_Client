import { getUserInfo } from "@/services/auth.service";
import DashboardNavbarContent from "./DashboardNavbarContent";
import { getNavItemsByRole } from "@/lib/navItems";
import { getDefaultDashboardRoute } from "@/lib/authUtils";

export default async function DashboardNavbar() {
  const userInfo = await getUserInfo();
  const navItems = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

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
