"use client"

import { useState, useCallback, useRef } from "react"
import { Reorder, useDragControls } from "framer-motion"
import Link from "next/link"
import { GripVertical, Pencil, Eye, EyeOff, Trash2, Star, ShieldCheck, PlusCircle, Inbox } from "lucide-react"
import type { Partner } from "@prisma/client"
import { reorderPartners, togglePartnerStatus, deletePartner } from "@/lib/actions/partners"

function PartnerRow({ partner, onToggle, onDelete }: {
  partner: Partner
  onToggle: () => void
  onDelete: () => void
}) {
  const controls = useDragControls()
  const [confirmDel, setConfirmDel] = useState(false)
  const published = partner.status === "PUBLISHED"

  return (
    <Reorder.Item
      value={partner}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 rounded-xl border border-[#E4EAF5] bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
    >
      <button type="button" onPointerDown={(e) => controls.start(e)} className="touch-none cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing">
        <GripVertical size={18} />
      </button>

      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[#E4EAF5] bg-slate-50 flex items-center justify-center">
        {partner.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.logo} alt={partner.name} className="h-full w-full object-contain p-1" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#3730A3] text-xs font-bold text-white">
            {partner.name[0]?.toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-slate-800">{partner.name}</span>
          {partner.featured && <Star size={13} className="shrink-0 fill-amber-400 text-amber-400" />}
          {partner.verified && <ShieldCheck size={13} className="shrink-0 text-[#00D084]" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {partner.category && <span className="text-xs text-slate-400">{partner.category}</span>}
          {partner.city && <span className="text-xs text-slate-400">· {partner.city}</span>}
        </div>
      </div>

      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
        {published ? "Yayında" : "Taslak"}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <Link href={`/panel/partnerler/${partner.slug}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title="Düzenle">
          <Pencil size={15} />
        </Link>
        <button type="button" onClick={onToggle} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title={published ? "Taslağa al" : "Yayınla"}>
          {published ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        {confirmDel ? (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => { onDelete(); setConfirmDel(false) }} className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition">Sil</button>
            <button type="button" onClick={() => setConfirmDel(false)} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">İptal</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDel(true)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition" title="Sil">
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </Reorder.Item>
  )
}

export default function PartnerList({ initialPartners, pendingCount = 0 }: { initialPartners: Partner[]; pendingCount?: number }) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleReorder = useCallback((reordered: Partner[]) => {
    setPartners(reordered)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      reorderPartners(reordered.map((p) => p.id))
    }, 800)
  }, [])

  async function handleToggle(partner: Partner) {
    setPartners((prev) => prev.map((p) => (p.id === partner.id ? { ...p, status: p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" } : p)))
    await togglePartnerStatus(partner.id, partner.status)
  }

  async function handleDelete(id: string) {
    setPartners((prev) => prev.filter((p) => p.id !== id))
    await deletePartner(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Partnerler</h1>
          <p className="mt-1 text-sm text-slate-500">{partners.length} iş ortağı · Sürükleyerek sıralayın</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/panel/partnerler/basvurular" className="relative flex items-center gap-2 rounded-xl border border-[#E4EAF5] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            <Inbox size={16} />
            Başvurular
            {pendingCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">{pendingCount}</span>
            )}
          </Link>
          <Link href="/panel/partnerler/yeni" className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] transition">
            <PlusCircle size={16} />
            Yeni Partner
          </Link>
        </div>
      </div>

      {partners.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#E4EAF5] py-20 text-center">
          <p className="text-sm text-slate-400">Henüz iş ortağı eklenmedi.</p>
          <Link href="/panel/partnerler/yeni" className="text-sm font-medium text-[#3730A3] hover:underline">İlk partneri ekle</Link>
        </div>
      ) : (
        <Reorder.Group axis="y" values={partners} onReorder={handleReorder} className="space-y-2">
          {partners.map((partner) => (
            <PartnerRow key={partner.id} partner={partner} onToggle={() => handleToggle(partner)} onDelete={() => handleDelete(partner.id)} />
          ))}
        </Reorder.Group>
      )}
    </div>
  )
}
