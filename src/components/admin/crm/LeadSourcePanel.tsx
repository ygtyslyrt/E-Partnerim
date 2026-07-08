import { Mail, MessageSquareText, Bot } from "lucide-react"
import type { LeadDetail } from "@/types/cms"
import { calculatePartnerixLeadScore } from "@/lib/constants/crm"

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function LeadSourcePanel({ lead }: { lead: LeadDetail }) {
  const hasAny = lead.contactForms.length || lead.consultingForms.length || lead.partnerixForms.length
  if (!hasAny) return null

  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-slate-700">Kaynak Gönderimler</h2>
      <div className="space-y-2.5">
        {lead.contactForms.map((f) => (
          <div key={f.id} className="rounded-xl bg-[#F8FAFC] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Mail size={12} />
              İletişim Formu · {fmt(f.createdAt)}
            </div>
            <p className="text-xs text-slate-500">{f.message}</p>
          </div>
        ))}
        {lead.consultingForms.map((f) => (
          <div key={f.id} className="rounded-xl bg-[#F8FAFC] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <MessageSquareText size={12} />
              Danışmanlık Talebi · {fmt(f.createdAt)}
            </div>
            {f.message && <p className="text-xs text-slate-500">{f.message}</p>}
          </div>
        ))}
        {lead.partnerixForms.map((f) => {
          const leadScore = calculatePartnerixLeadScore({ timeline: f.timeline, currentStatus: f.platform, goal: f.support })
          return (
            <div key={f.id} className="rounded-xl bg-[#F8FAFC] p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Bot size={12} />
                  Partnerix Sohbeti · {fmt(f.createdAt)}
                </div>
                {leadScore && (
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${leadScore.color}`}>
                    {leadScore.emoji} {leadScore.tier} · {leadScore.score}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{[f.sector, f.support, f.platform, f.timeline].filter(Boolean).join(" · ")}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
