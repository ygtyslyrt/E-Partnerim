"use client"

import { useState, useTransition } from "react"
import { Plus, Trash2, Loader2, Clock, AlertTriangle } from "lucide-react"
import { createLeadTask, toggleLeadTask, deleteLeadTask } from "@/lib/actions/leads"
import type { LeadTaskView, AssignableUser } from "@/types/cms"

const INPUT = "rounded-lg border border-[#E4EAF5] bg-white px-3 py-2 text-sm outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"

function isOverdue(task: LeadTaskView) {
  return !task.completed && task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString())
}

function fmtDue(d: Date | string) {
  return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" })
}

export default function LeadTasksPanel({
  leadId, initialTasks, users,
}: {
  leadId: string
  initialTasks: LeadTaskView[]
  users: AssignableUser[]
}) {
  const [tasks, setTasks] = useState(initialTasks)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [assignedToId, setAssignedToId] = useState("")
  const [isPending, startTransition] = useTransition()

  const open = tasks.filter((t) => !t.completed)
  const done = tasks.filter((t) => t.completed)

  function handleToggle(task: LeadTaskView) {
    const completed = !task.completed
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed, completedAt: completed ? new Date() : null } : t)))
    startTransition(async () => { await toggleLeadTask(task.id, leadId, completed) })
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    startTransition(async () => { await deleteLeadTask(id, leadId) })
  }

  function handleCreate() {
    if (!title.trim()) return
    const assignedTo = users.find((u) => u.id === assignedToId) ?? null
    startTransition(async () => {
      const result = await createLeadTask(leadId, {
        title, dueDate: dueDate || undefined, assignedToId: assignedToId || undefined,
      })
      if (result.success && result.data) {
        const taskId = result.data.id
        setTasks((prev) => [
          {
            id: taskId, title, description: null,
            dueDate: dueDate ? new Date(dueDate) : null, completed: false, completedAt: null,
            createdAt: new Date(), assignedTo,
          },
          ...prev,
        ])
        setTitle(""); setDueDate(""); setAssignedToId(""); setShowForm(false)
      }
    })
  }

  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Görevler & Hatırlatmalar</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#3730A3] hover:bg-[#EEF2FF] transition"
        >
          <Plus size={14} />
          Ekle
        </button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl bg-[#F8FAFC] p-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Görev başlığı..." className={`${INPUT} w-full`} />
          <div className="flex gap-2">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`${INPUT} flex-1`} />
            <select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} className={`${INPUT} flex-1`}>
              <option value="">Atanmamış</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={isPending || !title.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-[#3730A3] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#312E8A] transition disabled:opacity-50"
          >
            {isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Oluştur
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        {open.length === 0 && done.length === 0 && <p className="text-sm text-slate-400">Görev yok.</p>}
        {open.map((task) => {
          const overdue = isOverdue(task)
          return (
            <div key={task.id} className={`flex items-start gap-2.5 rounded-xl border p-2.5 ${overdue ? "border-red-100 bg-red-50/50" : "border-transparent hover:bg-[#F8FAFC]"}`}>
              <input type="checkbox" checked={false} onChange={() => handleToggle(task)} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#3730A3]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700">{task.title}</p>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                  {task.dueDate && (
                    <span className={`flex items-center gap-1 ${overdue ? "font-semibold text-red-500" : ""}`}>
                      {overdue ? <AlertTriangle size={11} /> : <Clock size={11} />}
                      {fmtDue(task.dueDate)}
                    </span>
                  )}
                  {task.assignedTo && <span>{task.assignedTo.name}</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(task.id)} className="shrink-0 rounded-lg p-1 text-slate-300 hover:bg-red-50 hover:text-red-500 transition">
                <Trash2 size={13} />
              </button>
            </div>
          )
        })}
        {done.length > 0 && (
          <div className="mt-2 space-y-1.5 border-t border-[#F1F5F9] pt-2">
            {done.map((task) => (
              <div key={task.id} className="flex items-start gap-2.5 rounded-xl p-2.5 opacity-50">
                <input type="checkbox" checked onChange={() => handleToggle(task)} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#3730A3]" />
                <p className="flex-1 text-sm text-slate-500 line-through">{task.title}</p>
                <button onClick={() => handleDelete(task.id)} className="shrink-0 rounded-lg p-1 text-slate-300 hover:bg-red-50 hover:text-red-500 transition">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
