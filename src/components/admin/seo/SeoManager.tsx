"use client"

import { useState } from "react"
import { FileText, Link2, SearchX, ScanSearch, Settings2 } from "lucide-react"
import type { Page, Redirect, NotFoundLog, BrokenLinkCheck } from "@prisma/client"
import type { ActionResult } from "@/types/cms"
import PageSeoTable from "./PageSeoTable"
import RedirectManager from "./RedirectManager"
import NotFoundLogTable from "./NotFoundLogTable"
import BrokenLinkReport from "./BrokenLinkReport"
import SeoSettingsForm from "./SeoSettingsForm"

interface Props {
  pages: Page[]
  redirects: Redirect[]
  notFoundLogs: NotFoundLog[]
  brokenLinkChecks: BrokenLinkCheck[]
  settings: Record<string, string>
  updateSettings: (data: Record<string, string>) => Promise<ActionResult>
  unresolvedCount: number
}

const TABS = [
  { id: "pages", label: "Sayfa SEO", icon: FileText },
  { id: "redirects", label: "Yönlendirmeler", icon: Link2 },
  { id: "404", label: "404 Kayıtları", icon: SearchX },
  { id: "broken-links", label: "Kırık Link Raporu", icon: ScanSearch },
  { id: "settings", label: "Genel Ayarlar", icon: Settings2 },
] as const

type TabId = (typeof TABS)[number]["id"]

export default function SeoManager({ pages, redirects, notFoundLogs, brokenLinkChecks, settings, updateSettings, unresolvedCount }: Props) {
  const [tab, setTab] = useState<TabId>("pages")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">SEO Yönetimi</h1>
        <p className="mt-1 text-sm text-slate-500">Sayfa SEO ayarları, yönlendirmeler, 404 takibi ve site geneli meta bilgileri.</p>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-[#E4EAF5]">
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                active ? "text-[#3730A3]" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <t.icon size={15} />
              {t.label}
              {t.id === "404" && unresolvedCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {unresolvedCount}
                </span>
              )}
              {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#3730A3]" />}
            </button>
          )
        })}
      </div>

      {tab === "pages" && <PageSeoTable initialPages={pages} />}
      {tab === "redirects" && <RedirectManager initialRedirects={redirects} />}
      {tab === "404" && <NotFoundLogTable initialLogs={notFoundLogs} />}
      {tab === "broken-links" && <BrokenLinkReport initialChecks={brokenLinkChecks} />}
      {tab === "settings" && <SeoSettingsForm initialSettings={settings} action={updateSettings} />}
    </div>
  )
}
