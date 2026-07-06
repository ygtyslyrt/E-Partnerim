import { getPublishedSolutions } from "@/lib/actions/solutions"
import CozumlerClient from "./CozumlerClient"
import { getPageBySlug } from "@/lib/actions/seo"
import { buildPageMetadata } from "@/lib/seo-metadata"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("/cozumler")
  return buildPageMetadata(
    page,
    "Çözümler — E-Partnerim",
    "Hangi e-ticaret altyapısını seçmeli, dijital pazarlamayı nasıl yönetmeli? Ücretsiz rehberlik ve doğru partnere yönlendirme."
  )
}

export default async function CozumlerPage() {
  const solutions = await getPublishedSolutions()
  return <CozumlerClient solutions={solutions} />
}
