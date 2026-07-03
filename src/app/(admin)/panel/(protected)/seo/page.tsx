import type { Metadata } from "next"
export const metadata: Metadata = { title: "SEO" }

export default function SeoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">SEO Yönetimi</h1>
      <p className="mt-1 text-sm text-slate-500">Yakında aktif olacak.</p>
    </div>
  )
}
