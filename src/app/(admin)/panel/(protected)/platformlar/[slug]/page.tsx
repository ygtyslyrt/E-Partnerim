import { getPlatform, updatePlatform, deletePlatform } from "@/lib/actions/platforms"
import PlatformForm from "@/components/admin/platforms/PlatformForm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const platform = await getPlatform(slug)
  return { title: platform ? `${platform.name} — Düzenle` : "Platform Bulunamadı" }
}

export default async function PlatformEditPage({ params }: Props) {
  const { slug } = await params
  const platform = await getPlatform(slug)
  if (!platform) notFound()

  async function save(data: Parameters<typeof updatePlatform>[1]) {
    "use server"
    return updatePlatform(platform!.id, data)
  }

  async function remove() {
    "use server"
    return deletePlatform(platform!.id)
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/panel/platformlar"
          className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{platform.name}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Son güncelleme: {new Date(platform.updatedAt).toLocaleDateString("tr-TR", { dateStyle: "long" })}
          </p>
        </div>
      </div>

      <PlatformForm initial={platform} onSave={save} onDelete={remove} />
    </div>
  )
}
