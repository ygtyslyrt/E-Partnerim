import { getPublishedSolutions } from "@/lib/actions/solutions"
import CozumlerClient from "./CozumlerClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Çözümler — E-Partnerim",
  description: "Hangi e-ticaret altyapısını seçmeli, dijital pazarlamayı nasıl yönetmeli? Ücretsiz rehberlik ve doğru partnere yönlendirme.",
}

export default async function CozumlerPage() {
  const solutions = await getPublishedSolutions()
  return <CozumlerClient solutions={solutions} />
}
