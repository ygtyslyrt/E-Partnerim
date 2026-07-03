import { getPublishedPlatforms } from "@/lib/actions/platforms"
import PlatformlarClient, { type CategoryGroup } from "./PlatformlarClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Platformlar — E-Partnerim",
  description: "Türkiye'nin önde gelen e-ticaret altyapılarını, entegrasyon araçlarını ve iş yazılımlarını tarafsız biçimde değerlendiriyoruz.",
}

const CATEGORY_LABELS: Record<string, string> = {
  "E-Ticaret": "E-Ticaret Altyapıları",
  "Pazarlama": "Entegrasyon & Pazarlama",
  "Ödeme": "Ödeme Sistemleri",
  "Muhasebe": "Muhasebe & ERP",
}

const CATEGORY_ORDER = ["E-Ticaret", "Pazarlama", "Ödeme", "Muhasebe"]

export default async function PlatformlarPage() {
  const platforms = await getPublishedPlatforms()

  const map = new Map<string, CategoryGroup>()
  for (const p of platforms) {
    const id = p.category ?? "Diğer"
    if (!map.has(id)) {
      map.set(id, { id, label: CATEGORY_LABELS[id] ?? id, platforms: [] })
    }
    map.get(id)!.platforms.push(p)
  }

  const categories = [...map.values()].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.id)
    const bi = CATEGORY_ORDER.indexOf(b.id)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  return <PlatformlarClient categories={categories} />
}
