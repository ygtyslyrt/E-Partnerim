"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Link2, Image as ImageIcon, Globe, Package, Star, AlignLeft, Sparkles, Layers, ShieldCheck } from "lucide-react"
import MediaPickerButton from "@/components/admin/media/MediaPickerButton"
import ListItemEditor from "@/components/admin/shared/ListItemEditor"
import SeoPanel, { type SeoData } from "@/components/admin/shared/SeoPanel"
import PublishPanel from "@/components/admin/shared/PublishPanel"
import type { PartnerWithRelations, PartnerInput } from "@/lib/actions/partners"
import type { ActionResult } from "@/types/cms"

const CATEGORIES = ["Ajans", "Danışmanlık Firması", "Freelancer", "Yazılım Firması", "Diğer"]

interface PackageState { _key: string; name: string; description: string; price: string; featuresText: string }
interface ReferenceState { _key: string; id?: string; name: string; role: string; company: string; content: string; avatar: string; rating: string }
interface MediaState { _key: string; id?: string; url: string; caption: string }

interface Props {
  initial?: PartnerWithRelations
  allPlatforms: { id: string; name: string }[]
  allSolutions: { id: string; title: string }[]
  onSave: (data: PartnerInput) => Promise<ActionResult<{ slug: string }>>
  onDelete?: () => Promise<ActionResult>
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
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
const SMALL_INPUT = "w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] transition"

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-")
}

