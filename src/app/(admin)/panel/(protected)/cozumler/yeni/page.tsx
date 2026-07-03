import { createSolution } from "@/lib/actions/solutions"
import SolutionForm from "@/components/admin/solutions/SolutionForm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Yeni Çözüm" }

export default function YeniCozumPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/panel/cozumler"
          className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Yeni Çözüm</h1>
          <p className="mt-0.5 text-sm text-slate-500">Çözümler listesine yeni bir çözüm ekle</p>
        </div>
      </div>
      <SolutionForm onSave={createSolution} />
    </div>
  )
}
