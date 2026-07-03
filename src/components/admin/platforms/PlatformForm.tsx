"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Link2, Palette, Globe, Tag, AlignLeft, Sparkles, MousePointerClick } from "lucide-react"
import FeatureEditor, { type FeatureItem } from "@/components/admin/shared/FeatureEditor"
import SeoPanel, { type SeoData } from "@/components/admin/shared/SeoPanel"
import PublishPanel from "@/components/admin/shared/PublishPanel"
import ImageUploader from "@/components/admin/shared/ImageUploader"
import PlatformPreview from "@/components/admin/platforms/PlatformPreview"
import type { PlatformWithFeatures } from "@/lib/actions/platforms"
import type { ActionResult } from "@/types/cms"

const CATEGORIES = ["E-Ticaret", "Pazarlama", "Ödeme", "Muhasebe", "CRM", "ERP", "SEO", "Sosyal Medya", "Analitik", "Destek", "Diğer"]
const PRICING_OPTIONS = ["Ücretsiz", "Freemium", "Abonelik", "Kullanım Başına", "Kurumsal", "Tek Seferlik Lisans"]


interface SaveInput {
  name: string; slug: string; url?: string | null; category?: string | null
  shortDesc?: string | null; description?: string | null; logo?: string | null
  logoColor?: string | null; pricing?: string | null; featured?: boolean; status?: string
  ctaLabel?: string | null; ctaUrl?: string | null; ctaLabel2?: string | null; ctaUrl2?: string | null
  ogImage?: string | null; seoTitle?: string | null; seoDesc?: string | null
  features?: { type: "ADVANTAGE" | "DISADVANTAGE"; text: string; order: number }[]
}

interface Props {
  initial?: PlatformWithFeatures
  onSave: (data: SaveInput) => Promise<ActionResult<{ slug: string }>>
  onDelete?: () => Promise<ActionResult>
}

function Section({ title, icon: Icon, children }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[#E4EAF5] bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
          <Icon size={15} className="text-[#4F46E5]" />
        </div>
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      {children}
    </section>
  )
}

const INPUT =
  "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const LABEL = "mb-1.5 block text-sm font-medium text-slate-700"

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-")
}

