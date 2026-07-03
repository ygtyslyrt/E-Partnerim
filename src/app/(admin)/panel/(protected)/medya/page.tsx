import { getAllFolders } from "@/lib/actions/media"
import MediaLibrary from "@/components/admin/media/MediaLibrary"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Medya Kütüphanesi" }

export default async function MedyaPage() {
  const folders = await getAllFolders()
  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medya Kütüphanesi</h1>
          <p className="mt-0.5 text-sm text-slate-500">Tüm görseller ve dosyalar burada yönetilir</p>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <MediaLibrary initialFolders={folders} />
      </div>
    </div>
  )
}
