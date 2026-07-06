import Link from "next/link"
import { Building2 } from "lucide-react"
import { PRIORITY_META, SOURCE_META } from "@/lib/constants/crm"
import type { LeadCard } from "@/types/cms"

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")
}

export function AssigneeAvatar({ user, size = 24 }: { user: { name: string; avatar: string | null } | null; size?: number }) {
  if (!user) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full border border-dashed border-slate-300 text-[10px] text-slate-400"
        style={{ width: size, height: size }}
        title="Atanmamış"
      >
        —
      </div>
    )
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-[#3730A3] font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      title={user.name}
    >
      {initials(user.name)}
    </div>
  )
}

interface Props {
  lead: LeadCard
  inKanban?: boolean
}

export default function LeadCardMini({ lead, inKanban }: Props) {
  return (
    <Link
      href={`/panel/crm/${lead.id}`}
      draggable={false}
      className={`block rounded-xl border border-[#E4EAF5] bg-white p-3.5 shadow-sm transition-all hover:border-[#3730A3]/30 hover:shadow-md ${inKanban ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-sm font-semibold text-slate-800">{lead.name}</p>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_META[lead.priority].color}`}>
          {PRIORITY_META[lead.priority].label}
        </span>
      </div>

      {lead.company && (
        <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
          <Building2 size={11} className="shrink-0" />
          {lead.company}
        </p>
      )}

      {(lead.sector || lead.budget) && (
        <p className="mt-1.5 truncate text-xs text-slate-400">
          {[lead.sector, lead.budget].filter(Boolean).join(" · ")}
        </p>
      )}

      {lead.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {lead.tags.map((t) => (
            <span key={t.id} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${t.color}1A`, color: t.color }}>
              {t.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-[#F1F5F9] pt-2.5">
        <span className="text-[10.5px] font-medium text-slate-400">{SOURCE_META[lead.source].label}</span>
        <AssigneeAvatar user={lead.assignedTo} />
      </div>
    </Link>
  )
}