export default function PlatformForm({ initial, onSave, onDelete }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initial?.name ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [url, setUrl] = useState(initial?.url ?? "")
  const [category, setCategory] = useState(initial?.category ?? "")
  const [shortDesc, setShortDesc] = useState(initial?.shortDesc ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [logo, setLogo] = useState(initial?.logo ?? "")
  const [logoColor, setLogoColor] = useState(initial?.logoColor ?? "#3730A3")
  const [pricing, setPricing] = useState(initial?.pricing ?? "")
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [status, setStatus] = useState<string>(initial?.status ?? "DRAFT")
  const [ctaLabel, setCtaLabel] = useState(initial?.ctaLabel ?? "")
  const [ctaUrl, setCtaUrl] = useState(initial?.ctaUrl ?? "")
  const [ctaLabel2, setCtaLabel2] = useState(initial?.ctaLabel2 ?? "")
  const [ctaUrl2, setCtaUrl2] = useState(initial?.ctaUrl2 ?? "")
  const [seo, setSeo] = useState<SeoData>({
    seoTitle: initial?.seoTitle ?? "",
    seoDesc: initial?.seoDesc ?? "",
    ogImage: initial?.ogImage ?? "",
  })
  const [features, setFeatures] = useState<FeatureItem[]>(
    initial?.features.map((f, i) => ({ _key: `f${i}`, type: f.type, text: f.text })) ?? []
  )

  function handleNameChange(v: string) {
    setName(v)
    if (!initial) setSlug(slugify(v))
  }

  const buildPayload = useCallback((): SaveInput => ({
    name, slug, url: url || null, category: category || null,
    shortDesc: shortDesc || null, description: description || null,
    logo: logo || null, logoColor: logoColor || null, pricing: pricing || null,
    featured, status,
    ctaLabel: ctaLabel || null, ctaUrl: ctaUrl || null,
    ctaLabel2: ctaLabel2 || null, ctaUrl2: ctaUrl2 || null,
    ogImage: seo.ogImage || null, seoTitle: seo.seoTitle || null, seoDesc: seo.seoDesc || null,
    features: features.map((f, i) => ({ type: f.type, text: f.text, order: i })),
  }), [name, slug, url, category, shortDesc, description, logo, logoColor, pricing,
      featured, status, ctaLabel, ctaUrl, ctaLabel2, ctaUrl2, seo, features])

  function handleSave() {
    if (!name.trim() || !slug.trim()) {
      setError("Ad ve slug zorunludur")
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await onSave(buildPayload())
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        if (!initial && result.data?.slug) {
          router.push(`/panel/platformlar/${result.data.slug}`)
        }
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  function handleDelete() {
    if (!onDelete) return
    startDeleteTransition(async () => {
      await onDelete()
      router.push("/panel/platformlar")
    })
  }

  const previewData = { name, logo, logoColor, category, shortDesc, pricing, ctaLabel, ctaLabel2, status, featured, features }

  return (
    <div className="flex gap-6">
      {/* ── Sol: form ─────────────────────────────────────── */}
      <div className="min-w-0 flex-1 space-y-5">
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Temel Bilgiler */}
        <Section title="Temel Bilgiler" icon={Sparkles}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Platform Adı *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="ör. Shopify"
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Slug *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    placeholder="shopify"
                    className={`${INPUT} pl-7`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={INPUT}
                >
                  <option value="">Seçin...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Fiyatlandırma</label>
                <select
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                  className={INPUT}
                >
                  <option value="">Seçin...</option>
                  {PRICING_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={LABEL}>
                <span>Kısa Açıklama</span>
                <span className={`ml-auto float-right text-xs ${shortDesc.length > 200 ? "text-red-500" : "text-slate-400"}`}>
                  {shortDesc.length}/200
                </span>
              </label>
              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                rows={2}
                placeholder="Platform hakkında 1-2 cümle..."
                className={`${INPUT} resize-none`}
              />
            </div>
          </div>
        </Section>

        {/* Logo & Marka */}
        <Section title="Logo & Marka" icon={Palette}>
          <div className="space-y-4">
            <ImageUploader
              value={logo}
              onChange={setLogo}
              path="platforms/logos"
              maxWidth={400}
              label="Logo"
              hint="Logo beyaz arka planlı PNG/WebP olarak önerilir"
            />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className={LABEL}>Marka Rengi</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={logoColor}
                    onChange={(e) => setLogoColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-[#E4EAF5] p-1"
                  />
                  <input
                    type="text"
                    value={logoColor}
                    onChange={(e) => setLogoColor(e.target.value)}
                    placeholder="#3730A3"
                    className={`${INPUT} flex-1 font-mono`}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className={LABEL}>Platform URL</label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://shopify.com"
                    className={`${INPUT} pl-9`}
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Açıklama */}
        <Section title="Detaylı Açıklama" icon={AlignLeft}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={7}
            placeholder="Platform hakkında detaylı bilgi, kullanım alanları, öne çıkan özellikler..."
            className={`${INPUT} resize-y`}
          />
          <p className="mt-1.5 text-xs text-slate-400">Rich text editörü yakında eklenecek</p>
        </Section>

        {/* Avantaj & Dezavantaj */}
        <Section title="Avantajlar & Dezavantajlar" icon={Tag}>
          <FeatureEditor items={features} onChange={setFeatures} />
        </Section>

        {/* CTA */}
        <Section title="CTA Alanları" icon={MousePointerClick}>
          <div className="space-y-4">
            <div>
              <p className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Birincil CTA</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Buton Metni</label>
                  <input type="text" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="ör. Ücretsiz Dene" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Buton URL</label>
                  <input type="url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://..." className={INPUT} />
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-wide">İkincil CTA</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Buton Metni</label>
                  <input type="text" value={ctaLabel2} onChange={(e) => setCtaLabel2(e.target.value)} placeholder="ör. Detaylar" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Buton URL</label>
                  <input type="url" value={ctaUrl2} onChange={(e) => setCtaUrl2(e.target.value)} placeholder="https://..." className={INPUT} />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* SEO */}
        <Section title="SEO" icon={Link2}>
          <SeoPanel data={seo} onChange={setSeo} defaultTitle={name} defaultDesc={shortDesc} />
        </Section>
      </div>

      {/* ── Sağ: sidebar ──────────────────────────────────── */}
      <div className="w-72 shrink-0">
        <div className="sticky top-8 space-y-4">
          <PublishPanel
            status={status}
            featured={featured}
            isSaving={isPending}
            saved={saved}
            isDeleting={isDeleting}
            onStatusChange={setStatus}
            onFeaturedChange={setFeatured}
            onSave={handleSave}
            onDelete={onDelete ? handleDelete : undefined}
          />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Canlı Önizleme
            </p>
            <PlatformPreview data={previewData} />
          </div>
        </div>
      </div>
    </div>
  )
}
