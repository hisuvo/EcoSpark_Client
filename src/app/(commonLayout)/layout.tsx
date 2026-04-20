import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getUserInfo } from "@/services/auth.service";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
