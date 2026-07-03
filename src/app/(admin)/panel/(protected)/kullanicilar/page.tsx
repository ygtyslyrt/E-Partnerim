import type { Metadata } from "next"
export const metadata: Metadata = { title: "Kullanıcılar" }

export default function KullanicilarPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Kullanıcılar</h1>
      <p className="mt-1 text-sm text-slate-500">Yakında aktif olacak.</p>
    </div>
  )
}
