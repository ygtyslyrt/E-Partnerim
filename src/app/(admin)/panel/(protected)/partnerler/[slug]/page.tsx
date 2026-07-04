import { getPartner, updatePartner, deletePartner } from "@/lib/actions/partners"
import { getPlatforms } from "@/lib/actions/platforms"
import { getSolutions } from "@/lib/actions/solutions"
import PartnerForm from "@/components/admin/partners/PartnerForm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const partner = await getPartner(slug)
  return { title: partner ? `${partner.name} — Düzenle` : "Partner Bulunamadı" }
}

export default async function PartnerEditPage({ params }: Props) {
  const { slug } = await params
  const [partner, { data: platforms }, { data: solutions }] = await Promise.all([
    getPartner(slug),
    getPlatforms(1, 200),
    getSolutions(1, 200),
  ])
  if (!partner) notFound()

  async function save(data: Parameters<typeof updatePartner>[1]) {
    "use server"
    return updatePartner(partner!.id, data)
  }

  async function remove() {
    "use server"
    return deletePartner(partner!.id)
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/panel/partnerler" className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{partner.name}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Son güncelleme: {new Date(partner.updatedAt).toLocaleDateString("tr-TR", { dateStyle: "long" })}
          </p>
        </div>
      </div>

      <PartnerForm
        initial={partner}
        onSave={save}
        onDelete={remove}
        allPlatforms={platforms.map((p) => ({ id: p.id, name: p.name }))}
        allSolutions={solutions.map((s) => ({ id: s.id, title: s.title }))}
      />
    </div>
  )
}
