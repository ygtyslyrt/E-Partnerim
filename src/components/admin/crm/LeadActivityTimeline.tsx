import {
  PlusCircle, ArrowRightLeft, MessageSquare, Mail, Phone,
  CalendarDays, FileText, Bot, UserCheck, ClipboardList, CheckCircle2, History,
} from "lucide-react"
import type { LeadActivityView, ActivityTypeType } from "@/types/cms"

const ACTIVITY_ICON: Record<ActivityTypeType, React.ElementType> = {
  CREATED: PlusCircle,
  STATUS_CHANGED: ArrowRightLeft,
  NOTE_ADDED: MessageSquare,
  EMAIL_SENT: Mail,
  CALL_MADE: Phone,
  MEETING_SCHEDULED: CalendarDays,
  FORM_SUBMITTED: FileText,
  PARTNERIX_COMPLETED: Bot,
  ASSIGNED: UserCheck,
  TASK_CREATED: ClipboardList,
  TASK_COMPLETED: CheckCircle2,
}

function fmt(d: Date | string) {
  return new Date(d).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
}

export default function LeadActivityTimeline({ activities }: { activities: LeadActivityView[] }) {
  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Aktivite Geçmişi</h2>

      {activities.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <History size={16} />
          Henüz aktivite yok.
        </div>
      ) : (
        <ol className="space-y-4">
          {activities.map((a, i) => {
            const Icon = ACTIVITY_ICON[a.type] ?? History
            return (
              <li key={a.id} className="relative flex gap-3 pl-1">
                {i < activities.length - 1 && (
                  <span className="absolute left-[15px] top-7 h-full w-px bg-[#F1F5F9]" />
                )}
                <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3730A3]">
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <p className="text-sm font-medium text-slate-700">{a.title}</p>
                  {a.detail && <p className="text-xs text-slate-500">{a.detail}</p>}
                  <p className="mt-0.5 text-[10.5px] text-slate-400">{fmt(a.createdAt)}</p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
