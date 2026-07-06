// CRM sabitleri — durum/öncelik/kaynak etiketleri ve renkleri
// "use server" dosyalarından import edilebilmesi için düz bir modül (server action değil)

import type { LeadStatusType, PriorityType, LeadSourceType, FormStatusType } from "@/types/cms"

export const LEAD_STATUSES: { value: LeadStatusType; label: string; color: string; dot: string }[] = [
  { value: "NEW", label: "Yeni", color: "bg-blue-50 text-blue-700 border-blue-100", dot: "#3B82F6" },
  { value: "CONTACTED", label: "İletişime Geçildi", color: "bg-indigo-50 text-indigo-700 border-indigo-100", dot: "#6366F1" },
  { value: "QUALIFIED", label: "Nitelikli", color: "bg-purple-50 text-purple-700 border-purple-100", dot: "#8B5CF6" },
  { value: "PROPOSAL", label: "Teklif Aşaması", color: "bg-amber-50 text-amber-700 border-amber-100", dot: "#F59E0B" },
  { value: "NEGOTIATION", label: "Görüşme Aşaması", color: "bg-orange-50 text-orange-700 border-orange-100", dot: "#F97316" },
  { value: "WON", label: "Kazanıldı", color: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "#10B981" },
  { value: "LOST", label: "Kaybedildi", color: "bg-red-50 text-red-700 border-red-100", dot: "#EF4444" },
  { value: "ON_HOLD", label: "Beklemede", color: "bg-slate-50 text-slate-500 border-slate-200", dot: "#94A3B8" },
]

export const PRIORITY_META: Record<PriorityType, { label: string; color: string }> = {
  LOW: { label: "Düşük", color: "bg-slate-50 text-slate-500 border-slate-200" },
  MEDIUM: { label: "Orta", color: "bg-blue-50 text-blue-700 border-blue-100" },
  HIGH: { label: "Yüksek", color: "bg-amber-50 text-amber-700 border-amber-100" },
  URGENT: { label: "Acil", color: "bg-red-50 text-red-700 border-red-100" },
}

export const SOURCE_META: Record<LeadSourceType, { label: string }> = {
  PARTNERIX: { label: "Partnerix" },
  CONTACT_FORM: { label: "İletişim Formu" },
  CONSULTING: { label: "Danışmanlık Formu" },
  MANUAL: { label: "Manuel" },
  REFERRAL: { label: "Referans" },
  SOCIAL: { label: "Sosyal Medya" },
  ORGANIC: { label: "Organik" },
  PARTNER_APPLICATION: { label: "İş Ortağı Başvurusu" },
}

export const FORM_STATUS_META: Record<FormStatusType, { label: string; color: string }> = {
  UNREAD: { label: "Okunmadı", color: "bg-blue-50 text-blue-700 border-blue-100" },
  READ: { label: "Okundu", color: "bg-slate-50 text-slate-500 border-slate-200" },
  REPLIED: { label: "Yanıtlandı", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  SPAM: { label: "Spam", color: "bg-red-50 text-red-700 border-red-100" },
}

export function leadStatusMeta(status: string) {
  return LEAD_STATUSES.find((s) => s.value === status) ?? LEAD_STATUSES[0]
}
