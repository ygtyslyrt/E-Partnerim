import { createPartner } from "@/lib/actions/partners"
import { getPlatforms } from "@/lib/actions/platforms"
import { getSolutions } from "@/lib/actions/solutions"
import PartnerForm from "@/components/admin/partners/PartnerForm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Yeni Partner" }

export default async function YeniPartnerPage() {
  const [{ data: platforms }, { data: solutions }] = await Promise.all([
    getPlatforms(1, 200),
    getSolutions(1, 200),
  ])

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/panel/partnerler" className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Yeni Partner</h1>
          <p className="mt-0.5 text-sm text-slate-500">Partnerler listesine yeni bir iş ortağı ekle</p>
        </div>
      </div>

      <PartnerForm
        onSave={createPartner}
        allPlatforms={platforms.map((p) => ({ id: p.id, name: p.name }))}
        allSolutions={solutions.map((s) => ({ id: s.id, title: s.title }))}
      />
    </div>
  )
}
