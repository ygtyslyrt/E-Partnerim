"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Link2, Palette, AlignLeft, Tag, MousePointerClick, Sparkles } from "lucide-react"
import FeatureEditor, { type FeatureItem } from "@/components/admin/shared/FeatureEditor"
import SeoPanel, { type SeoData } from "@/components/admin/shared/SeoPanel"
import PublishPanel from "@/components/admin/shared/PublishPanel"
import SolutionPreview from "@/components/admin/solutions/SolutionPreview"
import type { SolutionWithFeatures } from "@/lib/actions/solutions"
import type { ActionResult } from "@/types/cms"

const CATEGORIES = ["Danışmanlık", "Altyapı", "Pazarlama", "Hukuk", "Teknik", "Entegrasyon", "Diğer"]

const ICON_OPTIONS = [
  "MessageSquare", "Store", "ShieldCheck", "Megaphone", "Star", "Package",
  "Zap", "Target", "Globe", "Headphones", "BookOpen", "BarChart2",
  "Settings", "Users", "TrendingUp", "Award", "CheckCircle2", "Lightbulb",
  "Rocket", "HeartHandshake", "Briefcase", "Search", "Layout", "Code2",
]

interface SaveInput {
  title: string; slug: string; icon?: string | null; color?: string | null
  category?: string | null; shortDesc?: string | null; content?: string | null
  featured?: boolean; status?: string
  ctaLabel?: string | null; ctaUrl?: string | null; ctaLabel2?: string | null; ctaUrl2?: string | null
  ogImage?: string | null; seoTitle?: string | null; seoDesc?: string | null
  features?: { type: "ADVANTAGE" | "DISADVANTAGE"; text: string; order: number }[]
}

interface Props {
  initial?: SolutionWithFeatures
  onSave: (data: SaveInput) => Promise<ActionResult<{ slug: string }>>
  onDelete?: () => Promise<ActionResult>
}

function Section({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode
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

const INPUT = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const LABEL = "mb-1.5 block text-sm font-medium text-slate-700"

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-")
}

export default function SolutionForm({ initial, onSave, onDelete }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(initial?.title ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [icon, setIcon] = useState(initial?.icon ?? "")
  const [color, setColor] = useState(initial?.color ?? "#3730A3")
  const [category, setCategory] = useState(initial?.category ?? "")
  const [shortDesc, setShortDesc] = useState(initial?.shortDesc ?? "")
  const [content, setContent] = useState(initial?.content ?? "")
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

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!initial) setSlug(slugify(v))
  }

  const buildPayload = useCallback((): SaveInput => ({
    title, slug, icon: icon || null, color: color || null,
    category: category || null, shortDesc: shortDesc || null, content: content || null,
    featured, status,
    ctaLabel: ctaLabel || null, ctaUrl: ctaUrl || null,
    ctaLabel2: ctaLabel2 || null, ctaUrl2: ctaUrl2 || null,
    ogImage: seo.ogImage || null, seoTitle: seo.seoTitle || null, seoDesc: seo.seoDesc || null,
    features: features.map((f, i) => ({ type: f.type, text: f.text, order: i })),
  }), [title, slug, icon, color, category, shortDesc, content, featured, status,
      ctaLabel, ctaUrl, ctaLabel2, ctaUrl2, seo, features])

  function handleSave() {
    if (!title.trim() || !slug.trim()) { setError("Başlık ve slug zorunludur"); return }
    setError(null)
    startTransition(async () => {
      const result = await onSave(buildPayload())
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        if (!initial && result.data?.slug) router.push(`/panel/cozumler/${result.data.slug}`)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  function handleDelete() {
    if (!onDelete) return
    setError(null)
    startDeleteTransition(async () => {
      const result = await onDelete()
      if (result.success) {
        router.push("/panel/cozumler")
      } else {
        setError(result.error ?? "Silme hatası")
      }
    })
  }

  const previewData = { title, icon, color, category, shortDesc, ctaLabel, ctaLabel2, status, featured, features }

  return (
    <div className="flex gap-6">
      {/* ── Sol: form */}
      <div className="min-w-0 flex-1 space-y-5">
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <Section title="Temel Bilgiler" icon={Sparkles}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Çözüm Başlığı *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ör. İhtiyaç Analizi"
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
                    placeholder="ihtiyac-analizi"
                    className={`${INPUT} pl-7`}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className={LABEL}>Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={INPUT}>
                <option value="">Seçin...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
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
                placeholder="Çözüm hakkında 1-2 cümle..."
                className={`${INPUT} resize-none`}
              />
            </div>
          </div>
        </Section>

        <Section title="İkon & Renk" icon={Palette}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>İkon Adı (Lucide)</label>
                <select value={icon} onChange={(e) => setIcon(e.target.value)} className={INPUT}>
                  <option value="">Seçin...</option>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Tema Rengi</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-[#E4EAF5] p-1"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#3730A3"
                    className={`${INPUT} flex-1 font-mono`}
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Detaylı Açıklama" icon={AlignLeft}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={7}
            placeholder="Bu çözümün detayları, nasıl çalıştığı, müşteriye faydaları..."
            className={`${INPUT} resize-y`}
          />
        </Section>

        <Section title="Dahil Olanlar & Limitler" icon={Tag}>
          <FeatureEditor items={features} onChange={setFeatures} />
        </Section>

        <Section title="CTA Alanları" icon={MousePointerClick}>
          <div className="space-y-4">
            <div>
              <p className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Birincil CTA</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Buton Metni</label>
                  <input type="text" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="ör. Ücretsiz Danışmanlık Al" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Buton URL</label>
                  <input type="url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://wa.me/..." className={INPUT} />
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-wide">İkincil CTA</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Buton Metni</label>
                  <input type="text" value={ctaLabel2} onChange={(e) => setCtaLabel2(e.target.value)} placeholder="ör. Platformları İncele" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Buton URL</label>
                  <input type="url" value={ctaUrl2} onChange={(e) => setCtaUrl2(e.target.value)} placeholder="https://..." className={INPUT} />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="SEO" icon={Link2}>
          <SeoPanel data={seo} onChange={setSeo} defaultTitle={title} defaultDesc={shortDesc} />
        </Section>
      </div>

      {/* ── Sağ: sidebar */}
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
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Canlı Önizleme</p>
            <SolutionPreview data={previewData} />
          </div>
        </div>
      </div>
    </div>
  )
}
