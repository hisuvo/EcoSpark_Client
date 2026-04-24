import DashboardNavbar from "@/components/module/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/module/Dashboard/DashboardSidebar";
import { getUserInfo } from "@/services/auth.service";


export const dynamic = "force-dynamic";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Fixed Navbar */}
      <DashboardNavbar userInfo={userInfo} />

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <DashboardSidebar userInfo={userInfo} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4">{children}</div>
      </div>
    </div>
  );
}
