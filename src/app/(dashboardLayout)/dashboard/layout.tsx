export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* <DashboardSidebar /> */}
      <h2>Dashboard Sidebar</h2>
      <div className="flex-1 flex flex-col">
        {/* <DashboardMobileNav /> */}
        <h2>Dashboard Mobile Navbar</h2>
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
