"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { categoryStyle } from "@/lib/category-color";
import type { BlogPost, BlogCategory, BlogSectionConfig } from "@prisma/client";

type PostWithCategory = BlogPost & { category: BlogCategory | null };

interface Props {
  config: BlogSectionConfig;
  posts: PostWithCategory[];
}

function CategoryBadge({ label }: { label: string }) {
  const { color, bg } = categoryStyle(label);
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function Blog({ config, posts }: Props) {
  if (posts.length === 0) return null;

  const [featured, ...secondary] = posts;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 flex items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
              Blog
            </p>
            {config.title && (
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
                {config.title}
              </h2>
            )}
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D084] hover:underline underline-offset-4 flex-shrink-0"
          >
            Tüm Yazıları Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* ── Öne Çıkan Makale ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <Link href={`/blog/${featured.slug}`} className="group block h-full">
              <div className="flex h-full flex-col rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#00D084]/25 hover:shadow-md">
                {featured.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featured.coverImage} alt={featured.title} className="mb-6 h-40 w-full rounded-xl object-cover" />
                ) : (
                  <div
                    className="mb-6 h-40 w-full rounded-xl"
                    style={{ background: "linear-gradient(135deg, rgba(0,208,132,0.08) 0%, rgba(24,175,193,0.08) 100%)" }}
                  />
                )}

                {featured.category && <CategoryBadge label={featured.category.name} />}
                <h3 className="mt-3 text-xl font-bold leading-snug text-[#0F172A] group-hover:text-[#00D084] transition-colors">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#64748B]">
                    {featured.excerpt}
                  </p>
                )}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                    <span>{formatDate(featured.publishedAt)}</span>
                    {featured.readTime && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {featured.readTime} dk okuma
                        </span>
                      </>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#00D084]">
                    Okumaya Devam Et
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ── Yan Makaleler ─────────────────────────── */}
          <div className="flex flex-col gap-4">
            {secondary.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="flex flex-col rounded-2xl border border-[#E8EEF0] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00D084]/25 hover:shadow-sm">
                    {post.category && <CategoryBadge label={post.category.name} />}
                    <h3 className="mt-2.5 text-sm font-bold leading-snug text-[#0F172A] group-hover:text-[#00D084] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#94A3B8]">
                      <span>{formatDate(post.publishedAt)}</span>
                      {post.readTime && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime} dk
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobil "Tümünü Gör" */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D084] hover:underline underline-offset-4"
          >
            Tüm Yazıları Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
