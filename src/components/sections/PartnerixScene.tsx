"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import Image from "next/image";
import {
  ShoppingCart, Building2, Megaphone, Gift, MoreHorizontal,
  BarChart2, Settings2, Package, TrendingUp, Rocket, Zap,
  Target, Layers, PlusCircle, CreditCard, DollarSign,
  Calendar, CalendarDays, Eye,
  Check, ArrowRight, Lock, MessageCircle, CheckCircle2,
} from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import type { PartnerixCharacterFull } from "@/lib/actions/partnerix-character";

/* ─── Sabitler ─────────────────────────────────────────────────── */
const PARTNERIX = "#4F46E5";
const DEVAM_BG  = "#3730A3";
const WA_URL    = "https://wa.me/905451416118";
const CARD_H    = 460;   // Wizard kart yüksekliği — asla değişmez

/* ─── Tipler ───────────────────────────────────────────────────── */
type IconComp = React.ComponentType<{ className?: string }>;
interface Option  { id: string; label: string; icon: IconComp; color: string; }
interface StepDef { question: string; options: Option[]; }

/* ─── Adımlar ──────────────────────────────────────────────────── */
const STEPS: StepDef[] = [
  {
    question: "İşletmenizin faaliyet alanı nedir?",
    options: [
      { id: "eticaret",  label: "E-Ticaret",  icon: ShoppingCart,   color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "hizmet",    label: "Hizmet",      icon: Megaphone,      color: "bg-[#ECFDF5] text-[#059669]" },
      { id: "uretim",    label: "Üretim",      icon: Building2,      color: "bg-[#FFF7ED] text-[#F97316]" },
      { id: "perakende", label: "Perakende",   icon: Gift,           color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "diger",     label: "Diğer",       icon: MoreHorizontal, color: "bg-[#F8FAFC] text-[#94A3B8]" },
    ],
  },
  {
    question: "Aylık ortalama sipariş hacminiz?",
    options: [
      { id: "s0", label: "0 – 100",     icon: Package,    color: "bg-[#F0FDF4] text-[#22C55E]" },
      { id: "s1", label: "100 – 500",   icon: TrendingUp, color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "s2", label: "500 – 1.000", icon: BarChart2,  color: "bg-[#FFF7ED] text-[#F97316]" },
      { id: "s3", label: "1.000+",      icon: Rocket,     color: "bg-[#EEF2FF] text-[#4F46E5]" },
    ],
  },
  {
    question: "En çok hangi konuda desteğe ihtiyacınız var?",
    options: [
      { id: "d0", label: "E-ticaret Altyapısı", icon: ShoppingCart, color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "d1", label: "Dijital Pazarlama",   icon: Target,       color: "bg-[#FFF7ED] text-[#F97316]" },
      { id: "d2", label: "Entegrasyon",         icon: Layers,       color: "bg-[#F0F9FF] text-[#0EA5E9]" },
      { id: "d3", label: "Büyüme Stratejisi",   icon: BarChart2,    color: "bg-[#ECFDF5] text-[#059669]" },
    ],
  },
  {
    question: "Mevcut e-ticaret altyapınız nedir?",
    options: [
      { id: "a0", label: "Henüz Yok",      icon: PlusCircle,   color: "bg-[#F0FDF4] text-[#22C55E]" },
      { id: "a1", label: "Hazır Platform",  icon: ShoppingCart, color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "a2", label: "Özel Yazılım",    icon: Settings2,    color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "a3", label: "Geçiş Yapacağım", icon: TrendingUp,   color: "bg-[#FFF7ED] text-[#F97316]" },
    ],
  },
  {
    question: "Aylık dijital pazarlama bütçeniz?",
    options: [
      { id: "b0", label: "0 – 5K ₺",    icon: CreditCard, color: "bg-[#F0FDF4] text-[#22C55E]" },
      { id: "b1", label: "5K – 20K ₺",  icon: DollarSign, color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "b2", label: "20K – 50K ₺", icon: Zap,        color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "b3", label: "50K+ ₺",      icon: Target,     color: "bg-[#FFF7ED] text-[#F97316]" },
    ],
  },
  {
    question: "Ne zaman başlamayı planlıyorsunuz?",
    options: [
      { id: "t0", label: "Hemen Şimdi",     icon: Zap,          color: "bg-[#ECFDF5] text-[#059669]" },
      { id: "t1", label: "1 Ay İçinde",      icon: Calendar,     color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "t2", label: "3 Ay İçinde",      icon: CalendarDays, color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "t3", label: "Henüz Bilmiyorum", icon: Eye,          color: "bg-[#F8FAFC] text-[#94A3B8]" },
    ],
  },
];

