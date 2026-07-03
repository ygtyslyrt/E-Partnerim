import { getPlatforms } from "@/lib/actions/platforms"
import PlatformList from "@/components/admin/platforms/PlatformList"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Platformlar" }

export default async function PlatformlarPage() {
  const { data: platforms } = await getPlatforms(1, 100)

  return (
    <div className="max-w-3xl">
      <PlatformList initialPlatforms={platforms} />
    </div>
  )
}
