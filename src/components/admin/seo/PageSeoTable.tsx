"use client"

import { useState } from "react"
import { Pencil, CheckCircle2, AlertTriangle } from "lucide-react"
import type { Page } from "@prisma/client"
import PageSeoModal from "./PageSeoModal"

export default function PageSeoTable({ initialPages }: { initialPages: Page[] }) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [editing, setEditing] = useState<Page | null>(null)

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
      {pages.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-slate-400">Yönetilebilir sayfa bulunamadı.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-slate-500">Sayfa</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Adres</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">SEO Başlığı</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Robots</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {pages.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-medium text-slate-800">{p.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.slug}</td>
                <td className="px-4 py-3">
                  {p.seoTitle ? (
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <CheckCircle2 size={13} className="text-[#00D084]" />
                      <span className="truncate max-w-xs">{p.seoTitle}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <AlertTriangle size={13} />
                      Tanımlanmadı
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                    p.robots.includes("noindex") ? "border-red-100 bg-red-50 text-red-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"
                  }`}>
                    {p.robots}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => setEditing(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title="SEO Düzenle">
                    <Pencil size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <PageSeoModal
        page={editing}
        onClose={() => setEditing(null)}
        onSaved={(updated) => setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
      />
    </div>
  )
}
