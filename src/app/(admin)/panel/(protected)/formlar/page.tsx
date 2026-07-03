import { getContactForms, getConsultingForms } from "@/lib/actions/forms"
import { markFormRead } from "@/lib/actions/forms"
import { Mail, Building2, CheckCheck } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Formlar" }

const STATUS: Record<string, string> = {
  UNREAD:  "bg-blue-50 text-blue-700 border-blue-100",
  READ:    "bg-slate-50 text-slate-500 border-slate-200",
  REPLIED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  SPAM:    "bg-red-50 text-red-700 border-red-100",
}

const STATUS_LABEL: Record<string, string> = {
  UNREAD: "Okunmadı", READ: "Okundu", REPLIED: "Yanıtlandı", SPAM: "Spam",
}

export default async function FormlarPage() {
  const [{ data: contacts }, { data: consulting }] = await Promise.all([
    getContactForms(),
    getConsultingForms(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Formlar</h1>
        <p className="mt-1 text-sm text-slate-500">
          {contacts.filter(f => f.status === "UNREAD").length} okunmamış iletişim,{" "}
          {consulting.filter(f => f.status === "UNREAD").length} okunmamış danışmanlık talebi
        </p>
      </div>

      {/* İletişim Formları */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Mail size={16} className="text-slate-400" />
          <h2 className="font-semibold text-slate-700">İletişim Formları ({contacts.length})</h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
          {contacts.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-slate-400">Henüz form yok.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Ad</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">E-posta</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Mesaj</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Durum</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Tarih</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {contacts.map((f) => (
                  <tr key={f.id} className={`transition-colors hover:bg-[#F8FAFC] ${f.status === "UNREAD" ? "bg-blue-50/30" : ""}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">{f.name}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${f.email}`} className="text-[#3730A3] hover:underline">{f.email}</a>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate text-slate-600">{f.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS[f.status]}`}>
                        {STATUS_LABEL[f.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(f.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      {f.status === "UNREAD" && (
                        <form action={async () => { "use server"; await markFormRead("contact", f.id) }}>
                          <button type="submit" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title="Okundu işaretle">
                            <CheckCheck size={15} />
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Danışmanlık Talepleri */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Building2 size={16} className="text-slate-400" />
          <h2 className="font-semibold text-slate-700">Danışmanlık Talepleri ({consulting.length})</h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
          {consulting.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-slate-400">Henüz talep yok.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Ad / Şirket</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">E-posta</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Bütçe</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Durum</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Tarih</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {consulting.map((f) => (
                  <tr key={f.id} className={`transition-colors hover:bg-[#F8FAFC] ${f.status === "UNREAD" ? "bg-blue-50/30" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{f.name}</p>
                      {f.company && <p className="text-xs text-slate-400">{f.company}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${f.email}`} className="text-[#3730A3] hover:underline">{f.email}</a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{f.budget ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS[f.status]}`}>
                        {STATUS_LABEL[f.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(f.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      {f.status === "UNREAD" && (
                        <form action={async () => { "use server"; await markFormRead("consulting", f.id) }}>
                          <button type="submit" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title="Okundu işaretle">
                            <CheckCheck size={15} />
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
