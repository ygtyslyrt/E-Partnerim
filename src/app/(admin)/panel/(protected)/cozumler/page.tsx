import { getSolutions } from "@/lib/actions/solutions"
import SolutionList from "@/components/admin/solutions/SolutionList"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Çözümler" }

export default async function CozumlerAdminPage() {
  const { data: solutions } = await getSolutions(1, 100)
  return (
    <div className="max-w-3xl">
      <SolutionList initialSolutions={solutions} />
    </div>
  )
}
