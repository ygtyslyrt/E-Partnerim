"use client"

import { useState, useTransition } from "react"
import { Loader2, Save, CheckCircle } from "lucide-react"
import type { ActionResult } from "@/types/cms"

interface Props {
  initialSettings: Record<string, string>
  action: (data: Record<string, string>) => Promise<ActionResult>
}

const GROUPS = [
  {
    label: "Genel",
    keys: [
      { key: "site_name",    label: "Site Adı",  type: "text" },
      { key: "site_tagline", label: "Slogan",     type: "text" },
      { key: "site_url",     label: "Site URL",   type: "url"  },
    ],
  },
  {
    label: "İletişim",
    keys: [
      { key: "email",    label: "E-posta",          type: "email" },
      { key: "phone",    label: "Telefon",           type: "text"  },
      { key: "whatsapp", label: "WhatsApp Numarası", type: "text"  },
      { key: "address",  label: "Adres",             type: "text"  },
    ],
  },
  {
    label: "Sosyal Medya",
    keys: [
      { key: "instagram", label: "Instagram URL", type: "url" },
      { key: "linkedin",  label: "LinkedIn URL",  type: "url" },
      { key: "twitter",   label: "Twitter/X URL", type: "url" },
      { key: "facebook",  label: "Facebook URL",  type: "url" },
      { key: "tiktok",    label: "TikTok URL",    type: "url" },
    ],
  },
  {
    label: "Footer",
    keys: [
      { key: "footer_description", label: "Footer Açıklama Metni", type: "textarea" },
    ],
  },
]

export default function SettingsForm({ initialSettings, action }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>(initialSettings)

  const inputCls =
    "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await action(values)
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {GROUPS.map((group) => (
        <div key={group.label} className="rounded-2xl border border-[#E4EAF5] bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-700">{group.label}</h2>
          <div className="space-y-4">
            {group.keys.map(({ key, label, type }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                {type === "textarea" ? (
                  <textarea
                    value={values[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                ) : (
                  <input
                    type={type}
                    value={values[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className={inputCls}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle size={15} />
            Kaydedildi
          </span>
        )}
      </div>
    </form>
  )
}
