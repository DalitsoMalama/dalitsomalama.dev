import { Backdrop } from "@/components/Backdrop";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Backdrop />
      <ScrollProgress />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
