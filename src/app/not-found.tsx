import Link from "next/link"
import { headers } from "next/headers"
import { Compass } from "lucide-react"
import { logNotFound } from "@/lib/actions/seo"

export default async function NotFound() {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname")
  if (pathname) {
    await logNotFound(pathname, headersList.get("referer"))
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FDF9]">
        <Compass className="h-7 w-7 text-[#00D084]" />
      </div>
      <p className="text-sm font-semibold text-[#00D084]">404</p>
      <h1 className="text-3xl font-bold text-[#0F172A]">Sayfa Bulunamadı</h1>
      <p className="max-w-md text-[#64748B]">
        Aradığınız sayfa taşınmış, kaldırılmış veya hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-[#00D084] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,208,132,0.35)] transition-all hover:bg-[#00bb76]"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}
