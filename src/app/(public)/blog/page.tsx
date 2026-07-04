import PageHero from "@/components/layout/PageHero";
import BlogListClient from "./BlogListClient";
import { getPublishedBlogPosts, getCategories } from "@/lib/actions/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — E-Partnerim",
  description: "E-ticaret, dijital pazarlama ve KOBİ büyüme stratejileri üzerine tarafsız içerikler.",
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getPublishedBlogPosts(100),
    getCategories(),
  ]);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Blog" }]}
        badge="Sektör Rehberleri"
        title="Blog"
        subtitle="E-ticaret, dijital pazarlama ve KOBİ büyüme stratejileri üzerine tarafsız içerikler."
      />
      <BlogListClient posts={posts} categories={categories} />
    </>
  );
}
