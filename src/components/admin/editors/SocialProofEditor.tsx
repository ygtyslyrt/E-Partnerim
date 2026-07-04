"use client"

import { useState, useTransition } from "react"
import { Loader2, Save, CheckCircle } from "lucide-react"
import { updateSocialProofContent } from "@/lib/actions/social-proof"
import ListItemEditor from "@/components/admin/shared/ListItemEditor"
import MediaPickerButton from "@/components/admin/media/MediaPickerButton"
import type { SocialProofSectionContent, SocialProofLogo, SocialProofStat, Testimonial } from "@prisma/client"

interface Props {
  initialData: (SocialProofSectionContent & { logos: SocialProofLogo[]; stats: SocialProofStat[]; testimonials: Testimonial[] }) | null
}

type LogoState = { _key: string; id?: string; name: string; logo: string; color: string; url: string }
type StatState = { _key: string; value: string; label: string }
type TestimonialState = { _key: string; id?: string; name: string; company: string; role: string; avatar: string; content: string; rating: string }

const inputCls = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"
const smallInputCls = "w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] transition"

export default function SocialProofEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "")
  const [logos, setLogos] = useState<LogoState[]>(
    (initialData?.logos ?? []).map((l) => ({ _key: l.id, id: l.id, name: l.name, logo: l.logo ?? "", color: l.color ?? "#00D084", url: l.url ?? "" }))
  )
  const [stats, setStats] = useState<StatState[]>(
    (initialData?.stats ?? []).map((s) => ({ _key: s.id, value: s.value, label: s.label }))
  )
  const [testimonials, setTestimonials] = useState<TestimonialState[]>(
    (initialData?.testimonials ?? []).map((t) => ({
      _key: t.id, id: t.id, name: t.name, company: t.company ?? "", role: t.role ?? "",
      avatar: t.avatar ?? "", content: t.content, rating: t.rating?.toString() ?? "",
    }))
  )

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateSocialProofContent({
        title, subtitle,
        logos: logos.map((l) => ({ id: l.id, name: l.name, logo: l.logo || null, color: l.color || null, url: l.url || null })),
        stats: stats.map((s) => ({ value: s.value, label: s.label })),
        testimonials: testimonials.map((t) => ({
          id: t.id, name: t.name, company: t.company || null, role: t.role || null,
          avatar: t.avatar || null, content: t.content, rating: t.rating ? Number(t.rating) : null,
        })),
      })
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? "Bilinmeyen hata")
      }
    })
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Başlık</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Alt Başlık</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Partner Logoları</label>
        <ListItemEditor
          items={logos}
          onChange={setLogos}
          addLabel="Logo Ekle"
          emptyLabel="Henüz logo eklenmedi"
          onAdd={() => ({ _key: `new-${Date.now()}`, name: "", logo: "", color: "#00D084", url: "" })}
          renderItem={(logo, update) => (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input value={logo.name} onChange={(e) => update({ name: e.target.value })} placeholder="Marka adı" className={smallInputCls} />
                <input value={logo.url} onChange={(e) => update({ url: e.target.value })} placeholder="Bağlantı (opsiyonel)" className={smallInputCls} />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <MediaPickerButton value={logo.logo} onChange={(url) => update({ logo: url })} label="Logo görseli" hint="Boş bırakılırsa renkli metin gösterilir" />
                </div>
                {!logo.logo && (
                  <div className="shrink-0">
                    <label className="mb-1.5 block text-xs text-slate-500">Metin rengi</label>
                    <input type="color" value={logo.color} onChange={(e) => update({ color: e.target.value })} className="h-9 w-12 cursor-pointer rounded border border-[#E4EAF5]" />
                  </div>
                )}
              </div>
            </div>
          )}
        />
      </div>

      <div>
        <label className={labelCls}>İstatistikler</label>
        <ListItemEditor
          items={stats}
          onChange={setStats}
          addLabel="İstatistik Ekle"
          emptyLabel="Henüz istatistik eklenmedi"
          onAdd={() => ({ _key: `new-${Date.now()}`, value: "", label: "" })}
          renderItem={(stat, update) => (
            <div className="grid grid-cols-2 gap-2">
              <input value={stat.value} onChange={(e) => update({ value: e.target.value })} placeholder="10+" className={smallInputCls} />
              <input value={stat.label} onChange={(e) => update({ label: e.target.value })} placeholder="Yıllık Deneyim" className={smallInputCls} />
            </div>
          )}
        />
      </div>

      <div>
        <label className={labelCls}>Referanslar (Testimonial)</label>
        <ListItemEditor
          items={testimonials}
          onChange={setTestimonials}
          addLabel="Referans Ekle"
          emptyLabel="Henüz referans eklenmedi"
          onAdd={() => ({ _key: `new-${Date.now()}`, name: "", company: "", role: "", avatar: "", content: "", rating: "" })}
          renderItem={(t, update) => (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <input value={t.name} onChange={(e) => update({ name: e.target.value })} placeholder="İsim" className={smallInputCls} />
                <input value={t.role} onChange={(e) => update({ role: e.target.value })} placeholder="Unvan" className={smallInputCls} />
                <input value={t.company} onChange={(e) => update({ company: e.target.value })} placeholder="Şirket" className={smallInputCls} />
              </div>
              <textarea value={t.content} onChange={(e) => update({ content: e.target.value })} placeholder="Referans metni" rows={2} className={`${smallInputCls} resize-none`} />
              <MediaPickerButton value={t.avatar} onChange={(url) => update({ avatar: url })} label="Fotoğraf" hint="Boş bırakılırsa baş harf gösterilir" />
            </div>
          )}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle size={15} /> Kaydedildi
          </span>
        )}
      </div>
    </div>
  )
}
