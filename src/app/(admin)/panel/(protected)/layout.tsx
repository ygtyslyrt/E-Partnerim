import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import PanelSidebar from "@/components/admin/PanelSidebar"
import PanelTopbar from "@/components/admin/PanelTopbar"

export const metadata = { title: { default: "Panel", template: "%s | E-Partnerim Panel" } }

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/panel/giris")

  return (
    <div className="flex h-screen overflow-hidden bg-[#F3F4FB]">
      <PanelSidebar role={session.user.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PanelTopbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
