import { createPlatform } from "@/lib/actions/platforms"
import PlatformForm from "@/components/admin/platforms/PlatformForm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Yeni Platform" }

export default function YeniPlatformPage() {
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
          <h1 className="text-2xl font-bold text-slate-800">Yeni Platform</h1>
          <p className="mt-0.5 text-sm text-slate-500">Platformlar listesine yeni bir platform ekle</p>
        </div>
      </div>

      <PlatformForm onSave={createPlatform} />
    </div>
  )
}
