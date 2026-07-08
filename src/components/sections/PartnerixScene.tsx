"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import PartnerixCharacterVisual from "./PartnerixCharacterVisual";
import type { CharacterVisualStyle } from "./PartnerixCharacterVisual";
import LeadContactForm from "./LeadContactForm";
import {
  ShoppingCart, Building2, Megaphone, MoreHorizontal, Store,
  Settings2, TrendingUp, Users, Globe, Search,
  PlusCircle, Briefcase, RefreshCw, Zap,
  Calendar, CalendarDays, Eye,
  Check, ArrowRight, Lock, MessageCircle, CheckCircle2, Home,
} from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import type { PartnerixCharacterFull } from "@/lib/actions/partnerix-character";
import { completePartnerixSession } from "@/lib/actions/partnerix";

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
    question: "İşletmeniz hangi alanda faaliyet gösteriyor?",
    options: [
      { id: "eticaret", label: "E-Ticaret",      icon: ShoppingCart,   color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "hizmet",   label: "Hizmet",          icon: Megaphone,      color: "bg-[#ECFDF5] text-[#059669]" },
      { id: "uretim",   label: "Üretim",          icon: Building2,      color: "bg-[#FFF7ED] text-[#F97316]" },
      { id: "yerel",    label: "Yerel İşletme",   icon: Store,          color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "diger",    label: "Diğer",           icon: MoreHorizontal, color: "bg-[#F8FAFC] text-[#94A3B8]" },
    ],
  },
  {
    question: "Şu anda ulaşmak istediğiniz en önemli hedef nedir?",
    options: [
      { id: "satis",    label: "Daha fazla satış",                  icon: TrendingUp, color: "bg-[#ECFDF5] text-[#059669]" },
      { id: "musteri",  label: "Daha fazla müşteri",                icon: Users,      color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "website",  label: "Yeni bir web sitesi yaptırmak",     icon: Globe,      color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "reklam",   label: "Dijital reklam vermek",             icon: Megaphone,  color: "bg-[#FFF7ED] text-[#F97316]" },
      { id: "google",   label: "Google'da daha görünür olmak",      icon: Search,     color: "bg-[#F0F9FF] text-[#0EA5E9]" },
    ],
  },
  {
    question: "Şu anda dijital tarafta hangi noktadasınız?",
    options: [
      { id: "baslamadi", label: "Henüz başlamadım",                       icon: PlusCircle, color: "bg-[#F0FDF4] text-[#22C55E]" },
      { id: "kendim",     label: "Kendim yönetiyorum",                     icon: Settings2,  color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "ajans",      label: "Bir ajansla çalışıyorum",                icon: Briefcase,  color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "memnundegil", label: "Memnun değilim, değiştirmek istiyorum", icon: RefreshCw,  color: "bg-[#FFF7ED] text-[#F97316]" },
    ],
  },
  {
    question: "Ne zaman başlamak istiyorsunuz?",
    options: [
      { id: "hemen",   label: "Hemen",                    icon: Zap,          color: "bg-[#ECFDF5] text-[#059669]" },
      { id: "1ay",     label: "1 ay içinde",               icon: Calendar,     color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "2-3ay",   label: "2-3 ay içinde",             icon: CalendarDays, color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "arastir", label: "Şimdilik araştırıyorum",    icon: Eye,          color: "bg-[#F8FAFC] text-[#94A3B8]" },
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
   Wizard Kartı
   Tek beyaz kart. İçinde liste seçenekler. Sabit yükseklik.
──────────────────────────────────────────────────────────────── */
interface CtaDef { label: string; href: string | null; color: string; hoverColor: string | null; icon: string | null }

type ScenePhase = "questions" | "contact" | "done";

function WizardCard({
  step, pending, onSelect, onNext, phase, accentColor, gradientEnd, isDark, ctas,
  name, phone, email, onNameChange, onPhoneChange, onEmailChange, onSubmitContact, submitting, contactError,
}: {
  step: number; pending: string | null;
  onSelect: (id: string) => void; onNext: () => void; phase: ScenePhase;
  accentColor: string; gradientEnd: string; isDark: boolean; ctas: CtaDef[];
  name: string; phone: string; email: string;
  onNameChange: (v: string) => void; onPhoneChange: (v: string) => void; onEmailChange: (v: string) => void;
  onSubmitContact: () => void; submitting: boolean; contactError: string | null;
}) {
  const def   = STEPS[step];
  const total = STEPS.length;
  const pct   = phase === "questions" ? Math.round((step / total) * 100) : 100;
  const cardBg = isDark ? "#0F172A" : "#FFFFFF";
  const cardText = isDark ? "#F1F5F9" : "#0F172A";
  const cardBorder = isDark ? "#1E293B" : "#E4EBF5";
  const inputBg = isDark ? "#1E293B" : "#FFFFFF";
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
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-[13.5px] font-bold" style={{ color: cardText }}>🤖 Partnerix ile Ücretsiz Dijital Analiz</span>
            <span
              className="shrink-0 text-[12px] font-semibold tabular-nums"
              style={{ color: phase === "questions" ? accentColor : "#059669" }}
            >
              {phase === "questions" ? `${step + 1} / ${total}` : phase === "contact" ? `Adım ${total + 1} / ${total + 1}` : "Tamamlandı ✓"}
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
        {phase === "done" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-5 py-3.5 text-center"
          >
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#F0FDF9]"
              >
                <CheckCircle2 className="h-5 w-5 text-[#00D084]" />
              </motion.div>
              <div className="space-y-1">
                <p className="text-[13px] font-bold leading-snug" style={{ color: cardText }}>🎉 Analiziniz Başarıyla Oluşturuldu!</p>
                <p className="text-[10px] leading-relaxed text-[#64748B]">
                  Partnerix işletmenizi başarıyla analiz etti. Size en uygun dijital çözüm ortaklarını belirlemek ve size özel dijital büyüme yol haritanızı hazırlamak için ekibimiz analizinizi incelemeye başladı.
                </p>
              </div>
            </div>

            <div className="w-full rounded-xl border px-3 py-2.5 text-left" style={{ borderColor: cardBorder, backgroundColor: isDark ? "#0B1220" : "#F8FAFC" }}>
              <p className="mb-1.5 text-[10.5px] font-bold" style={{ color: cardText }}>Sonraki Süreç</p>
              <ul className="space-y-1">
                {[
                  "Analiziniz uzman ekibimize iletildi.",
                  "İhtiyaçlarınıza en uygun çözüm önerileri hazırlanacak.",
                  "Dijital danışmanımız 24 saat içinde sizinle iletişime geçecek.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-[10px] leading-snug text-[#64748B]">
                    <Check className="mt-[3px] h-2.5 w-2.5 flex-shrink-0 text-[#00D084]" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start justify-center gap-1 px-1">
              <Lock className="mt-[2px] h-2.5 w-2.5 flex-shrink-0 text-[#CBD5E1]" />
              <p className="text-[8.5px] leading-snug text-[#94A3B8]">
                🔒 Bilgileriniz KVKK kapsamında güvenle saklanmaktadır. Hiçbir ücret veya yükümlülük altına girmezsiniz.
              </p>
            </div>

            <div className="flex w-full flex-col gap-1.5">
              {effectiveCtas.map((cta, i) => {
                const Icon = getIcon(cta.icon, MessageCircle)
                return (
                  <a
                    key={i}
                    href={cta.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[12.5px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: cta.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cta.label}
                  </a>
                )
              })}
              <a
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-[12.5px] font-semibold transition-all hover:bg-[#F8FAFC] active:scale-[0.98]"
                style={{ borderColor: cardBorder, color: cardText }}
              >
                <Home className="h-3.5 w-3.5" />
                Ana Sayfaya Dön
              </a>
            </div>
          </motion.div>
        ) : phase === "contact" ? (
          <LeadContactForm
            cardText={cardText}
            inputBg={inputBg}
            name={name}
            phone={phone}
            email={email}
            onNameChange={onNameChange}
            onPhoneChange={onPhoneChange}
            onEmailChange={onEmailChange}
            contactError={contactError}
            onSubmitContact={onSubmitContact}
            submitting={submitting}
          />
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

        {/* Footer — Devam Et / Sonuçları Gör */}
        {phase === "questions" && (
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
const ENTRANCE_VARIANTS: Record<string, Variants> = {
  fade:       { hidden: { opacity: 0 },                 show: { opacity: 1 } },
  "slide-up": { hidden: { opacity: 0, y: 12 },           show: { opacity: 1, y: 0 } },
  "slide-left":  { hidden: { opacity: 0, x: 24 },        show: { opacity: 1, x: 0 } },
  "slide-right": { hidden: { opacity: 0, x: -24 },       show: { opacity: 1, x: 0 } },
  zoom:       { hidden: { opacity: 0, scale: 0.9 },      show: { opacity: 1, scale: 1 } },
  none:       { hidden: {},                              show: {} },
};

interface Props {
  welcomeMessage?: string;
  character?: PartnerixCharacterFull;
  isDesktop?: boolean;
}

export default function PartnerixScene({ welcomeMessage, character, isDesktop = true }: Props) {
  const [step,    setStep]    = useState(0);
  const [pending, setPending] = useState<string | null>(null);
  const [phase,   setPhase]   = useState<ScenePhase>("questions");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();
  const [isTalking, setIsTalking] = useState(true);
  const talkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsTalking(true);
    if (talkingTimer.current) clearTimeout(talkingTimer.current);
    talkingTimer.current = setTimeout(() => setIsTalking(false), 2200);
    return () => { if (talkingTimer.current) clearTimeout(talkingTimer.current); };
  }, [step]);

  function handleNext() {
    if (!pending) return;
    const label = STEPS[step].options.find((o) => o.id === pending)?.label ?? pending;
    setAnswers((prev) => ({ ...prev, [step]: label }));
    setPending(null);
    if (step === STEPS.length - 1) setPhase("contact");
    else setStep((s) => s + 1);
  }

  function handleSubmitContact() {
    if (!name.trim() || !phone.trim()) {
      setContactError("Ad soyad ve telefon zorunludur");
      return;
    }
    setContactError(null);
    startTransition(async () => {
      const result = await completePartnerixSession({
        name, phone, email: email.trim() || undefined,
        // answers[0]=Sektör, answers[1]=Hedef, answers[2]=Mevcut Durum, answers[3]=Zamanlama —
        // mevcut PartnerixCompletionInput alan adları (support/platform) korunuyor, sadece
        // içerikleri yeni 4 soruluk akışa göre eşleniyor (bkz. LeadSourcePanel etiketleri).
        sector: answers[0], support: answers[1], platform: answers[2], timeline: answers[3],
        answers,
      });
      if (result.success) setPhase("done");
      else setContactError(result.error ?? "Bir şeyler ters gitti, tekrar deneyin");
    });
  }

  const effectiveScale = (isDesktop ? character?.scale : character?.scaleMobile ?? character?.scale) ?? 1;

  const visualStyle: CharacterVisualStyle = {
    avatar: character?.avatar ?? null,
    scale: effectiveScale,
    posX: character?.posX ?? 0,
    posY: character?.posY ?? 0,
    color: character?.robotColor ?? PARTNERIX,
    shadowEnabled: character?.shadowEnabled ?? true,
    glowEnabled: character?.glowEnabled ?? true,
    glowColor: character?.glowColor ?? PARTNERIX,
    neonSecondary: character?.neonColorSecondary ?? "#818CF8",
    backgroundEffect: character?.backgroundEffect ?? "glow",
    hoverAnimation: character?.hoverAnimation ?? "none",
    talkingAnimation: character?.talkingAnimation ?? "none",
    isTalking,
    zIndex: character?.zIndex ?? 10,
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
  const effectiveWidth = (isDesktop ? character?.width : character?.widthMobile || character?.width) || "680px";
  const entranceVariant = ENTRANCE_VARIANTS[character?.entranceAnimation ?? "fade"] ?? ENTRANCE_VARIANTS.fade;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={entranceVariant}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="flex w-full flex-col gap-3"
      style={{ maxWidth: effectiveWidth }}
    >
      {/* 1. Konuşma balonları — robotun üstünde, kart/container yok */}
      <SpeechBubbles welcomeMessage={firstBubble} style={bubbleStyle} />

      {/* 2. Robot (sol) + Wizard kart (sağ) — aynı sahne, items-end */}
      <div className="flex items-end gap-5">
        <PartnerixCharacterVisual style={visualStyle} />
        <WizardCard
          step={step}
          pending={pending}
          onSelect={setPending}
          onNext={handleNext}
          phase={phase}
          accentColor={visualStyle.color}
          gradientEnd={visualStyle.neonSecondary}
          isDark={(character?.theme ?? "light") === "dark"}
          ctas={ctas}
          name={name}
          phone={phone}
          email={email}
          onNameChange={setName}
          onPhoneChange={setPhone}
          onEmailChange={setEmail}
          onSubmitContact={handleSubmitContact}
          submitting={isSubmitting}
          contactError={contactError}
        />
      </div>
    </motion.div>
  );
}
