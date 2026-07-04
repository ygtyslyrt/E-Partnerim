"use client"

import { useState, useTransition, useCallback } from "react"
import {
  Save, Loader2, CheckCircle, User, Box, Sparkles, MessageSquareText,
  Film, Zap, Volume2, LayoutPanelLeft, MousePointerClick, Hand, Eye,
} from "lucide-react"
import MediaPickerButton from "@/components/admin/media/MediaPickerButton"
import ListItemEditor from "@/components/admin/shared/ListItemEditor"
import PartnerixCharacterVisual from "@/components/sections/PartnerixCharacterVisual"
import type { CharacterVisualStyle } from "@/components/sections/PartnerixCharacterVisual"
import { updatePartnerixCharacter } from "@/lib/actions/partnerix-character"
import type { PartnerixCharacterFull, PartnerixCharacterInput } from "@/lib/actions/partnerix-character"

interface Props {
  initialData: PartnerixCharacterFull
}

interface AnimationState { _key: string; key: string; label: string; file: string }
interface CtaState { _key: string; label: string; href: string; color: string; hoverColor: string; icon: string; enabled: boolean }

const BEHAVIOR_TRIGGERS = [
  { trigger: "on_load", label: "Sayfa açılınca" },
  { trigger: "waiting_for_answer", label: "Kullanıcı cevap beklerken" },
  { trigger: "result_found", label: "Sonuç bulundu" },
  { trigger: "error", label: "Hata oluştu" },
  { trigger: "new_question", label: "Yeni soru gösterildi" },
]

const INPUT = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const LABEL = "mb-1.5 block text-sm font-medium text-slate-700"
const SMALL_INPUT = "w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] transition"

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

function NumberField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      <input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className={SMALL_INPUT} />
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-[#E4EAF5] p-1" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`${INPUT} font-mono`} />
      </div>
    </div>
  )
}

