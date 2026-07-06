import { getSiteSettings } from "@/lib/actions/settings"

export async function GET() {
  const settings = await getSiteSettings()
  const custom = settings.seo_robots_txt?.trim()

  if (custom) {
    return new Response(custom, { headers: { "Content-Type": "text/plain" } })
  }

  const baseUrl = (settings.seo_canonical_url || settings.site_url || "https://e-partnerim.com").replace(/\/$/, "")
  const defaultContent = `User-agent: *
Allow: /
Disallow: /panel/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`

  return new Response(defaultContent, { headers: { "Content-Type": "text/plain" } })
}
