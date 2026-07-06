"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { createContactForm, createConsultingForm } from "@/lib/actions/forms";

const BUDGETS = ["0 – 10.000 ₺", "10.000 – 50.000 ₺", "50.000 – 100.000 ₺", "100.000 ₺ üzeri"];
const TIMELINES = ["Hemen", "1 Ay İçinde", "3 Ay İçinde", "Henüz Bilmiyorum"];
const SERVICES = ["E-ticaret Altyapısı", "Dijital Pazarlama", "Marka Tescili", "Muhasebe / Hukuk", "Lojistik", "Diğer"];

const INPUT = "w-full rounded-xl border border-[#E8EEF0] bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#00D084] focus:ring-2 focus:ring-[#00D084]/10 transition";
const LABEL = "mb-1.5 block text-sm font-medium text-[#334155]";

function SuccessCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#00D084]/20 bg-[#F0FDF9] p-10 text-center">
      <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#00D084]" />
      <h3 className="text-lg font-bold text-[#0F172A]">Mesajınız Alındı</h3>
      <p className="mt-2 text-sm text-[#64748B]">{text}</p>
    </div>
  );
}

function QuickMessageForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("İsim, e-posta ve mesaj zorunludur");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createContactForm({
        name, email, phone: phone || undefined, company: company || undefined, message,
      });
      if (result.success) setSuccess(true);
      else setError(result.error ?? "Mesaj gönderilemedi");
    });
  }

  if (success) return <SuccessCard text="En kısa sürede sizinle iletişime geçeceğiz." />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Ad Soyad *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} placeholder="Adınız Soyadınız" />
        </div>
        <div>
          <label className={LABEL}>E-posta *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} placeholder="ornek@firma.com" />
        </div>
        <div>
          <label className={LABEL}>Telefon</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT} placeholder="05xx xxx xx xx" />
        </div>
        <div>
          <label className={LABEL}>Firma</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} className={INPUT} placeholder="Firma adınız" />
        </div>
      </div>
      <div>
        <label className={LABEL}>Mesajınız *</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className={`${INPUT} resize-none`} placeholder="Size nasıl yardımcı olabiliriz?" />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00D084] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,208,132,0.35)] transition-all hover:bg-[#00bb76] disabled:opacity-60"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {isPending ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>
    </form>
  );
}

function ConsultingRequestForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function toggleService(s: string) {
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("İsim ve e-posta zorunludur");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createConsultingForm({
        name, email, phone: phone || undefined, company: company || undefined,
        website: website || undefined, budget: budget || undefined, timeline: timeline || undefined,
        services: services.length ? services : undefined, message: message || undefined,
      });
      if (result.success) setSuccess(true);
      else setError(result.error ?? "Talep gönderilemedi");
    });
  }

  if (success) return <SuccessCard text="Danışmanlık talebiniz alındı. Ekibimiz ihtiyacınızı analiz edip size özel bir yol haritasıyla dönüş yapacak." />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Ad Soyad *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} placeholder="Adınız Soyadınız" />
        </div>
        <div>
          <label className={LABEL}>E-posta *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} placeholder="ornek@firma.com" />
        </div>
        <div>
          <label className={LABEL}>Telefon</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT} placeholder="05xx xxx xx xx" />
        </div>
        <div>
          <label className={LABEL}>Firma</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} className={INPUT} placeholder="Firma adınız" />
        </div>
        <div>
          <label className={LABEL}>Web Sitesi</label>
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={INPUT} placeholder="https://..." />
        </div>
        <div>
          <label className={LABEL}>Bütçe Aralığı</label>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={INPUT}>
            <option value="">Seçin...</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={LABEL}>Ne Zaman Başlamak İstersiniz?</label>
        <div className="flex flex-wrap gap-2">
          {TIMELINES.map((t) => (
            <label key={t} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${timeline === t ? "border-[#00D084] bg-[#F0FDF9] text-[#00875A]" : "border-[#E8EEF0] bg-white text-[#64748B] hover:bg-slate-50"}`}>
              <input type="radio" name="timeline" checked={timeline === t} onChange={() => setTimeline(t)} className="hidden" />
              {t}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className={LABEL}>İlgilendiğiniz Hizmetler</label>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <label key={s} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${services.includes(s) ? "border-[#00D084] bg-[#F0FDF9] text-[#00875A]" : "border-[#E8EEF0] bg-white text-[#64748B] hover:bg-slate-50"}`}>
              <input type="checkbox" checked={services.includes(s)} onChange={() => toggleService(s)} className="hidden" />
              {s}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className={LABEL}>Eklemek İstedikleriniz</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={`${INPUT} resize-none`} placeholder="İhtiyacınızla ilgili detay verin..." />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(15,23,42,0.25)] transition-all hover:bg-[#1E293B] disabled:opacity-60"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {isPending ? "Gönderiliyor..." : "Danışmanlık Talebi Gönder"}
      </button>
    </form>
  );
}

export default function LeadContactForm() {
  const [tab, setTab] = useState<"quick" | "consulting">("quick");

  return (
    <div className="rounded-2xl border border-[#E8EEF0] bg-white p-6 sm:p-8">
      <div className="mb-6 flex gap-2 rounded-xl bg-[#FAFCFC] p-1">
        <button
          onClick={() => setTab("quick")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${tab === "quick" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"}`}
        >
          Hızlı Mesaj
        </button>
        <button
          onClick={() => setTab("consulting")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${tab === "consulting" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"}`}
        >
          Detaylı Danışmanlık Talebi
        </button>
      </div>
      {tab === "quick" ? <QuickMessageForm /> : <ConsultingRequestForm />}
    </div>
  );
}
