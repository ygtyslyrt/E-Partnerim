"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Clock, ArrowRight, MessageCircle } from "lucide-react";
import { blogPosts, allCategories } from "@/data/blog-posts";

const WHATSAPP_URL = "https://wa.me/905451416118";

function CategoryBadge({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

export default function BlogPage() {
  const [active, setActive] = useState("Tümü");

  const filtered =
    active === "Tümü" ? blogPosts : blogPosts.filter((p) => p.category === active);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Blog" }]}
        badge="Sektör Rehberleri"
        title="Blog"
        subtitle="E-ticaret, dijital pazarlama ve KOBİ büyüme stratejileri üzerine tarafsız içerikler."
      />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── Filtre Sekmeleri ─────────────────────────── */}
          <div className="mb-10 flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  active === cat
                    ? "bg-[#0F172A] text-white shadow-[0_2px_12px_rgba(15,23,42,0.2)]"
                    : "border border-[#E8EEF0] bg-white text-[#64748B] hover:border-[#0F172A]/20 hover:text-[#0F172A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Yazı Grid'i ──────────────────────────────── */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <article className="flex h-full flex-col rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00D084]/25 hover:shadow-md">
                    {/* Dekoratif üst alan */}
                    <div
                      className="mb-5 h-28 w-full rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${post.categoryBg} 0%, rgba(255,255,255,0) 100%)`,
                        borderBottom: `2px solid ${post.categoryColor}18`,
                      }}
                    >
                      <div className="flex h-full items-center justify-center">
                        <div
                          className="rounded-xl px-4 py-2"
                          style={{ backgroundColor: `${post.categoryColor}15` }}
                        >
                          <span
                            className="text-2xl font-black opacity-20"
                            style={{ color: post.categoryColor }}
                          >
                            {post.category.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <CategoryBadge
                      label={post.category}
                      color={post.categoryColor}
                      bg={post.categoryBg}
                    />

                    <h2 className="mt-3 text-base font-bold leading-snug text-[#0F172A] group-hover:text-[#00D084] transition-colors line-clamp-3 flex-1">
                      {post.title}
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-[#64748B] line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                        <span>{post.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} okuma
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#00D084]">
                        Oku
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-[#94A3B8]">Bu kategoride henüz yazı yok.</p>
            </div>
          )}

          {/* ── Alt Bilgi ─────────────────────────────────── */}
          <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                Aradığınız konuyu bulamadınız mı?
              </p>
              <p className="mt-1 text-sm text-[#64748B]">
                Merak ettiğiniz her konuda bize doğrudan sorabilirsiniz.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#00D084] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(0,208,132,0.3)] transition-all hover:bg-[#00bb76] active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp&apos;ta Sor
            </a>
          </div>

        </div>
      </section>
    </>
  );
}
