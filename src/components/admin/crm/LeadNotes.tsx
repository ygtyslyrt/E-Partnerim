"use client"

import { useState, useTransition } from "react"
import { Send, Trash2, Loader2 } from "lucide-react"
import { addLeadNote, deleteLeadNote } from "@/lib/actions/leads"
import { AssigneeAvatar } from "./LeadCardMini"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"
import type { LeadNoteView } from "@/types/cms"

function fmt(d: Date | string) {
  return new Date(d).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
}

export default function LeadNotes({
  leadId, initialNotes, currentUserId, isAdmin,
}: {
  leadId: string
  initialNotes: LeadNoteView[]
  currentUserId: string
  isAdmin: boolean
}) {
  const [notes, setNotes] = useState(initialNotes)
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<ToastState | null>(null)

  function handleAdd() {
    if (!content.trim()) return
    const text = content.trim()
    setContent("")
    startTransition(async () => {
      const result = await addLeadNote(leadId, text)
      if (result.success && result.data) {
        const noteId = result.data.id
        setNotes((prev) => [
          { id: noteId, content: text, createdAt: new Date(), author: { id: currentUserId, name: "Siz", avatar: null } },
          ...prev,
        ])
      } else {
        setContent(text)
        setToast({ message: result.error ?? "Not eklenemedi", type: "error" })
      }
    })
  }

  function handleDelete(id: string) {
    const removed = notes.find((n) => n.id === id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
    startTransition(async () => {
      const result = await deleteLeadNote(id, leadId)
      if (!result.success) {
        if (removed) setNotes((prev) => [removed, ...prev])
        setToast({ message: result.error ?? "Not silinemedi", type: "error" })
      }
    })
  }

  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Notlar</h2>

      <div className="mb-4 flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          placeholder="Bir not ekleyin..."
          className="flex-1 resize-none rounded-xl border border-[#E4EAF5] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
        />
        <button
          onClick={handleAdd}
          disabled={isPending || !content.trim()}
          className="flex h-fit shrink-0 items-center justify-center rounded-xl bg-[#3730A3] p-2.5 text-white hover:bg-[#312E8A] transition disabled:opacity-40"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>

      <div className="space-y-3">
        {notes.length === 0 && <p className="text-sm text-slate-400">Henüz not eklenmedi.</p>}
        {notes.map((note) => (
          <div key={note.id} className="flex items-start gap-2.5 rounded-xl bg-[#F8FAFC] p-3">
            <AssigneeAvatar user={note.author} size={26} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700">{note.author.name}</span>
                <span className="text-[10.5px] text-slate-400">{fmt(note.createdAt)}</span>
              </div>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-600">{note.content}</p>
            </div>
            {(isAdmin || note.author.id === currentUserId) && (
              <button onClick={() => handleDelete(note.id)} className="shrink-0 rounded-lg p-1 text-slate-300 hover:bg-red-50 hover:text-red-500 transition">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
