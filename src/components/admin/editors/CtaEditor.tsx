"use client"

import { useState, useTransition } from "react"
import { Loader2, Save, CheckCircle } from "lucide-react"
import { updateCtaContent } from "@/lib/actions/cta"
import ListItemEditor from "@/components/admin/shared/ListItemEditor"
import type { CtaSectionContent } from "@prisma/client"

interface Props {
  initialData: CtaSectionContent | null
}

type ButtonState = { _key: string; label: string; type: "whatsapp" | "mail" | "phone" }

const inputCls = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"
const smallInputCls = "w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] transition"

function parseButtons(json: unknown): ButtonState[] {
  if (!Array.isArray(json)) return []
  return json.map((b, i) => ({ _key: `btn-${i}`, label: (b as { label?: string }).label ?? "", type: ((b as { type?: string }).type as ButtonState["type"]) ?? "whatsapp" }))
}

export default function CtaEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eyebrow, setEyebrow] = useState(initialData?.eyebrow ?? "")
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "")
  const [buttons, setButtons] = useState<ButtonState[]>(parseButtons(initialData?.buttons))

  function handleSave() {
    if (!title.trim()) { setError("Başlık zorunludur"); return }
    setError(null)
    startTransition(async () => {
      const result = await updateCtaContent({
        eyebrow, title, subtitle,
        buttons: buttons.map((b) => ({ label: b.label, type: b.type })),
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
    <div className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div>
        <label className={labelCls}>Üst Etiket</label>
        <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} placeholder="Ücretsiz · Tarafsız · Bağlayıcı Değil" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Başlık *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Alt Metin</label>
        <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
      </div>

      <div>
        <label className={labelCls}>Butonlar</label>
        <ListItemEditor
          items={buttons}
          onChange={setButtons}
          addLabel="Buton Ekle"
          emptyLabel="Henüz buton eklenmedi"
          onAdd={() => ({ _key: `new-${Date.now()}`, label: "", type: "whatsapp" as const })}
          renderItem={(btn, update) => (
            <div className="grid grid-cols-2 gap-2">
              <input value={btn.label} onChange={(e) => update({ label: e.target.value })} placeholder="Buton metni" className={smallInputCls} />
              <select value={btn.type} onChange={(e) => update({ type: e.target.value as ButtonState["type"] })} className={smallInputCls}>
                <option value="whatsapp">WhatsApp</option>
                <option value="mail">E-posta</option>
                <option value="phone">Telefon</option>
              </select>
            </div>
          )}
        />
        <p className="mt-1.5 text-xs text-slate-400">Bağlantılar Ayarlar&apos;daki WhatsApp/E-posta/Telefon bilgilerini kullanır.</p>
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
