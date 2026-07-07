import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/actions/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
