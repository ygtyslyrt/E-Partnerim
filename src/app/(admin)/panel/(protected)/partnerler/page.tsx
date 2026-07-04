import { getPartners } from "@/lib/actions/partners"
import { getPartnerApplications } from "@/lib/actions/partner-applications"
import PartnerList from "@/components/admin/partners/PartnerList"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Partnerler" }

export default async function PartnerlerPage() {
  const [{ data: partners }, pending] = await Promise.all([
    getPartners(1, 100),
    getPartnerApplications("PENDING"),
  ])

  return (
    <div className="max-w-3xl">
      <PartnerList initialPartners={partners} pendingCount={pending.length} />
    </div>
  )
}
