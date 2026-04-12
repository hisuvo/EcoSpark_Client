export default function MemberDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-[calc(100vh-4rem)]">{children}</div>;
}
