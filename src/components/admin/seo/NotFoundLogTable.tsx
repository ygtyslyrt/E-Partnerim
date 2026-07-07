"use client"

import { useMemo, useState } from "react"
import { CheckCheck, Trash2, RotateCcw } from "lucide-react"
import type { NotFoundLog } from "@prisma/client"
import { resolveNotFoundLog, deleteNotFoundLog } from "@/lib/actions/seo"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"

export default function NotFoundLogTable({ initialLogs }: { initialLogs: NotFoundLog[] }) {
  const [logs, setLogs] = useState<NotFoundLog[]>(initialLogs)
  const [onlyUnresolved, setOnlyUnresolved] = useState(true)
  const [toast, setToast] = useState<ToastState | null>(null)

  const visible = useMemo(() => (onlyUnresolved ? logs.filter((l) => !l.resolved) : logs), [logs, onlyUnresolved])

  async function handleResolve(log: NotFoundLog) {
    setLogs((prev) => prev.map((l) => (l.id === log.id ? { ...l, resolved: !l.resolved } : l)))
    const result = await resolveNotFoundLog(log.id, !log.resolved)
    if (!result.success) {
      setLogs((prev) => prev.map((l) => (l.id === log.id ? { ...l, resolved: log.resolved } : l)))
      setToast({ message: result.error ?? "Durum güncellenemedi", type: "error" })
    }
  }

  async function handleDelete(id: string) {
    const removed = logs.find((l) => l.id === id)
    setLogs((prev) => prev.filter((l) => l.id !== id))
    const result = await deleteNotFoundLog(id)
    if (!result.success) {
      if (removed) setLogs((prev) => [...prev, removed])
      setToast({ message: result.error ?? "Kayıt silinemedi", type: "error" })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{logs.filter((l) => !l.resolved).length} çözülmemiş / {logs.length} toplam</p>
        <button
          type="button"
          onClick={() => setOnlyUnresolved((v) => !v)}
          className="rounded-xl border border-[#E4EAF5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          {onlyUnresolved ? "Tümünü Göster" : "Sadece Çözülmemişler"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
        {visible.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">Kayıt bulunamadı.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Adres</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Yönlendiren</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">İsabet</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Son Görülme</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Durum</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {visible.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{log.path}</td>
                  <td className="px-4 py-3 max-w-[220px] truncate text-xs text-slate-400">{log.referer ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{log.hitCount}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(log.lastSeen).toLocaleDateString("tr-TR")}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${log.resolved ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-amber-100 bg-amber-50 text-amber-700"}`}>
                      {log.resolved ? "Çözüldü" : "Açık"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleResolve(log)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                        title={log.resolved ? "Yeniden aç" : "Çözüldü işaretle"}
                      >
                        {log.resolved ? <RotateCcw size={14} /> : <CheckCheck size={14} />}
                      </button>
                      <button type="button" onClick={() => handleDelete(log.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition" title="Sil">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
