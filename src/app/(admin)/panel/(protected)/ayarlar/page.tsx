import { getSiteSettings, updateSiteSettings } from "@/lib/actions/settings"
import SettingsForm from "@/components/admin/editors/SettingsForm"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Ayarlar" }

export default async function AyarlarPage() {
  const settings = await getSiteSettings()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Site Ayarları</h1>
        <p className="mt-1 text-sm text-slate-500">Genel site bilgileri, iletişim ve sosyal medya.</p>
      </div>
      <SettingsForm initialSettings={settings} action={updateSiteSettings} />
    </div>
  )
}
