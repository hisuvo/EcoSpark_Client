import Footer from "@/components/layout/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2>Navbar here keep</h2>
      {children}
      <Footer />
    </div>
  );
}
