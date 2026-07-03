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

/* ─── Sabitler ─────────────────────────────────────────── */
const PARTNERIX = "#4F46E5";
const DEVAM_BG  = "#3730A3";
const WA_URL    = "https://wa.me/905451416118";
const PANEL_H   = 620;

/* ─── Tipler ───────────────────────────────────────────── */
type IconComp = React.ComponentType<{ className?: string }>;
interface Option  { id: string; label: string; icon: IconComp; color: string; }
interface StepDef { question: string; options: Option[]; }

/* ─── Adım verileri ────────────────────────────────────── */
const STEPS: StepDef[] = [
  {
    question: "İşletmenizin faaliyet alanı nedir?",
    options: [
      { id: "eticaret",  label: "E-Ticaret",   icon: ShoppingCart,   color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "hizmet",    label: "Hizmet",       icon: Megaphone,      color: "bg-[#ECFDF5] text-[#059669]" },
      { id: "uretim",    label: "Üretim",       icon: Building2,      color: "bg-[#FFF7ED] text-[#F97316]" },
      { id: "perakende", label: "Perakende",    icon: Gift,           color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "diger",     label: "Diğer",        icon: MoreHorizontal, color: "bg-[#F8FAFC] text-[#94A3B8]" },
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
      { id: "a0", label: "Henüz Yok",       icon: PlusCircle,   color: "bg-[#F0FDF4] text-[#22C55E]" },
      { id: "a1", label: "Hazır Platform",   icon: ShoppingCart, color: "bg-[#EFF6FF] text-[#3B82F6]" },
      { id: "a2", label: "Özel Yazılım",     icon: Settings2,    color: "bg-[#EEF2FF] text-[#4F46E5]" },
      { id: "a3", label: "Geçiş Yapacağım",  icon: TrendingUp,   color: "bg-[#FFF7ED] text-[#F97316]" },
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

/* ─── Konuşma balonları metinleri ──────────────────────── */
const SPEECH = [
  "Merhaba! 👋 Ben Partnerix.",
  "Size birkaç soru soracağım.",
  "Yaklaşık 2 dakikada işletmeniz için en doğru çözümü oluşturacağız.",
  "Haydi başlayalım! 🚀",
];

/* ─── Soru geçiş animasyonu ────────────────────────────── */
const slideIn: Variants = {
  enter:  { x: 16,  opacity: 0 },
  center: { x: 0,   opacity: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:   { x: -16, opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

/* ─── Analiz Paneli ────────────────────────────────────── */
function AnalysisPanel({
  step, pending, onSelect, onNext, completed,
}: {
  step: number; pending: string | null;
  onSelect: (id: string) => void; onNext: () => void; completed: boolean;
}) {
  const def   = STEPS[step];
  const total = STEPS.length;
  const pct   = completed ? 100 : Math.round((step / total) * 100);

  return (
    <div
      className="flex-shrink-0 overflow-hidden rounded-2xl border border-[#E4EBF5] bg-white"
      style={{
        width: 400,
        height: PANEL_H,
        boxShadow: "0 4px 24px rgba(15,23,42,0.07), 0 1px 3px rgba(15,23,42,0.04)",
      }}
    >
      <div className="flex h-full flex-col">

        {/* Başlık + ilerleme */}
        <div className="flex-shrink-0 border-b border-[#F1F5F9] px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#0F172A]">İhtiyaç Analiziniz</span>
            <span
              className="text-[12.5px] font-semibold"
              style={{ color: completed ? "#059669" : PARTNERIX }}
            >
              {completed ? "Tamamlandı ✓" : `${step + 1} / ${total}`}
            </span>
          </div>
          <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-[#F1F5F9]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${PARTNERIX} 0%, #818CF8 100%)` }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Tamamlandı ekranı */}
        {completed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FDF9]"
            >
              <CheckCircle2 className="h-7 w-7 text-[#00D084]" />
            </motion.div>
            <div className="space-y-1.5">
              <p className="text-[14.5px] font-bold text-[#0F172A]">Analiz Tamamlandı!</p>
              <p className="text-[11.5px] leading-relaxed text-[#64748B]">
                Size özel çözümler hazırlanıyor…
              </p>
            </div>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: DEVAM_BG }}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp&apos;ta Danışmanlık Al
            </a>
          </motion.div>
        ) : (
          <>
            {/* Soru */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`q-${step}`}
                  variants={slideIn}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-[13px] font-semibold leading-snug text-[#0F172A]"
                >
                  {def.question}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Seçenekler — tek kolon liste */}
            <div className="flex-shrink-0 px-4 pt-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`opts-${step}`}
                  variants={slideIn}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col gap-2"
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
                        className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-2.5 text-left transition-all duration-150 ${
                          sel
                            ? "border-2 border-[#4F46E5] bg-[#EEF2FF]"
                            : "border border-[#E8EEF5] bg-white hover:border-[#C7D2FE] hover:bg-[#FAFBFF]"
                        }`}
                      >
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${opt.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`flex-1 text-[13.5px] font-medium ${sel ? "text-[#4F46E5]" : "text-[#0F172A]"}`}>
                          {opt.label}
                        </span>
                        <div
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                            sel ? "border-2 border-[#4F46E5] bg-[#4F46E5]" : "border-2 border-[#D1D5DB]"
                          }`}
                        >
                          {sel && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Spacer */}
            <div className="flex-1" />
          </>
        )}

        {/* Footer */}
        {!completed && (
          <div className="flex-shrink-0 border-t border-[#F1F5F9] px-5 pb-4 pt-3.5">
            <button
              onClick={onNext}
              disabled={!pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold text-white transition-all duration-200 active:scale-[0.98]"
              style={
                pending
                  ? { background: DEVAM_BG, boxShadow: "0 4px 16px rgba(55,48,163,0.28)" }
                  : { background: "#CBD5E1", cursor: "not-allowed" }
              }
            >
              {step === STEPS.length - 1 ? "Analizi Tamamla" : "Devam Et"}
              <ArrowRight className="h-4 w-4" />
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

/* ─── Ana bileşen ──────────────────────────────────────── */
export default function PartnerixWidget() {
  const [step,    setStep]    = useState(0);
  const [pending, setPending] = useState<string | null>(null);
  const [done,    setDone]    = useState(false);

  function handleNext() {
    if (!pending) return;
    setPending(null);
    if (step === STEPS.length - 1) setDone(true);
    else setStep((s) => s + 1);
  }

  return (
    <div className="flex w-full max-w-[790px] items-end gap-6">

      {/* ── Orta: Partnerix karakteri + konuşma balonları ── */}
      <div className="relative flex-1" style={{ height: PANEL_H }}>

        {/* 4 konuşma balonu — robotun sol üst tarafında, z-10 */}
        <div className="absolute left-0 z-10 flex flex-col gap-2" style={{ top: 28 }}>
          {SPEECH.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.45, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="rounded-2xl border border-[#E4EAF4] bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                style={{ maxWidth: 240 }}
              >
                <p className="text-[12.5px] leading-snug text-[#1E293B]">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Robot — merkezde, tam yükseklik, animasyonlu */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: 360, height: PANEL_H }}
        >
          {/* Zemin parıltısı */}
          <div
            className="absolute bottom-0 left-1/2 h-20 w-48 -translate-x-1/2 rounded-full opacity-[0.10]"
            style={{ background: PARTNERIX, filter: "blur(30px)" }}
          />

          {/* Float */}
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          >
            {/* Sway */}
            <motion.div
              className="absolute inset-0"
              animate={{ x: [0, 3, -2, 3, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Wave */}
              <motion.div
                className="absolute inset-0"
                style={{ transformOrigin: "bottom center" }}
                animate={{ rotate: [0, -2.5, 0, -2.5, 0, 0, 0, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
              >
                {/* Breathe */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.015, 1] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/partnerix-robot.png"
                    alt="Partnerix AI Danışmanı"
                    fill
                    className="object-contain object-bottom drop-shadow-[0_16px_32px_rgba(79,70,229,0.12)]"
                    priority
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Ayak altı gölgesi */}
          <motion.div
            animate={{ scaleX: [1, 0.76, 1], opacity: [0.14, 0.05, 0.14] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-1/2 h-3 w-32 -translate-x-1/2 rounded-full"
            style={{ background: "#1E1B4B", filter: "blur(9px)" }}
          />
        </div>
      </div>

      {/* ── Sağ: Analiz paneli ── */}
      <AnalysisPanel
        step={step}
        pending={pending}
        onSelect={setPending}
        onNext={handleNext}
        completed={done}
      />
    </div>
  );
}
