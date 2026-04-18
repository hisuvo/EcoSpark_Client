export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <div className="flex-1 w-full flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
