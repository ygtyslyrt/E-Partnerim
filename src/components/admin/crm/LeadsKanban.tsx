"use client"

import { useState, useTransition } from "react"
import { updateLeadStatus } from "@/lib/actions/leads"
import LeadCardMini from "./LeadCardMini"
import type { LeadKanbanColumn, LeadStatusType } from "@/types/cms"

export default function LeadsKanban({ columns: initialColumns }: { columns: LeadKanbanColumn[] }) {
  const [columns, setColumns] = useState(initialColumns)
  const [dragOverStatus, setDragOverStatus] = useState<LeadStatusType | null>(null)
  const [, startTransition] = useTransition()

  function handleDrop(e: React.DragEvent, targetStatus: LeadStatusType) {
    e.preventDefault()
    setDragOverStatus(null)
    const draggedId = e.dataTransfer.getData("text/plain")
    if (!draggedId) return

    const sourceCol = columns.find((col) => col.leads.some((l) => l.id === draggedId))
    if (!sourceCol || sourceCol.status === targetStatus) return
    const moved = sourceCol.leads.find((l) => l.id === draggedId)!

    setColumns((prev) =>
      prev.map((col) => {
        if (col.status === sourceCol.status) return { ...col, leads: col.leads.filter((l) => l.id !== draggedId) }
        if (col.status === targetStatus) return { ...col, leads: [moved, ...col.leads] }
        return col
      })
    )

    startTransition(async () => {
      await updateLeadStatus(draggedId, targetStatus)
    })
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => (
        <div
          key={col.status}
          onDragOver={(e) => { e.preventDefault(); setDragOverStatus(col.status) }}
          onDragLeave={() => setDragOverStatus((s) => (s === col.status ? null : s))}
          onDrop={(e) => handleDrop(e, col.status)}
          className={`flex w-[280px] shrink-0 flex-col rounded-2xl border bg-[#F8FAFC] p-3 transition-colors ${
            dragOverStatus === col.status ? "border-[#3730A3] bg-[#EEF2FF]" : "border-[#E4EAF5]"
          }`}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: col.dot }} />
              <span className="text-sm font-semibold text-slate-700">{col.label}</span>
            </div>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
              {col.leads.length}
            </span>
          </div>

          <div className="flex min-h-[80px] flex-col gap-2">
            {col.leads.map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", lead.id)}
              >
                <LeadCardMini lead={lead} inKanban />
              </div>
            ))}
            {col.leads.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
                Lead yok
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