export default function PartnerForm({ initial, allPlatforms, allSolutions, onSave, onDelete }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initial?.name ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [tagline, setTagline] = useState(initial?.tagline ?? "")
  const [shortDesc, setShortDesc] = useState(initial?.shortDesc ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [logo, setLogo] = useState(initial?.logo ?? "")
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "")
  const [website, setWebsite] = useState(initial?.website ?? "")
  const [email, setEmail] = useState(initial?.email ?? "")
  const [phone, setPhone] = useState(initial?.phone ?? "")
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "")
  const [city, setCity] = useState(initial?.city ?? "")
  const [category, setCategory] = useState(initial?.category ?? "")
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [verified, setVerified] = useState(initial?.verified ?? false)
  const [status, setStatus] = useState<string>(initial?.status ?? "DRAFT")
  const [seo, setSeo] = useState<SeoData>({
    seoTitle: initial?.seoTitle ?? "",
    seoDesc: initial?.seoDesc ?? "",
    ogImage: initial?.ogImage ?? "",
  })
  const [platformIds, setPlatformIds] = useState<string[]>(initial?.platforms.map((p) => p.platformId) ?? [])
  const [solutionIds, setSolutionIds] = useState<string[]>(initial?.solutions.map((s) => s.solutionId) ?? [])

  const [packages, setPackages] = useState<PackageState[]>(
    (initial?.packages ?? []).map((p) => ({
      _key: p.id, name: p.name, description: p.description ?? "", price: p.price ?? "",
      featuresText: Array.isArray(p.features) ? (p.features as string[]).join("\n") : "",
    }))
  )
  const [references, setReferences] = useState<ReferenceState[]>(
    (initial?.references ?? []).map((r) => ({
      _key: r.id, id: r.id, name: r.name, role: r.role ?? "", company: r.company ?? "",
      content: r.content, avatar: r.avatar ?? "", rating: r.rating?.toString() ?? "",
    }))
  )
  const [media, setMedia] = useState<MediaState[]>(
    (initial?.media ?? []).map((m) => ({ _key: m.id, id: m.id, url: m.url, caption: m.caption ?? "" }))
  )

  function handleNameChange(v: string) {
    setName(v)
    if (!initial) setSlug(slugify(v))
  }

  function toggleId(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  const buildPayload = useCallback((): PartnerInput => ({
    name, slug, tagline: tagline || null, shortDesc: shortDesc || null, description: description || null,
    logo: logo || null, coverImage: coverImage || null, website: website || null, email: email || null,
    phone: phone || null, whatsapp: whatsapp || null, city: city || null, category: category || null,
    featured, verified, status,
    seoTitle: seo.seoTitle || null, seoDesc: seo.seoDesc || null, ogImage: seo.ogImage || null,
    packages: packages.map((p) => ({
      name: p.name, description: p.description || null, price: p.price || null,
      features: p.featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
    })),
    references: references.map((r) => ({
      id: r.id, name: r.name, role: r.role || null, company: r.company || null,
      content: r.content, avatar: r.avatar || null, rating: r.rating ? Number(r.rating) : null,
    })),
    media: media.map((m) => ({ id: m.id, url: m.url, caption: m.caption || null })),
    platformIds, solutionIds,
  }), [name, slug, tagline, shortDesc, description, logo, coverImage, website, email, phone, whatsapp,
      city, category, featured, verified, status, seo, packages, references, media, platformIds, solutionIds])

  function handleSave() {
    if (!name.trim() || !slug.trim()) { setError("Ad ve slug zorunludur"); return }
    setError(null)
    startTransition(async () => {
      const result = await onSave(buildPayload())
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        if (!initial && result.data?.slug) router.push(`/panel/partnerler/${result.data.slug}`)
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
        router.push("/panel/partnerler")
      } else {
        setError(result.error ?? "Silme hatası")
      }
    })
  }

  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-5">
        {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <Section title="Temel Bilgiler" icon={Sparkles}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Firma Adı *</label>
                <input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="ör. Dijital Ajans A.Ş." className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Slug *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">/</span>
                  <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className={`${INPUT} pl-7`} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={INPUT}>
                  <option value="">Seçin...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Şehir</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="İstanbul" className={INPUT} />
              </div>
            </div>
            <div>
              <label className={LABEL}>Slogan</label>
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="ör. E-ticaretinizi büyütüyoruz" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Kısa Açıklama</label>
              <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={2} className={`${INPUT} resize-none`} />
            </div>
          </div>
        </Section>

        <Section title="Logo & Kapak Görseli" icon={ImageIcon}>
          <div className="grid grid-cols-2 gap-4">
            <MediaPickerButton value={logo} onChange={setLogo} label="Logo" hint="Kare, beyaz arka planlı görsel önerilir" />
            <MediaPickerButton value={coverImage} onChange={setCoverImage} label="Kapak Görseli" hint="Profil sayfasının üst banner'ı" />
          </div>
        </Section>

        <Section title="İletişim" icon={Globe}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Web Sitesi</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>E-posta</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Telefon</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>WhatsApp</label>
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="905xxxxxxxxx" className={INPUT} />
            </div>
          </div>
        </Section>

        <Section title="Detaylı Açıklama" icon={AlignLeft}>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={7} className={`${INPUT} resize-y`} placeholder="Firma hakkında detaylı bilgi, uzmanlık alanları..." />
        </Section>

        <Section title="Paketler" icon={Package}>
          <ListItemEditor
            items={packages}
            onChange={setPackages}
            addLabel="Paket Ekle"
            emptyLabel="Henüz paket eklenmedi"
            onAdd={() => ({ _key: `new-${Date.now()}`, name: "", description: "", price: "", featuresText: "" })}
            renderItem={(pkg, update) => (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input value={pkg.name} onChange={(e) => update({ name: e.target.value })} placeholder="Paket adı" className={SMALL_INPUT} />
                  <input value={pkg.price} onChange={(e) => update({ price: e.target.value })} placeholder="Fiyat (ör. Teklif üzerine)" className={SMALL_INPUT} />
                </div>
                <textarea value={pkg.description} onChange={(e) => update({ description: e.target.value })} placeholder="Açıklama" rows={2} className={`${SMALL_INPUT} resize-none`} />
                <textarea value={pkg.featuresText} onChange={(e) => update({ featuresText: e.target.value })} placeholder={"Özellikler (her satıra bir tane)"} rows={3} className={`${SMALL_INPUT} resize-none`} />
              </div>
            )}
          />
        </Section>

        <Section title="Referanslar" icon={Star}>
          <ListItemEditor
            items={references}
            onChange={setReferences}
            addLabel="Referans Ekle"
            emptyLabel="Henüz referans eklenmedi"
            onAdd={() => ({ _key: `new-${Date.now()}`, name: "", role: "", company: "", content: "", avatar: "", rating: "" })}
            renderItem={(ref, update) => (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input value={ref.name} onChange={(e) => update({ name: e.target.value })} placeholder="İsim" className={SMALL_INPUT} />
                  <input value={ref.role} onChange={(e) => update({ role: e.target.value })} placeholder="Unvan" className={SMALL_INPUT} />
                  <input value={ref.company} onChange={(e) => update({ company: e.target.value })} placeholder="Şirket" className={SMALL_INPUT} />
                </div>
                <textarea value={ref.content} onChange={(e) => update({ content: e.target.value })} placeholder="Referans metni" rows={2} className={`${SMALL_INPUT} resize-none`} />
                <MediaPickerButton value={ref.avatar} onChange={(url) => update({ avatar: url })} label="Fotoğraf" hint="Opsiyonel" />
              </div>
            )}
          />
        </Section>

        <Section title="Medya Galerisi" icon={ImageIcon}>
          <ListItemEditor
            items={media}
            onChange={setMedia}
            addLabel="Görsel Ekle"
            emptyLabel="Henüz galeri görseli eklenmedi"
            onAdd={() => ({ _key: `new-${Date.now()}`, url: "", caption: "" })}
            renderItem={(item, update) => (
              <div className="space-y-2">
                <MediaPickerButton value={item.url} onChange={(url) => update({ url })} label="Görsel" />
                <input value={item.caption} onChange={(e) => update({ caption: e.target.value })} placeholder="Açıklama (opsiyonel)" className={SMALL_INPUT} />
              </div>
            )}
          />
        </Section>

        <Section title="Platform & Çözüm Uzmanlığı" icon={Layers}>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Platformlar</p>
              <div className="flex flex-wrap gap-2">
                {allPlatforms.map((p) => (
                  <label key={p.id} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${platformIds.includes(p.id) ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E4EAF5] text-slate-600 hover:bg-slate-50"}`}>
                    <input type="checkbox" checked={platformIds.includes(p.id)} onChange={() => toggleId(platformIds, setPlatformIds, p.id)} className="hidden" />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Çözümler</p>
              <div className="flex flex-wrap gap-2">
                {allSolutions.map((s) => (
                  <label key={s.id} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${solutionIds.includes(s.id) ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E4EAF5] text-slate-600 hover:bg-slate-50"}`}>
                    <input type="checkbox" checked={solutionIds.includes(s.id)} onChange={() => toggleId(solutionIds, setSolutionIds, s.id)} className="hidden" />
                    {s.title}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="SEO" icon={Link2}>
          <SeoPanel data={seo} onChange={setSeo} defaultTitle={name} defaultDesc={shortDesc} />
        </Section>
      </div>

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

          <div className="rounded-2xl border border-[#E4EAF5] bg-white p-4">
            <label className="flex items-center justify-between gap-2 cursor-pointer">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <ShieldCheck size={15} className="text-[#00D084]" />
                Doğrulanmış Ortak
              </span>
              <button
                type="button"
                onClick={() => setVerified((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${verified ? "bg-[#00D084]" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${verified ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
