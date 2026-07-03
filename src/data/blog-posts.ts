// TODO: CMS entegrasyonu sonrası buradan kaldırılacak

export interface BlogPost {
  slug: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "looker-studio-ucretsiz-raporlama",
    category: "Dijital Pazarlama",
    categoryColor: "#3B82F6",
    categoryBg: "#EFF6FF",
    title: "Dijital Pazarlamada Looker Studio ile Ücretsiz Raporlama Nasıl Yapılır?",
    excerpt:
      "Google'ın ücretsiz veri görselleştirme aracı Looker Studio ile pazarlama verilerinizi anlamlı raporlara dönüştürün. Adım adım kurulum rehberi.",
    date: "23 Temmuz 2025",
    readTime: "6 dk",
    featured: true,
  },
  {
    slug: "yapay-zeka-icerik-uretimi",
    category: "Yapay Zeka",
    categoryColor: "#7C3AED",
    categoryBg: "#F5F3FF",
    title: "Yapay Zeka ile İçerik Üretimi: Dijital Pazarlamada Yeni Dönem",
    excerpt:
      "AI destekli içerik üretim araçları işletmelere nasıl avantaj sağlıyor? Hangi araçlar işe yarıyor, hangilerinden kaçınmalısınız?",
    date: "23 Temmuz 2025",
    readTime: "5 dk",
    featured: false,
  },
  {
    slug: "kobi-2025-eticaret-rehberi",
    category: "E-Ticaret",
    categoryColor: "#00D084",
    categoryBg: "#F0FDF9",
    title: "Dijital Yol Arkadaşı Arayan KOBİ'ler İçin 2025 E-Ticaret Rehberi",
    excerpt:
      "2025'te e-ticarete başlayacak ya da altyapısını değiştirecek KOBİ'ler için kapsamlı rehber. Doğru adımlar, kaçınılacak hatalar.",
    date: "7 Mayıs 2025",
    readTime: "8 dk",
    featured: false,
  },
  {
    slug: "veri-odakli-pazarlama-stratejileri",
    category: "Pazarlama",
    categoryColor: "#F59E0B",
    categoryBg: "#FFFBEB",
    title: "E-Ticaretinizi 3 Kat Büyütecek Veri Odaklı Pazarlama Stratejileri",
    excerpt:
      "Veriye dayalı kararlarla satışlarınızı nasıl katlayabilirsiniz? Gerçek örnek analizler ve uygulanabilir stratejiler.",
    date: "7 Mayıs 2025",
    readTime: "7 dk",
    featured: false,
  },
];

export const allCategories = ["Tümü", ...Array.from(new Set(blogPosts.map((p) => p.category)))];
