import { getPartnerApplications } from "@/lib/actions/partner-applications"
import ApplicationsQueue from "@/components/admin/partners/ApplicationsQueue"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Partner Başvuruları" }

export default async function BasvurularPage() {
  const applications = await getPartnerApplications()

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/panel/partnerler" className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Partner Başvuruları</h1>
          <p className="mt-0.5 text-sm text-slate-500">Herkese açık başvuru formundan gelen istekleri incele</p>
        </div>
      </div>

      <ApplicationsQueue initialApplications={applications} />
    </div>
  )
}
