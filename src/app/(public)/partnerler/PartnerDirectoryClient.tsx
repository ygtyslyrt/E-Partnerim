"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, Star, MapPin } from "lucide-react";
import type { Partner } from "@prisma/client";

type PartnerCard = Partner & {
  platforms: { platformId: string; platform: { id: string; name: string; slug: string } }[];
  solutions: { solutionId: string; solution: { id: string; title: string; slug: string } }[];
};

interface Props {
  partners: PartnerCard[];
  platforms: { id: string; name: string }[];
  solutions: { id: string; title: string }[];
  categories: string[];
}

export default function PartnerDirectoryClient({ partners, platforms, solutions, categories }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [platformId, setPlatformId] = useState<string | null>(null);
  const [solutionId, setSolutionId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (search && !`${p.name} ${p.shortDesc ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && p.category !== category) return false;
      if (platformId && !p.platforms.some((pp) => pp.platformId === platformId)) return false;
      if (solutionId && !p.solutions.some((ps) => ps.solutionId === solutionId)) return false;
      return true;
    });
  }, [partners, search, category, platformId, solutionId]);

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-8 space-y-3">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İş ortağı ara..."
            className="w-full rounded-xl border border-[#E4E9F2] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${!category ? "bg-[#0F172A] text-white" : "border border-[#E4E9F2] bg-white text-[#64748B] hover:bg-slate-50"}`}
          >
            Tüm Kategoriler
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory((cur) => (cur === c ? null : c))}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${category === c ? "bg-[#0F172A] text-white" : "border border-[#E4E9F2] bg-white text-[#64748B] hover:bg-slate-50"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {(platforms.length > 0 || solutions.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatformId((cur) => (cur === p.id ? null : p.id))}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${platformId === p.id ? "border-[#00D084] bg-[#F0FDF9] text-[#00D084]" : "border-[#E4E9F2] bg-white text-[#94A3B8] hover:bg-slate-50"}`}
              >
                {p.name}
              </button>
            ))}
            {solutions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSolutionId((cur) => (cur === s.id ? null : s.id))}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${solutionId === s.id ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E4E9F2] bg-white text-[#94A3B8] hover:bg-slate-50"}`}
              >
                {s.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E4E9F2] py-20 text-center text-sm text-[#94A3B8]">
          Bu kriterlere uygun iş ortağı bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link key={p.id} href={`/partnerler/${p.slug}`} className="group block h-full">
              <article className="flex h-full flex-col rounded-2xl border border-[#E4E9F2] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3730A3]/25 hover:shadow-md">
                <div className="flex items-center gap-3">
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt={p.name} className="h-11 w-11 rounded-lg object-contain" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#3730A3] text-sm font-bold text-white">
                      {p.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-bold text-[#0F172A] group-hover:text-[#3730A3] transition-colors">{p.name}</h3>
                      {p.verified && <ShieldCheck size={14} className="shrink-0 text-[#00D084]" />}
                      {p.featured && <Star size={13} className="shrink-0 fill-amber-400 text-amber-400" />}
                    </div>
                    {p.city && (
                      <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                        <MapPin size={11} /> {p.city}
                      </span>
                    )}
                  </div>
                </div>

                {p.tagline && <p className="mt-3 text-xs font-medium text-[#3730A3]">{p.tagline}</p>}
                {p.shortDesc && <p className="mt-2 text-sm leading-relaxed text-[#64748B] line-clamp-3">{p.shortDesc}</p>}

                {(p.platforms.length > 0 || p.solutions.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.platforms.slice(0, 3).map((pp) => (
                      <span key={pp.platformId} className="rounded-full bg-[#F0FDF9] px-2 py-0.5 text-[10px] font-medium text-[#00D084]">{pp.platform.name}</span>
                    ))}
                    {p.solutions.slice(0, 2).map((ps) => (
                      <span key={ps.solutionId} className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-medium text-[#4F46E5]">{ps.solution.title}</span>
                    ))}
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
