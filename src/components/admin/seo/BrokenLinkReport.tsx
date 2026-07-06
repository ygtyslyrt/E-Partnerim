"use client"

import { useState, useTransition } from "react"
import { ScanSearch, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react"
import type { BrokenLinkCheck } from "@prisma/client"
import { runBrokenLinkScan, deleteBrokenLinkChecks } from "@/lib/actions/seo"

export default function BrokenLinkReport({ initialChecks }: { initialChecks: BrokenLinkCheck[] }) {
  const [checks, setChecks] = useState<BrokenLinkCheck[]>(initialChecks)
  const [isScanning, startScan] = useTransition()
  const [isClearing, startClear] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<{ pagesScanned: number; linksChecked: number; broken: number } | null>(null)

  function handleScan() {
    setError(null)
    startScan(async () => {
      const result = await runBrokenLinkScan()
      if (result.success) {
        setSummary(result.data ?? null)
        window.location.reload()
      } else {
        setError(result.error ?? "Tarama başarısız")
      }
    })
  }

  function handleClear() {
    setChecks([])
    startClear(() => { deleteBrokenLinkChecks() })
  }

  const brokenCount = checks.filter((c) => !c.ok).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {checks.length > 0 ? `${brokenCount} kırık link / ${checks.length} kontrol edildi` : "Henüz tarama yapılmadı"}
        </p>
        <div className="flex items-center gap-2">
          {checks.length > 0 && (
            <button type="button" onClick={handleClear} disabled={isClearing} className="flex items-center gap-1.5 rounded-xl border border-[#E4EAF5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 transition">
              <Trash2 size={14} />
              Raporu Temizle
            </button>
          )}
          <button type="button" onClick={handleScan} disabled={isScanning} className="flex items-center gap-1.5 rounded-xl bg-[#3730A3] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition">
            {isScanning ? <Loader2 size={14} className="animate-spin" /> : <ScanSearch size={14} />}
            {isScanning ? "Taranıyor..." : "Taramayı Başlat"}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {summary && (
        <div className="rounded-lg border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-3 text-sm text-slate-600">
          {summary.pagesScanned} sayfa tarandı, {summary.linksChecked} link kontrol edildi, {summary.broken} kırık link bulundu.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
        {checks.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">
            Site içi bağlantıları kontrol etmek için taramayı başlatın.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Kaynak Sayfa</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Hedef Link</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Durum Kodu</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Sonuç</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {checks.map((c) => (
                <tr key={c.id} className={`transition-colors hover:bg-[#F8FAFC] ${!c.ok ? "bg-red-50/30" : ""}`}>
                  <td className="px-4 py-3 text-slate-700">{c.sourceLabel}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.targetUrl}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.statusCode ?? "—"}</td>
                  <td className="px-4 py-3">
                    {c.ok ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700"><CheckCircle2 size={13} /> Çalışıyor</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-red-600"><XCircle size={13} /> Kırık</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
