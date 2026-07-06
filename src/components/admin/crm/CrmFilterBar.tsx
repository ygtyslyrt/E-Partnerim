"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useRef, useState } from "react"
import { Search, List, LayoutGrid, X } from "lucide-react"
import { LEAD_STATUSES, PRIORITY_META, SOURCE_META } from "@/lib/constants/crm"
import type { AssignableUser } from "@/types/cms"

const SELECT = "rounded-xl border border-[#E4EAF5] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"

interface Props {
  users: AssignableUser[]
  view: "list" | "kanban"
}

export default function CrmFilterBar({ users, view }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("q") ?? "")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function updateParams(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(overrides)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateParams({ q: value || undefined }), 400)
  }

  const hasActiveFilters = ["status", "priority", "source", "assigned", "q"].some((k) => searchParams.get(k))

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4EAF5] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="İsim, e-posta, telefon, firma ara..."
            className={`${SELECT} w-full pl-9`}
          />
        </div>

        <select
          value={searchParams.get("status") ?? ""}
          onChange={(e) => updateParams({ status: e.target.value || undefined })}
          className={SELECT}
        >
          <option value="">Tüm Durumlar</option>
          {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select
          value={searchParams.get("priority") ?? ""}
          onChange={(e) => updateParams({ priority: e.target.value || undefined })}
          className={SELECT}
        >
          <option value="">Tüm Öncelikler</option>
          {Object.entries(PRIORITY_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
        </select>

        <select
          value={searchParams.get("source") ?? ""}
          onChange={(e) => updateParams({ source: e.target.value || undefined })}
          className={SELECT}
        >
          <option value="">Tüm Kaynaklar</option>
          {Object.entries(SOURCE_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
        </select>

        <select
          value={searchParams.get("assigned") ?? ""}
          onChange={(e) => updateParams({ assigned: e.target.value || undefined })}
          className={SELECT}
        >
          <option value="">Herkes</option>
          <option value="unassigned">Atanmamış</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => { setSearch(""); router.push(pathname) }}
            className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 transition"
          >
            <X size={14} />
            Temizle
          </button>
        )}
      </div>

      <div className="flex shrink-0 gap-1 rounded-xl bg-[#F3F4FB] p-1">
        <button
          type="button"
          onClick={() => updateParams({ view: undefined })}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${view === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
        >
          <List size={15} />
          Liste
        </button>
        <button
          type="button"
          onClick={() => updateParams({ view: "kanban" })}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${view === "kanban" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
        >
          <LayoutGrid size={15} />
          Pipeline
        </button>
      </div>
    </div>
  )
}
