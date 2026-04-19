import DashboardNavbar from "@/components/module/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/module/Dashboard/DashboardSidebar";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Fixed Navbar */}
      <DashboardNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4">{children}</div>
      </div>
    </div>
  );
}
