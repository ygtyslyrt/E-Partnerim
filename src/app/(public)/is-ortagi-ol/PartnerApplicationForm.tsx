"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { createPartnerApplication } from "@/lib/actions/partner-applications";

const CATEGORIES = ["Ajans", "Danışmanlık Firması", "Freelancer", "Yazılım Firması", "Diğer"];

const INPUT = "w-full rounded-xl border border-[#E4E9F2] bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition";
const LABEL = "mb-1.5 block text-sm font-medium text-[#334155]";

interface Props {
  platforms: { id: string; name: string }[];
  solutions: { id: string; title: string }[];
}

export default function PartnerApplicationForm({ platforms, solutions }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [message, setMessage] = useState("");
  const [platformIds, setPlatformIds] = useState<string[]>([]);
  const [solutionIds, setSolutionIds] = useState<string[]>([]);

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim()) {
      setError("Firma adı, iletişim kişisi ve e-posta zorunludur");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createPartnerApplication({
        companyName, contactName, email,
        phone: phone || undefined, website: website || undefined,
        category: category || undefined, shortDesc: shortDesc || undefined, message: message || undefined,
        interestedPlatformIds: platformIds.length ? platformIds : undefined,
        interestedSolutionIds: solutionIds.length ? solutionIds : undefined,
      });
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? "Başvuru gönderilemedi");
      }
    });
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[#00D084]/20 bg-[#F0FDF9] p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#00D084]" />
        <h2 className="text-xl font-bold text-[#0F172A]">Başvurunuz Alındı</h2>
        <p className="mt-2 text-sm text-[#64748B]">
          Ekibimiz başvurunuzu inceleyip en kısa sürede sizinle iletişime geçecek.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Firma Adı *</label>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={INPUT} placeholder="ör. Dijital Ajans A.Ş." />
        </div>
        <div>
          <label className={LABEL}>İletişim Kişisi *</label>
          <input value={contactName} onChange={(e) => setContactName(e.target.value)} className={INPUT} placeholder="Ad Soyad" />
        </div>
        <div>
          <label className={LABEL}>E-posta *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Telefon</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Web Sitesi</label>
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={INPUT} placeholder="https://..." />
        </div>
        <div>
          <label className={LABEL}>Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={INPUT}>
            <option value="">Seçin...</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL}>Kısa Açıklama</label>
        <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={2} className={`${INPUT} resize-none`} placeholder="Firmanız hakkında 1-2 cümle..." />
      </div>

      <div>
        <label className={LABEL}>Mesajınız</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className={`${INPUT} resize-none`} placeholder="Neden E-Partnerim iş ortağı olmak istiyorsunuz?" />
      </div>

      {platforms.length > 0 && (
        <div>
          <label className={LABEL}>Uzman Olduğunuz Platformlar</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <label key={p.id} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${platformIds.includes(p.id) ? "border-[#3730A3] bg-[#EEF2FF] text-[#3730A3]" : "border-[#E4E9F2] bg-white text-[#64748B] hover:bg-slate-50"}`}>
                <input type="checkbox" checked={platformIds.includes(p.id)} onChange={() => toggle(platformIds, setPlatformIds, p.id)} className="hidden" />
                {p.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {solutions.length > 0 && (
        <div>
          <label className={LABEL}>Uzman Olduğunuz Çözümler</label>
          <div className="flex flex-wrap gap-2">
            {solutions.map((s) => (
              <label key={s.id} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${solutionIds.includes(s.id) ? "border-[#3730A3] bg-[#EEF2FF] text-[#3730A3]" : "border-[#E4E9F2] bg-white text-[#64748B] hover:bg-slate-50"}`}>
                <input type="checkbox" checked={solutionIds.includes(s.id)} onChange={() => toggle(solutionIds, setSolutionIds, s.id)} className="hidden" />
                {s.title}
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3730A3] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(55,48,163,0.35)] transition-all hover:bg-[#312e81] disabled:opacity-60"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {isPending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </button>
    </form>
  );
}
