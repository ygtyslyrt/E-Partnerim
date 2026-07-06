import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getAssignableUsers } from "@/lib/actions/leads"
import NewLeadForm from "@/components/admin/crm/NewLeadForm"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Yeni Lead" }

export default async function YeniLeadPage() {
  const users = await getAssignableUsers()

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/panel/crm" className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Yeni Lead</h1>
          <p className="mt-0.5 text-sm text-slate-500">CRM&apos;e manuel olarak yeni bir lead ekle</p>
        </div>
      </div>

      <NewLeadForm users={users} />
    </div>
  )
}
