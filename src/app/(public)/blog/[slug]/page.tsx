import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import PageHero from "@/components/layout/PageHero";
import CTASection from "@/components/sections/CTASection";
import { Clock } from "lucide-react";
import { categoryStyle } from "@/lib/category-color";
import { getBlogPost } from "@/lib/actions/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Yazı Bulunamadı — E-Partnerim" };
  return {
    title: post.seoTitle || `${post.title} — E-Partnerim Blog`,
    description: post.seoDesc || post.excerpt || undefined,
  };
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const style = categoryStyle(post.category?.name ?? "Genel");

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
        badge={post.category?.name}
        title={post.title}
        subtitle={post.excerpt ?? undefined}
      />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[#94A3B8]">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            {post.readTime && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime} dk okuma
                </span>
              </>
            )}
          </div>

          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt={post.title} className="mb-10 h-72 w-full rounded-2xl object-cover" />
          )}

          <div className="space-y-4 text-[15px] leading-relaxed text-[#334155] [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0F172A] [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0F172A] [&_a]:text-[#00D084] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_p]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#00D084]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#64748B] [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:text-slate-100 [&_img]:rounded-xl [&_strong]:font-semibold [&_strong]:text-[#0F172A]">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-[#E8EEF0] pt-6">
              {post.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ color: style.color, backgroundColor: style.bg }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