export default function PartnerixCharacterEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: initialData?.name ?? "Partnerix",
    subtitle: initialData?.subtitle ?? "",
    description: initialData?.description ?? "",
    avatar: initialData?.avatar ?? "",
    model3d: initialData?.model3d ?? "",
    defaultPose: initialData?.defaultPose ?? "idle",
    scale: initialData?.scale ?? 1,
    posX: initialData?.posX ?? 0,
    posY: initialData?.posY ?? 0,
    posZ: initialData?.posZ ?? 0,
    rotX: initialData?.rotX ?? 0,
    rotY: initialData?.rotY ?? 0,
    rotZ: initialData?.rotZ ?? 0,
    shadowEnabled: initialData?.shadowEnabled ?? true,
    backgroundEffect: initialData?.backgroundEffect ?? "none",
    glowEnabled: initialData?.glowEnabled ?? false,
    glowColor: initialData?.glowColor ?? "#4F46E5",
    robotColor: initialData?.robotColor ?? "#4F46E5",
    neonColorPrimary: initialData?.neonColorPrimary ?? "#00D084",
    neonColorSecondary: initialData?.neonColorSecondary ?? "#18AFC1",
    theme: initialData?.theme ?? "light",
    bubbleBg: initialData?.bubbleBg ?? "#FFFFFF",
    bubbleTextColor: initialData?.bubbleTextColor ?? "#1E293B",
    bubbleBorderRadius: initialData?.bubbleBorderRadius ?? 16,
    bubbleShadow: initialData?.bubbleShadow ?? "0 2px 10px rgba(15,23,42,0.05)",
    bubbleWidth: initialData?.bubbleWidth ?? 280,
    bubbleFontFamily: initialData?.bubbleFontFamily ?? "",
    bubbleFontSize: initialData?.bubbleFontSize ?? 13,
    bubbleAnimationDuration: initialData?.bubbleAnimationDuration ?? 0.38,
    audioEnabled: initialData?.audioEnabled ?? false,
    audioFile: initialData?.audioFile ?? "",
    audioVolume: initialData?.audioVolume ?? 0.7,
    audioAutoplay: initialData?.audioAutoplay ?? false,
    audioSpeakingEffect: initialData?.audioSpeakingEffect ?? false,
    enabled: initialData?.enabled ?? true,
    position: initialData?.position ?? "right",
    desktopVisible: initialData?.desktopVisible ?? true,
    mobileVisible: initialData?.mobileVisible ?? false,
    height: initialData?.height ?? "460px",
    width: initialData?.width ?? "680px",
    marginTop: initialData?.marginTop ?? "",
    marginRight: initialData?.marginRight ?? "",
    marginBottom: initialData?.marginBottom ?? "",
    marginLeft: initialData?.marginLeft ?? "",
    padding: initialData?.padding ?? "",
    zIndex: initialData?.zIndex ?? 10,
    positionMobile: initialData?.positionMobile ?? "",
    scaleMobile: initialData?.scaleMobile != null ? String(initialData.scaleMobile) : "",
    heightMobile: initialData?.heightMobile ?? "",
    widthMobile: initialData?.widthMobile ?? "",
    hoverAnimation: initialData?.hoverAnimation ?? "none",
    entranceAnimation: initialData?.entranceAnimation ?? "fade",
    talkingAnimation: initialData?.talkingAnimation ?? "none",
    welcomeTitle: initialData?.welcomeTitle ?? "",
    welcomeSubtitle: initialData?.welcomeSubtitle ?? "",
    welcomeMessage: initialData?.welcomeMessage ?? "",
    firstBubbleText: initialData?.firstBubbleText ?? "",
    startButtonText: initialData?.startButtonText ?? "Başla",
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const [animations, setAnimations] = useState<AnimationState[]>(
    (initialData?.animations ?? []).map((a) => ({ _key: a.id, key: a.key, label: a.label, file: a.file ?? "" }))
  )
  const [behaviorMap, setBehaviorMap] = useState<Record<string, string>>(
    Object.fromEntries((initialData?.behaviors ?? []).map((b) => [b.trigger, b.animationId ?? ""]))
  )
  const [welcomeAnimationKey, setWelcomeAnimationKey] = useState(initialData?.welcomeAnimationId ?? "")
  const [ctas, setCtas] = useState<CtaState[]>(
    (initialData?.ctas ?? []).map((c) => ({
      _key: c.id, label: c.label, href: c.href ?? "", color: c.color,
      hoverColor: c.hoverColor ?? "", icon: c.icon ?? "", enabled: c.enabled,
    }))
  )

  const animationChoices = animations.map((a) => ({ _key: a._key, label: a.label || a.key }))

  const [previewTalking, setPreviewTalking] = useState(false)

  const previewStyle: CharacterVisualStyle = {
    avatar: form.avatar || null,
    scale: form.scale,
    posX: form.posX,
    posY: form.posY,
    color: form.robotColor,
    shadowEnabled: form.shadowEnabled,
    glowEnabled: form.glowEnabled,
    glowColor: form.glowColor,
    neonSecondary: form.neonColorSecondary,
    backgroundEffect: form.backgroundEffect,
    hoverAnimation: form.hoverAnimation,
    talkingAnimation: form.talkingAnimation,
    isTalking: previewTalking,
    zIndex: 1,
  }

  const buildPayload = useCallback((): PartnerixCharacterInput => ({
    ...form,
    scaleMobile: form.scaleMobile === "" ? null : Number(form.scaleMobile),
    positionMobile: form.positionMobile || null,
    heightMobile: form.heightMobile || null,
    widthMobile: form.widthMobile || null,
    welcomeAnimationKey: welcomeAnimationKey || null,
    animations: animations.map((a) => ({ _key: a._key, key: a.key, label: a.label, file: a.file || null })),
    behaviors: BEHAVIOR_TRIGGERS.map((t) => ({ trigger: t.trigger, animationKey: behaviorMap[t.trigger] || null })),
    ctas: ctas.map((c) => ({
      label: c.label, href: c.href || null, color: c.color,
      hoverColor: c.hoverColor || null, icon: c.icon || null, enabled: c.enabled,
    })),
  }), [form, welcomeAnimationKey, animations, behaviorMap, ctas])

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updatePartnerixCharacter(buildPayload())
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  return (
    <div className="space-y-5">
      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Partnerix — 3D Karakter</h1>
          <p className="mt-1 text-sm text-slate-500">Hero'daki dijital asistanın görsel ve davranışsal ayarları</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="flex items-center gap-1.5 text-sm text-emerald-600"><CheckCircle size={15} /> Kaydedildi</span>}
          <button type="button" onClick={handleSave} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition">
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      <Section title="Canlı Önizleme" icon={Eye}>
        <div className="space-y-3">
          <div
            className="relative overflow-hidden rounded-xl border border-[#E4EAF5]"
            style={{ height: 280, background: form.theme === "dark" ? "#0F172A" : "#F8FAFC" }}
          >
            <div style={{ position: "absolute", left: "50%", top: 16, transform: "translateX(-50%) scale(0.55)", transformOrigin: "top center" }}>
              <PartnerixCharacterVisual style={previewStyle} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setPreviewTalking(true); setTimeout(() => setPreviewTalking(false), 2200) }}
              className="rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Konuşma Animasyonunu Önizle
            </button>
            <p className="text-xs text-slate-400">Fareyle karakterin üzerine gelerek hover animasyonunu test edebilirsiniz. Bu önizleme kaydedilmemiş değişiklikleri de anlık gösterir.</p>
          </div>
        </div>
      </Section>

      <Section title="Karakter Bilgisi" icon={User}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Robot Adı</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Robot Alt Başlığı</label>
              <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Robot Açıklaması</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className={`${INPUT} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MediaPickerButton value={form.avatar} onChange={(v) => set("avatar", v)} label="Robot Avatarı" hint="2D önizleme görseli" />
            <MediaPickerButton value={form.model3d} onChange={(v) => set("model3d", v)} label="3D Model (.glb/.gltf)" mimePrefix="model/" hint="İleride 3D render için saklanır" />
          </div>
        </div>
      </Section>

      <Section title="3D Model & Transform" icon={Box}>
        <div className="space-y-4">
          <p className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-xs text-slate-500">
            Ölçek ve X/Y Pozisyon şu an 2D karakterde ofset/boyut olarak kullanılıyor. Z pozisyon ve rotasyon ileride gerçek 3D model eklendiğinde aktifleşecek.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Varsayılan Poz</label>
              <input value={form.defaultPose} onChange={(e) => set("defaultPose", e.target.value)} placeholder="idle" className={INPUT} />
            </div>
            <NumberField label="Ölçek (Scale)" value={form.scale} onChange={(v) => set("scale", v)} step={0.1} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Pozisyon</p>
            <div className="grid grid-cols-3 gap-2">
              <NumberField label="X" value={form.posX} onChange={(v) => set("posX", v)} step={0.1} />
              <NumberField label="Y" value={form.posY} onChange={(v) => set("posY", v)} step={0.1} />
              <NumberField label="Z" value={form.posZ} onChange={(v) => set("posZ", v)} step={0.1} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Rotasyon (derece)</p>
            <div className="grid grid-cols-3 gap-2">
              <NumberField label="X" value={form.rotX} onChange={(v) => set("rotX", v)} />
              <NumberField label="Y" value={form.rotY} onChange={(v) => set("rotY", v)} />
              <NumberField label="Z" value={form.rotZ} onChange={(v) => set("rotZ", v)} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Görsel Efektler" icon={Sparkles}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Tema</label>
              <select value={form.theme} onChange={(e) => set("theme", e.target.value)} className={INPUT}>
                <option value="light">Açık (Light)</option>
                <option value="dark">Koyu (Dark)</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Arka Plan Efekti</label>
              <select value={form.backgroundEffect} onChange={(e) => set("backgroundEffect", e.target.value)} className={INPUT}>
                <option value="none">Yok</option>
                <option value="glow">Glow</option>
                <option value="particles">Parçacıklar</option>
                <option value="gradient">Gradyan</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Robot Rengi" value={form.robotColor} onChange={(v) => set("robotColor", v)} />
            <ColorField label="Glow Rengi" value={form.glowColor} onChange={(v) => set("glowColor", v)} />
            <ColorField label="Neon Rengi 1" value={form.neonColorPrimary} onChange={(v) => set("neonColorPrimary", v)} />
            <ColorField label="Neon Rengi 2" value={form.neonColorSecondary} onChange={(v) => set("neonColorSecondary", v)} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.shadowEnabled} onChange={(e) => set("shadowEnabled", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#3730A3]" />
              Gölge Aç
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.glowEnabled} onChange={(e) => set("glowEnabled", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#3730A3]" />
              Glow Efekti Aç
            </label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={LABEL}>Hover Animasyonu</label>
              <select value={form.hoverAnimation} onChange={(e) => set("hoverAnimation", e.target.value)} className={INPUT}>
                <option value="none">Yok</option>
                <option value="scale">Büyüt</option>
                <option value="bounce">Zıpla</option>
                <option value="rotate">Döndür</option>
                <option value="glow">Glow'u Yoğunlaştır</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Giriş Animasyonu</label>
              <select value={form.entranceAnimation} onChange={(e) => set("entranceAnimation", e.target.value)} className={INPUT}>
                <option value="fade">Fade</option>
                <option value="slide-up">Aşağıdan Kayma</option>
                <option value="slide-left">Soldan Kayma</option>
                <option value="slide-right">Sağdan Kayma</option>
                <option value="zoom">Zoom</option>
                <option value="none">Yok</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Konuşurken Animasyon</label>
              <select value={form.talkingAnimation} onChange={(e) => set("talkingAnimation", e.target.value)} className={INPUT}>
                <option value="none">Yok</option>
                <option value="pulse">Nabız (Pulse)</option>
                <option value="bounce">Zıplama</option>
                <option value="shake">Titreme</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Konuşma Balonu" icon={MessageSquareText}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Arka Plan Rengi" value={form.bubbleBg} onChange={(v) => set("bubbleBg", v)} />
            <ColorField label="Yazı Rengi" value={form.bubbleTextColor} onChange={(v) => set("bubbleTextColor", v)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <NumberField label="Border Radius (px)" value={form.bubbleBorderRadius} onChange={(v) => set("bubbleBorderRadius", v)} />
            <NumberField label="Genişlik (px)" value={form.bubbleWidth} onChange={(v) => set("bubbleWidth", v)} />
            <NumberField label="Yazı Boyutu (px)" value={form.bubbleFontSize} onChange={(v) => set("bubbleFontSize", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Yazı Tipi</label>
              <input value={form.bubbleFontFamily} onChange={(e) => set("bubbleFontFamily", e.target.value)} placeholder="Sistem varsayılanı" className={INPUT} />
            </div>
            <NumberField label="Animasyon Süresi (sn)" value={form.bubbleAnimationDuration} onChange={(v) => set("bubbleAnimationDuration", v)} step={0.05} />
          </div>
          <div>
            <label className={LABEL}>Gölge (CSS box-shadow)</label>
            <input value={form.bubbleShadow} onChange={(e) => set("bubbleShadow", e.target.value)} className={`${INPUT} font-mono text-xs`} />
          </div>
        </div>
      </Section>

      <Section title="Animasyonlar" icon={Film}>
        <ListItemEditor
          items={animations}
          onChange={setAnimations}
          addLabel="Animasyon Ekle"
          emptyLabel="Henüz animasyon eklenmedi"
          onAdd={() => ({ _key: `new-${Date.now()}`, key: "", label: "", file: "" })}
          renderItem={(anim, update) => (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input value={anim.label} onChange={(e) => update({ label: e.target.value })} placeholder="Ad (ör. Karşılama Animasyonu)" className={SMALL_INPUT} />
                <input value={anim.key} onChange={(e) => update({ key: e.target.value })} placeholder="Anahtar (ör. wave)" className={SMALL_INPUT} />
              </div>
              <MediaPickerButton value={anim.file} onChange={(url) => update({ file: url })} label="Animasyon Dosyası" mimePrefix="model/" />
            </div>
          )}
        />
      </Section>

      <Section title="Robot Davranışları" icon={Hand}>
        <div className="space-y-3">
          {BEHAVIOR_TRIGGERS.map((t) => (
            <div key={t.trigger} className="grid grid-cols-[1fr_auto] items-center gap-3">
              <span className="text-sm text-slate-700">{t.label}</span>
              <select
                value={behaviorMap[t.trigger] ?? ""}
                onChange={(e) => setBehaviorMap((prev) => ({ ...prev, [t.trigger]: e.target.value }))}
                className={SMALL_INPUT}
              >
                <option value="">Animasyon yok</option>
                {animationChoices.map((a) => <option key={a._key} value={a._key}>{a.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Ses (altyapı)" icon={Volume2}>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.audioEnabled} onChange={(e) => set("audioEnabled", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#3730A3]" />
            Ses Aç
          </label>
          <MediaPickerButton value={form.audioFile} onChange={(v) => set("audioFile", v)} label="Ses Dosyası" mimePrefix="audio/" />
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Ses Seviyesi (0-1)" value={form.audioVolume} onChange={(v) => set("audioVolume", v)} step={0.1} />
            <div className="flex items-end gap-6 pb-1.5">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.audioAutoplay} onChange={(e) => set("audioAutoplay", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#3730A3]" />
                Otomatik Oynat
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.audioSpeakingEffect} onChange={(e) => set("audioSpeakingEffect", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#3730A3]" />
                Konuşma Efekti
              </label>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Ana Sayfa Yerleşimi" icon={LayoutPanelLeft}>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={form.enabled} onChange={(e) => set("enabled", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#3730A3]" />
            Partnerix Karakterini Göster (ana anahtar)
          </label>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className={LABEL}>Konum</label>
              <select value={form.position} onChange={(e) => set("position", e.target.value)} className={INPUT}>
                <option value="right">Sağ</option>
                <option value="left">Sol</option>
                <option value="bottom">Alt</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Yükseklik</label>
              <input value={form.height} onChange={(e) => set("height", e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Genişlik</label>
              <input value={form.width} onChange={(e) => set("width", e.target.value)} className={INPUT} />
            </div>
            <NumberField label="Z-Index" value={form.zIndex} onChange={(v) => set("zIndex", v)} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.desktopVisible} onChange={(e) => set("desktopVisible", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#3730A3]" />
              Masaüstünde Göster
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.mobileVisible} onChange={(e) => set("mobileVisible", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#3730A3]" />
              Mobilde Göster
            </label>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Margin</p>
            <div className="grid grid-cols-4 gap-2">
              <input value={form.marginTop} onChange={(e) => set("marginTop", e.target.value)} placeholder="Üst" className={SMALL_INPUT} />
              <input value={form.marginRight} onChange={(e) => set("marginRight", e.target.value)} placeholder="Sağ" className={SMALL_INPUT} />
              <input value={form.marginBottom} onChange={(e) => set("marginBottom", e.target.value)} placeholder="Alt" className={SMALL_INPUT} />
              <input value={form.marginLeft} onChange={(e) => set("marginLeft", e.target.value)} placeholder="Sol" className={SMALL_INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Padding</label>
            <input value={form.padding} onChange={(e) => set("padding", e.target.value)} className={INPUT} />
          </div>

          <div className="rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Mobil Ayarları (boş bırakılırsa masaüstü değeri kullanılır)</p>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Mobil Konum</label>
                <select value={form.positionMobile} onChange={(e) => set("positionMobile", e.target.value)} className={SMALL_INPUT}>
                  <option value="">Masaüstü ile aynı</option>
                  <option value="right">Sağ</option>
                  <option value="left">Sol</option>
                  <option value="bottom">Alt</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Mobil Ölçek</label>
                <input type="number" step={0.1} value={form.scaleMobile} onChange={(e) => set("scaleMobile", e.target.value)} placeholder={String(form.scale)} className={SMALL_INPUT} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Mobil Yükseklik</label>
                <input value={form.heightMobile} onChange={(e) => set("heightMobile", e.target.value)} placeholder={form.height} className={SMALL_INPUT} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Mobil Genişlik</label>
                <input value={form.widthMobile} onChange={(e) => set("widthMobile", e.target.value)} placeholder={form.width} className={SMALL_INPUT} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="CTA Butonları" icon={MousePointerClick}>
        <ListItemEditor
          items={ctas}
          onChange={setCtas}
          addLabel="Buton Ekle"
          emptyLabel="Henüz buton eklenmedi"
          onAdd={() => ({ _key: `new-${Date.now()}`, label: "", href: "", color: "#3730A3", hoverColor: "", icon: "", enabled: true })}
          renderItem={(cta, update) => (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input value={cta.label} onChange={(e) => update({ label: e.target.value })} placeholder="Buton Metni" className={SMALL_INPUT} />
                <input value={cta.href} onChange={(e) => update({ href: e.target.value })} placeholder="Buton Linki" className={SMALL_INPUT} />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <input type="color" value={cta.color} onChange={(e) => update({ color: e.target.value })} className="h-9 w-full cursor-pointer rounded-lg border border-[#E4EAF5]" title="Renk" />
                <input type="color" value={cta.hoverColor || cta.color} onChange={(e) => update({ hoverColor: e.target.value })} className="h-9 w-full cursor-pointer rounded-lg border border-[#E4EAF5]" title="Hover Rengi" />
                <input value={cta.icon} onChange={(e) => update({ icon: e.target.value })} placeholder="İkon (lucide adı)" className={SMALL_INPUT} />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={cta.enabled} onChange={(e) => update({ enabled: e.target.checked })} className="h-3.5 w-3.5 rounded border-slate-300" />
                Aktif
              </label>
            </div>
          )}
        />
      </Section>

      <Section title="Karşılama Ekranı" icon={Zap}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Başlık</label>
              <input value={form.welcomeTitle} onChange={(e) => set("welcomeTitle", e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Alt Başlık</label>
              <input value={form.welcomeSubtitle} onChange={(e) => set("welcomeSubtitle", e.target.value)} className={INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Hoşgeldin Mesajı</label>
            <textarea value={form.welcomeMessage} onChange={(e) => set("welcomeMessage", e.target.value)} rows={2} className={`${INPUT} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>İlk Konuşma Balonu</label>
              <input value={form.firstBubbleText} onChange={(e) => set("firstBubbleText", e.target.value)} placeholder="Merhaba! 👋 Ben Partnerix." className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Başlat Butonu Metni</label>
              <input value={form.startButtonText} onChange={(e) => set("startButtonText", e.target.value)} className={INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Karşılama Animasyonu</label>
            <select value={welcomeAnimationKey} onChange={(e) => setWelcomeAnimationKey(e.target.value)} className={INPUT}>
              <option value="">Animasyon yok</option>
              {animationChoices.map((a) => <option key={a._key} value={a._key}>{a.label}</option>)}
            </select>
          </div>
        </div>
      </Section>
    </div>
  )
}
