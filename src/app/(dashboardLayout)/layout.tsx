import DashboardNavbar from "@/components/module/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/module/Dashboard/DashboardSidebar";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <DashboardNavbar />
      <div className="flex w-full flex-1 min-h-[calc(100vh-4rem)]">
        <DashboardSidebar />
        <div className="flex-1 w-full overflow-x-hidden p-4">{children}</div>
      </div>
    </div>
  );
}