/* ─── Konuşma balonları metinleri ──────────────────────────────── */
const BUBBLES = [
  "Merhaba! 👋 Ben Partnerix.",
  "Size birkaç soru soracağım.",
  "Yaklaşık 2 dakikada en doğru dijital çözümü bulacağız.",
];

/* ─── Soru geçiş animasyonu ────────────────────────────────────── */
const slide: Variants = {
  enter:  { x: 14,  opacity: 0 },
  center: { x: 0,   opacity: 1, transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] } },
  exit:   { x: -14, opacity: 0, transition: { duration: 0.16, ease: "easeIn" } },
};

/* ────────────────────────────────────────────────────────────────
   Konuşma Balonları
   Kart yok. Messenger yok. Sadece yüzen pill'ler.
──────────────────────────────────────────────────────────────── */
interface BubbleStyle {
  bg: string; text: string; radius: number; shadow: string;
  width: number; fontFamily?: string; fontSize: number; animDuration: number;
}

function SpeechBubbles({ welcomeMessage, style }: { welcomeMessage?: string; style: BubbleStyle }) {
  const bubbles = welcomeMessage ? [welcomeMessage, ...BUBBLES.slice(1)] : BUBBLES
  return (
    <div className="flex flex-col gap-1.5">
      {bubbles.map((text, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8, x: -6 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 0.3 + i * style.animDuration, duration: style.animDuration, ease: [0.22, 1, 0.36, 1] }}
          className="w-fit"
        >
          <div
            className="border border-[#E4EAF5] px-4 py-2"
            style={{
              maxWidth: style.width,
              backgroundColor: style.bg,
              borderRadius: style.radius,
              boxShadow: style.shadow,
            }}
          >
            <p className="leading-snug" style={{ color: style.text, fontSize: style.fontSize, fontFamily: style.fontFamily }}>{text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Partnerix Karakteri
   Kart yok. Sahnenin içinde bağımsız. Animasyonlu.
──────────────────────────────────────────────────────────────── */
interface RobotStyle {
  color: string; shadowEnabled: boolean; glowEnabled: boolean; glowColor: string; neonSecondary: string; backgroundEffect: string;
}

function RobotCharacter({ style }: { style: RobotStyle }) {
  const glowBackground = style.backgroundEffect === "gradient"
    ? `linear-gradient(135deg, ${style.glowColor} 0%, ${style.neonSecondary} 100%)`
    : style.glowColor;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: 200, height: CARD_H }}
    >
      {/* Zemin parıltısı */}
      {style.glowEnabled && style.backgroundEffect !== "none" && (
        <div
          className="absolute bottom-0 left-1/2 h-16 w-40 -translate-x-1/2 rounded-full opacity-[0.10]"
          style={{ background: glowBackground, filter: "blur(28px)" }}
        />
      )}

      {/* Float */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      >
        {/* Sway */}
        <motion.div
          className="absolute inset-0"
          animate={{ x: [0, 3, -2, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Wave (hafif el sallama) */}
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: "bottom center" }}
            animate={{ rotate: [0, -2.5, 0, -2.5, 0, 0, 0, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
          >
            {/* Breathe */}
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.014, 1] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/partnerix-robot.png"
                alt="Partnerix AI Danışmanı"
                fill
                className="object-contain object-bottom"
                style={style.shadowEnabled ? { filter: "drop-shadow(0 14px 28px rgba(79,70,229,0.10))" } : undefined}
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Ayak altı gölgesi */}
      {style.shadowEnabled && (
        <motion.div
          animate={{ scaleX: [1, 0.74, 1], opacity: [0.13, 0.04, 0.13] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 h-2.5 w-28 -translate-x-1/2 rounded-full"
          style={{ background: "#1E1B4B", filter: "blur(8px)" }}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Wizard Kartı
   Tek beyaz kart. İçinde liste seçenekler. Sabit yükseklik.
──────────────────────────────────────────────────────────────── */
interface CtaDef { label: string; href: string | null; color: string; hoverColor: string | null; icon: string | null }

function WizardCard({
  step, pending, onSelect, onNext, completed, accentColor, gradientEnd, isDark, ctas,
}: {
  step: number; pending: string | null;
  onSelect: (id: string) => void; onNext: () => void; completed: boolean;
  accentColor: string; gradientEnd: string; isDark: boolean; ctas: CtaDef[];
}) {
  const def   = STEPS[step];
  const total = STEPS.length;
  const pct   = completed ? 100 : Math.round((step / total) * 100);
  const cardBg = isDark ? "#0F172A" : "#FFFFFF";
  const cardText = isDark ? "#F1F5F9" : "#0F172A";
  const cardBorder = isDark ? "#1E293B" : "#E4EBF5";
  const effectiveCtas = ctas.length > 0 ? ctas : [{ label: "WhatsApp'ta Danışmanlık Al", href: WA_URL, color: DEVAM_BG, hoverColor: null, icon: "MessageCircle" }];

  return (
    <div
      className="flex-1 overflow-hidden rounded-2xl border"
      style={{
        height: CARD_H,
        backgroundColor: cardBg,
        borderColor: cardBorder,
        boxShadow: "0 4px 24px rgba(15,23,42,0.07), 0 1px 3px rgba(15,23,42,0.04)",
      }}
    >
      <div className="flex h-full flex-col">

        {/* Başlık + ilerleme */}
        <div className="flex-shrink-0 border-b px-5 py-3.5" style={{ borderColor: cardBorder }}>
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-bold" style={{ color: cardText }}>İhtiyaç Analiziniz</span>
            <span
              className="text-[12px] font-semibold tabular-nums"
              style={{ color: completed ? "#059669" : accentColor }}
            >
              {completed ? "Tamamlandı ✓" : `${step + 1} / ${total}`}
            </span>
          </div>
          <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[#F1F5F9]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accentColor} 0%, ${gradientEnd} 100%)` }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* İçerik */}
        {completed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FDF9]"
            >
              <CheckCircle2 className="h-7 w-7 text-[#00D084]" />
            </motion.div>
            <div className="space-y-1.5">
              <p className="text-[14px] font-bold" style={{ color: cardText }}>Analiz Tamamlandı!</p>
              <p className="text-[11.5px] leading-relaxed text-[#64748B]">
                Size özel çözümler hazırlanıyor…
              </p>
            </div>
            <div className="flex w-full flex-col gap-2">
              {effectiveCtas.map((cta, i) => {
                const Icon = getIcon(cta.icon, MessageCircle)
                return (
                  <a
                    key={i}
                    href={cta.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: cta.color }}
                  >
                    <Icon className="h-4 w-4" />
                    {cta.label}
                  </a>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Soru */}
            <div className="flex-shrink-0 px-5 pt-3.5 pb-1.5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`q-${step}`}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-[12.5px] font-semibold leading-snug"
                  style={{ color: cardText }}
                >
                  {def.question}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Seçenekler — tek kolon liste, kart değil */}
            <div className="flex-shrink-0 px-4 pt-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`opts-${step}`}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col gap-1.5"
                >
                  {def.options.map((opt) => {
                    const sel  = pending === opt.id;
                    const Icon = opt.icon;
                    return (
                      <motion.button
                        key={opt.id}
                        onClick={() => onSelect(opt.id)}
                        whileTap={{ scale: 0.99 }}
                        transition={{ duration: 0.1 }}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-1.5 text-left transition-all duration-150 ${
                          sel
                            ? "border-2 border-[#4F46E5] bg-[#EEF2FF]"
                            : "border border-[#E8EEF5] bg-white hover:border-[#C7D2FE] hover:bg-[#FAFBFF]"
                        }`}
                      >
                        {/* İkon */}
                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${opt.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Etiket */}
                        <span className={`flex-1 text-[13px] font-medium ${sel ? "text-[#4F46E5]" : "text-[#0F172A]"}`}>
                          {opt.label}
                        </span>

                        {/* Radio */}
                        <div
                          className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            sel ? "border-[#4F46E5] bg-[#4F46E5]" : "border-[#D1D5DB]"
                          }`}
                        >
                          {sel && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Spacer — footer her zaman en altta */}
            <div className="flex-1" />
          </>
        )}

        {/* Footer — Devam Et */}
        {!completed && (
          <div className="flex-shrink-0 border-t border-[#F1F5F9] px-5 pb-4 pt-3">
            <button
              onClick={onNext}
              disabled={!pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-all duration-200 active:scale-[0.98]"
              style={
                pending
                  ? { background: DEVAM_BG, boxShadow: "0 4px 14px rgba(55,48,163,0.28)" }
                  : { background: "#CBD5E1", cursor: "not-allowed" }
              }
            >
              {step === STEPS.length - 1 ? "Analizi Tamamla" : "Devam Et"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <div className="mt-2 flex items-center justify-center gap-1">
              <Lock className="h-2.5 w-2.5 text-[#CBD5E1]" />
              <span className="text-[9px] text-[#CBD5E1]">Bilgileriniz güvenli ve gizlidir.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Ana Sahne — tek container, hiçbir şey üst üste binmiyor

   Yapı:
   ┌─────────────────────────────────────────────┐
   │ 💬 Merhaba 👋 Ben Partnerix.               │
   │ 💬 Size birkaç soru soracağım.              │
   │ 💬 Yaklaşık 2 dakikada...                  │
   │                                             │
   │  [🤖 Robot]  [Wizard Kartı (beyaz kart)]   │
   │  sol, bağımsız  sağ, flex-1                │
   └─────────────────────────────────────────────┘
──────────────────────────────────────────────────────────────── */
interface Props {
  welcomeMessage?: string;
  character?: PartnerixCharacterFull;
}

export default function PartnerixScene({ welcomeMessage, character }: Props) {
  const [step,    setStep]    = useState(0);
  const [pending, setPending] = useState<string | null>(null);
  const [done,    setDone]    = useState(false);

  function handleNext() {
    if (!pending) return;
    setPending(null);
    if (step === STEPS.length - 1) setDone(true);
    else setStep((s) => s + 1);
  }

  const robotStyle: RobotStyle = {
    color: character?.robotColor ?? PARTNERIX,
    shadowEnabled: character?.shadowEnabled ?? true,
    glowEnabled: character?.glowEnabled ?? true,
    glowColor: character?.glowColor ?? PARTNERIX,
    neonSecondary: character?.neonColorSecondary ?? "#818CF8",
    backgroundEffect: character?.backgroundEffect ?? "glow",
  };

  const bubbleStyle: BubbleStyle = {
    bg: character?.bubbleBg ?? "#FFFFFF",
    text: character?.bubbleTextColor ?? "#1E293B",
    radius: character?.bubbleBorderRadius ?? 16,
    shadow: character?.bubbleShadow ?? "0 2px 10px rgba(15,23,42,0.05)",
    width: character?.bubbleWidth ?? 280,
    fontFamily: character?.bubbleFontFamily ?? undefined,
    fontSize: character?.bubbleFontSize ?? 13,
    animDuration: character?.bubbleAnimationDuration ?? 0.38,
  };

  const ctas: CtaDef[] = (character?.ctas ?? [])
    .filter((c) => c.enabled)
    .map((c) => ({ label: c.label, href: c.href, color: c.color, hoverColor: c.hoverColor, icon: c.icon }));

  const firstBubble = character?.firstBubbleText || welcomeMessage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="flex w-full flex-col gap-3"
      style={{ maxWidth: character?.width || "680px" }}
    >
      {/* 1. Konuşma balonları — robotun üstünde, kart/container yok */}
      <SpeechBubbles welcomeMessage={firstBubble} style={bubbleStyle} />

      {/* 2. Robot (sol) + Wizard kart (sağ) — aynı sahne, items-end */}
      <div className="flex items-end gap-5">
        <RobotCharacter style={robotStyle} />
        <WizardCard
          step={step}
          pending={pending}
          onSelect={setPending}
          onNext={handleNext}
          completed={done}
          accentColor={robotStyle.color}
          gradientEnd={robotStyle.neonSecondary}
          isDark={(character?.theme ?? "light") === "dark"}
          ctas={ctas}
        />
      </div>
    </motion.div>
  );
}
