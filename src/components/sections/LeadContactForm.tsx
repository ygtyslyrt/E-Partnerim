"use client";

import { motion } from "framer-motion";
import { User, Phone, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

const DEVAM_BG = "#3730A3";

interface Props {
  cardText: string;
  inputBg: string;
  name: string;
  phone: string;
  email: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  contactError: string | null;
  onSubmitContact: () => void;
  submitting: boolean;
}

export default function LeadContactForm({
  cardText, inputBg, name, phone, email, onNameChange, onPhoneChange, onEmailChange,
  contactError, onSubmitContact, submitting,
}: Props) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col px-5 pt-4"
      >
        <p className="text-[13px] font-bold leading-snug" style={{ color: cardText }}>
          Harika! Analiziniz tamamlandı.
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-[#64748B]">
          Size özel dijital büyüme yol haritanızı hazırlayabilmemiz için son olarak iletişim bilgilerinizi paylaşın.
        </p>
        <div className="mt-3 space-y-2">
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Adınız Soyadınız"
              className="w-full rounded-xl border border-[#E4E9F2] py-2.5 pl-10 pr-3.5 text-[13px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition"
              style={{ backgroundColor: inputBg, color: cardText }}
            />
          </div>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="05xx xxx xx xx"
              className="w-full rounded-xl border border-[#E4E9F2] py-2.5 pl-10 pr-3.5 text-[13px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition"
              style={{ backgroundColor: inputBg, color: cardText }}
            />
          </div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="E-posta (opsiyonel)"
              className="w-full rounded-xl border border-[#E4E9F2] py-2.5 pl-10 pr-3.5 text-[13px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition"
              style={{ backgroundColor: inputBg, color: cardText }}
            />
          </div>
          {contactError && <p className="text-[11px] text-red-500">{contactError}</p>}
        </div>
        <div className="flex-1" />
      </motion.div>

      <div className="flex-shrink-0 border-t border-[#F1F5F9] px-5 pb-4 pt-3">
        <button
          onClick={onSubmitContact}
          disabled={submitting || !name.trim() || !phone.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed"
          style={{ background: name.trim() && phone.trim() ? DEVAM_BG : "#CBD5E1" }}
        >
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
          {submitting ? "Gönderiliyor..." : "Ücretsiz Yol Haritamı Oluştur"}
        </button>
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[9px] font-medium text-[#94A3B8]">
          <span>✓ Ücretsiz danışmanlık</span>
          <span>✓ Bağlayıcı sözleşme yok</span>
          <span>✓ 10+ yıllık dijital pazarlama deneyimi</span>
        </div>
        <div className="mt-1.5 flex items-center justify-center gap-1">
          <Lock className="h-2.5 w-2.5 text-[#CBD5E1]" />
          <span className="text-[9px] text-[#CBD5E1]">🔒 Bilgileriniz KVKK kapsamında güvenle saklanır ve üçüncü kişilerle paylaşılmaz.</span>
        </div>
      </div>
    </>
  );
}
