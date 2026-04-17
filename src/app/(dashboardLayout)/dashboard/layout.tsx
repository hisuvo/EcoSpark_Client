export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)]">
      <div className="flex-1 w-full flex flex-col">{children}</div>
    </div>
  );
}
