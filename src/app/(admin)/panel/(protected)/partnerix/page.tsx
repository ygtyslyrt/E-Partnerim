import { getPartnerixFlow } from "@/lib/actions/partnerix"
import { getPlatforms } from "@/lib/actions/platforms"
import { getSolutions } from "@/lib/actions/solutions"
import { getPartners } from "@/lib/actions/partners"
import PartnerixFlowEditor from "@/components/admin/partnerix/PartnerixFlowEditor"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Partnerix" }

export default async function PartnerixPage() {
  const [flow, { data: platforms }, { data: solutions }, { data: partners }] = await Promise.all([
    getPartnerixFlow(),
    getPlatforms(1, 200),
    getSolutions(1, 200),
    getPartners(1, 200),
  ])

  return (
    <div className="max-w-4xl">
      <PartnerixFlowEditor
        initialData={flow}
        allPlatforms={platforms.map((p) => ({ id: p.id, name: p.name }))}
        allSolutions={solutions.map((s) => ({ id: s.id, title: s.title }))}
        allPartners={partners.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  )
}
