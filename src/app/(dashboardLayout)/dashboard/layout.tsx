import DashboardNavbar from "@/components/module/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/module/Dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <DashboardNavbar />
      <div className="flex w-full flex-1 min-h-[calc(100vh-4rem)]">
        <DashboardSidebar />
        {children}
      </div>
    </div>
  );
}
