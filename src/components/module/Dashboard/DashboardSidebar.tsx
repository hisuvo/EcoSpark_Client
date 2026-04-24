import { NavSection } from "@/type/dashboard.type";
import { IUser } from "@/type/user.type";
import DashboardSidebarContent from "./DashboardSidebarContent";
import { getNavItemsByRole } from "@/lib/navItems";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { UserRole } from "@/type/role.type";

export default async function DashboardSidebar({
  userInfo,
}: {
  userInfo: IUser;
}) {
  if (!userInfo) return null;

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role as UserRole);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role as UserRole);

  return (
    <>
      <DashboardSidebarContent
        userInfo={userInfo}
        navItems={navItems}
        DashboardHome={dashboardHome}
      />
    </>
  );
}
