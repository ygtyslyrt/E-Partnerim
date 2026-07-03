import { getSolution, updateSolution, deleteSolution } from "@/lib/actions/solutions"
import SolutionForm from "@/components/admin/solutions/SolutionForm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const solution = await getSolution(slug)
  return { title: solution ? `${solution.title} — Düzenle` : "Çözüm Bulunamadı" }
}

export default async function CozumEditPage({ params }: Props) {
  const { slug } = await params
  const solution = await getSolution(slug)
  if (!solution) notFound()

  async function save(data: Parameters<typeof updateSolution>[1]) {
    "use server"
    return updateSolution(solution!.id, data)
  }

  async function remove() {
    "use server"
    return deleteSolution(solution!.id)
  }

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
          <h1 className="text-2xl font-bold text-slate-800">{solution.title}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Son güncelleme: {new Date(solution.updatedAt).toLocaleDateString("tr-TR", { dateStyle: "long" })}
          </p>
        </div>
      </div>
      <SolutionForm initial={solution} onSave={save} onDelete={remove} />
    </div>
  )
}
