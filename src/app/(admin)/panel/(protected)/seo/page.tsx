import type { Metadata } from "next"
import { getManagedPages, getRedirects, getNotFoundLogs, getBrokenLinkChecks } from "@/lib/actions/seo"
import { getSiteSettings, updateSiteSettings } from "@/lib/actions/settings"
import SeoManager from "@/components/admin/seo/SeoManager"

export const metadata: Metadata = { title: "SEO" }

export default async function SeoPage() {
  const [pages, redirects, notFoundLogs, brokenLinkChecks, settings] = await Promise.all([
    getManagedPages(),
    getRedirects(),
    getNotFoundLogs(),
    getBrokenLinkChecks(),
    getSiteSettings(),
  ])

  return (
    <SeoManager
      pages={pages}
      redirects={redirects}
      notFoundLogs={notFoundLogs}
      brokenLinkChecks={brokenLinkChecks}
      settings={settings}
      updateSettings={updateSiteSettings}
      unresolvedCount={notFoundLogs.filter((l) => !l.resolved).length}
    />
  )
}
