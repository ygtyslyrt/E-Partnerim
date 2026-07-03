import { config } from "dotenv"
config({ path: ".env.local", override: true })

import {
  PrismaClient,
  Role,
  Status,
  PageType,
  SettingsGroup,
  NavLocation,
} from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seed başlıyor...")

  // ─── 1. Admin kullanıcı ────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("EPartnerim2024!", 12)

  const admin = await prisma.user.upsert({
    where: { email: "info@e-partnerim.com" },
    update: {},
    create: {
      email: "info@e-partnerim.com",
      name: "Admin",
      password: hashedPassword,
      role: Role.ADMIN,
      active: true,
    },
  })
  console.log(`✅ Admin kullanıcı: ${admin.email}`)

  // ─── 2. Ana Sayfa ──────────────────────────────────────────────
  const homepage = await prisma.page.upsert({
    where: { slug: "/" },
    update: {},
    create: {
      slug: "/",
      title: "Ana Sayfa",
      type: PageType.HOMEPAGE,
      status: Status.PUBLISHED,
      publishedAt: new Date(),
      seoTitle: "E-Partnerim — E-Ticaretin Dijital Ortağı",
      seoDesc:
        "50+ AI aracı ve uzman hizmetlerle KOBİ e-ticaret işletmenizi büyütün. Ücretsiz deneyin.",
      robots: "index,follow",
    },
  })
  console.log(`✅ Ana sayfa oluşturuldu: ${homepage.id}`)

  // ─── 3. Hero Bölümü ───────────────────────────────────────────
  const heroMeta = await prisma.pageSectionMeta.upsert({
    where: { pageId_sectionType: { pageId: homepage.id, sectionType: "hero" } },
    update: {},
    create: { pageId: homepage.id, sectionType: "hero", order: 0, visible: true },
  })

  await prisma.heroSectionContent.upsert({
    where: { sectionId: heroMeta.id },
    update: {},
    create: {
      sectionId: heroMeta.id,
      badge: "⚡ 10+ Yıllık Deneyim · %95 Başarı Oranı",
      title1: "İşletmenizin",
      title2: "Dijital Yol Arkadaşı.",
      gradient: "linear-gradient(90deg, #00D084 0%, #18AFC1 100%)",
      subtitle:
        "Partnerix işletmenizi analiz eder, ihtiyaçlarınızı belirler ve Türkiye'nin en doğru dijital çözüm ortaklarını ücretsiz olarak önerir.",
      bgType: "lavender",
      bgColor: "#F3F4FB",
      dotPattern: true,
    },
  })

  // ─── 4. Diğer Bölümler ────────────────────────────────────────
  const sections = [
    { type: "social-proof", order: 1 },
    { type: "services",     order: 2 },
    { type: "how-it-works", order: 3 },
    { type: "why-us",       order: 4 },
    { type: "blog",         order: 5 },
    { type: "cta",          order: 6 },
  ]

  for (const s of sections) {
    await prisma.pageSectionMeta.upsert({
      where: { pageId_sectionType: { pageId: homepage.id, sectionType: s.type } },
      update: {},
      create: { pageId: homepage.id, sectionType: s.type, order: s.order, visible: true },
    })
  }
  console.log("✅ Ana sayfa bölümleri oluşturuldu")

  // ─── 5. Partnerix Flow ────────────────────────────────────────
  const existingFlow = await prisma.partnerixFlow.findUnique({ where: { slug: "default" } })

  if (!existingFlow) {
    await prisma.partnerixFlow.create({
      data: {
        name: "Varsayılan Akış",
        slug: "default",
        active: true,
        welcomeMsg: "Size birkaç soru soracağım. Yaklaşık 2 dakikada işletmeniz için en doğru çözümü oluşturacağız.",
        bubbles: {
          create: [
            { text: "Merhaba! 👋 Ben Partnerix.", order: 0, delay: 0.3 },
            { text: "Size birkaç soru soracağım.", order: 1, delay: 0.7 },
            { text: "Yaklaşık 2 dakikada en doğru dijital çözümü bulacağız.", order: 2, delay: 1.2 },
          ],
        },
        steps: {
          create: [
            {
              question: "İşletmenizin faaliyet alanı nedir?",
              order: 0,
              options: {
                create: [
                  { label: "E-Ticaret",  value: "eticaret",  icon: "ShoppingCart",   color: "bg-[#EEF2FF] text-[#4F46E5]", order: 0 },
                  { label: "Hizmet",     value: "hizmet",    icon: "Megaphone",      color: "bg-[#ECFDF5] text-[#059669]", order: 1 },
                  { label: "Üretim",     value: "uretim",    icon: "Building2",      color: "bg-[#FFF7ED] text-[#F97316]", order: 2 },
                  { label: "Perakende",  value: "perakende", icon: "Gift",           color: "bg-[#EFF6FF] text-[#3B82F6]", order: 3 },
                  { label: "Diğer",      value: "diger",     icon: "MoreHorizontal", color: "bg-[#F8FAFC] text-[#94A3B8]", order: 4 },
                ],
              },
            },
            {
              question: "Aylık ortalama sipariş hacminiz?",
              order: 1,
              options: {
                create: [
                  { label: "0 – 100",      value: "0-100",   icon: "Package",    color: "bg-[#F0FDF4] text-[#22C55E]", order: 0 },
                  { label: "100 – 500",    value: "100-500", icon: "TrendingUp", color: "bg-[#EFF6FF] text-[#3B82F6]", order: 1 },
                  { label: "500 – 1.000",  value: "500-1k",  icon: "BarChart2",  color: "bg-[#FFF7ED] text-[#F97316]", order: 2 },
                  { label: "1.000+",       value: "1k+",     icon: "Rocket",     color: "bg-[#EEF2FF] text-[#4F46E5]", order: 3 },
                ],
              },
            },
            {
              question: "En çok hangi konuda desteğe ihtiyacınız var?",
              order: 2,
              options: {
                create: [
                  { label: "E-ticaret Altyapısı", value: "altyapi",     icon: "ShoppingCart", color: "bg-[#EEF2FF] text-[#4F46E5]", order: 0 },
                  { label: "Dijital Pazarlama",   value: "pazarlama",   icon: "Target",       color: "bg-[#FFF7ED] text-[#F97316]", order: 1 },
                  { label: "Entegrasyon",          value: "entegrasyon", icon: "Layers",       color: "bg-[#F0F9FF] text-[#0EA5E9]", order: 2 },
                  { label: "Büyüme Stratejisi",   value: "buyume",      icon: "BarChart2",    color: "bg-[#ECFDF5] text-[#059669]", order: 3 },
                ],
              },
            },
            {
              question: "Mevcut e-ticaret altyapınız nedir?",
              order: 3,
              options: {
                create: [
                  { label: "Henüz Yok",       value: "yok",   icon: "PlusCircle",  color: "bg-[#F0FDF4] text-[#22C55E]", order: 0 },
                  { label: "Hazır Platform",   value: "hazir", icon: "ShoppingCart", color: "bg-[#EFF6FF] text-[#3B82F6]", order: 1 },
                  { label: "Özel Yazılım",    value: "ozel",  icon: "Settings2",   color: "bg-[#EEF2FF] text-[#4F46E5]", order: 2 },
                  { label: "Geçiş Yapacağım", value: "gecis", icon: "TrendingUp",  color: "bg-[#FFF7ED] text-[#F97316]", order: 3 },
                ],
              },
            },
            {
              question: "Aylık dijital pazarlama bütçeniz?",
              order: 4,
              options: {
                create: [
                  { label: "0 – 5K ₺",    value: "0-5k",   icon: "CreditCard",  color: "bg-[#F0FDF4] text-[#22C55E]", order: 0 },
                  { label: "5K – 20K ₺",  value: "5k-20k", icon: "DollarSign",  color: "bg-[#EFF6FF] text-[#3B82F6]", order: 1 },
                  { label: "20K – 50K ₺", value: "20k-50k",icon: "Zap",         color: "bg-[#EEF2FF] text-[#4F46E5]", order: 2 },
                  { label: "50K+ ₺",      value: "50k+",   icon: "Target",      color: "bg-[#FFF7ED] text-[#F97316]", order: 3 },
                ],
              },
            },
            {
              question: "Ne zaman başlamayı planlıyorsunuz?",
              order: 5,
              options: {
                create: [
                  { label: "Hemen Şimdi",      value: "hemen",       icon: "Zap",          color: "bg-[#ECFDF5] text-[#059669]", order: 0 },
                  { label: "1 Ay İçinde",       value: "1ay",         icon: "Calendar",     color: "bg-[#EFF6FF] text-[#3B82F6]", order: 1 },
                  { label: "3 Ay İçinde",       value: "3ay",         icon: "CalendarDays", color: "bg-[#EEF2FF] text-[#4F46E5]", order: 2 },
                  { label: "Henüz Bilmiyorum",  value: "bilmiyorum",  icon: "Eye",          color: "bg-[#F8FAFC] text-[#94A3B8]", order: 3 },
                ],
              },
            },
          ],
        },
        results: {
          create: [
            {
              title: "Analiz Tamamlandı! 🎉",
              message: "Size özel dijital çözümler hazırlanıyor. WhatsApp üzerinden uzman ekibimizle iletişime geçin.",
              ctaText: "WhatsApp'ta Danışmanlık Al",
              ctaHref: "https://wa.me/905451416118",
              ctaType: "whatsapp",
            },
          ],
        },
      },
    })
    console.log("✅ Partnerix varsayılan akışı oluşturuldu")
  } else {
    console.log("ℹ️  Partnerix akışı zaten mevcut, atlandı")
  }

  // ─── 6. Site Ayarları ─────────────────────────────────────────
  const defaultSettings = [
    { key: "site_name",       value: "E-Partnerim",            group: SettingsGroup.GENERAL,   label: "Site Adı",             type: "text"  },
    { key: "site_tagline",    value: "E-Ticaretin Dijital Ortağı", group: SettingsGroup.GENERAL, label: "Slogan",               type: "text"  },
    { key: "site_url",        value: "https://e-partnerim.com", group: SettingsGroup.GENERAL,   label: "Site URL",             type: "url"   },
    { key: "email",           value: "info@e-partnerim.com",   group: SettingsGroup.CONTACT,   label: "E-posta",              type: "email" },
    { key: "phone",           value: "+90 545 141 61 18",      group: SettingsGroup.CONTACT,   label: "Telefon",              type: "text"  },
    { key: "whatsapp",        value: "905451416118",           group: SettingsGroup.CONTACT,   label: "WhatsApp Numarası",    type: "text"  },
    { key: "address",         value: "İstanbul, Türkiye",      group: SettingsGroup.CONTACT,   label: "Adres",                type: "text"  },
    { key: "instagram",       value: "",                        group: SettingsGroup.SOCIAL,    label: "Instagram URL",        type: "url"   },
    { key: "linkedin",        value: "",                        group: SettingsGroup.SOCIAL,    label: "LinkedIn URL",         type: "url"   },
    { key: "twitter",         value: "",                        group: SettingsGroup.SOCIAL,    label: "Twitter/X URL",        type: "url"   },
    { key: "ga_id",           value: "",                        group: SettingsGroup.ANALYTICS, label: "Google Analytics ID",  type: "text"  },
    { key: "meta_pixel_id",   value: "",                        group: SettingsGroup.ANALYTICS, label: "Meta Pixel ID",        type: "text"  },
    { key: "gtm_id",          value: "",                        group: SettingsGroup.ANALYTICS, label: "GTM ID",               type: "text"  },
    { key: "search_console",  value: "",                        group: SettingsGroup.ANALYTICS, label: "Search Console Key",   type: "text"  },
  ]

  for (const setting of defaultSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log("✅ Site ayarları oluşturuldu")

  // ─── 7. Header Menüsü ─────────────────────────────────────────
  const existingHeader = await prisma.navigation.findUnique({
    where: { location: NavLocation.HEADER },
  })

  if (!existingHeader) {
    await prisma.navigation.create({
      data: {
        location: NavLocation.HEADER,
        items: {
          create: [
            { label: "Platformlar",  href: "/platformlar",  order: 0 },
            { label: "Çözümler",    href: "/cozumler",     order: 1 },
            { label: "AI Araçları", href: "/ai-araclari",  order: 2 },
            { label: "Blog",         href: "/blog",         order: 3 },
            { label: "Hakkımızda",  href: "/hakkimizda",  order: 4 },
            { label: "İletişim",    href: "/iletisim",    order: 5 },
          ],
        },
      },
    })
    console.log("✅ Header menüsü oluşturuldu")
  }

  // ─── 8. Footer Menüleri ───────────────────────────────────────
  const footerCols = [
    {
      location: NavLocation.FOOTER_COL1,
      items: [
        { label: "Platformlar",  href: "/platformlar" },
        { label: "Çözümler",    href: "/cozumler"    },
        { label: "AI Araçları", href: "/ai-araclari" },
        { label: "Blog",         href: "/blog"        },
      ],
    },
    {
      location: NavLocation.FOOTER_COL2,
      items: [
        { label: "Hakkımızda",  href: "/hakkimizda" },
        { label: "İletişim",    href: "/iletisim"   },
        { label: "KVKK",         href: "/kvkk"       },
        { label: "Gizlilik",    href: "/gizlilik"   },
      ],
    },
  ] as const

  for (const col of footerCols) {
    const existing = await prisma.navigation.findUnique({ where: { location: col.location } })
    if (!existing) {
      await prisma.navigation.create({
        data: {
          location: col.location,
          items: {
            create: col.items.map((item, i) => ({ ...item, order: i })),
          },
        },
      })
    }
  }
  console.log("✅ Footer menüleri oluşturuldu")

  // ─── 9. Platformlar ──────────────────────────────────────────
  const PLATFORMS = [
    {
      name: "T-Soft", slug: "t-soft", category: "E-Ticaret", logoColor: "#E5510F", order: 0,
      shortDesc: "Türkiye'nin köklü e-ticaret altyapılarından biri. Güçlü B2B ve B2C özellikleriyle büyük ölçekli operasyonlara uygun.",
      description: "Orta-büyük ölçekli işletmeler, B2B ihtiyacı olanlar",
      features: ["Geniş entegrasyon seçenekleri", "Güçlü B2B modülü", "Özelleştirilebilir yapı"],
    },
    {
      name: "İdeasoft", slug: "ideasoft", category: "E-Ticaret", logoColor: "#3AAA35", order: 1,
      shortDesc: "Hızlı kurulum ve güçlü SEO altyapısıyla öne çıkan platform. KOBİ'lerin organik büyüme hedefleri için uygun.",
      description: "KOBİ'ler, SEO odaklı büyümek isteyenler",
      features: ["Hızlı kurulum süreci", "Güçlü SEO araçları", "Uygun maliyet yapısı"],
    },
    {
      name: "İkas", slug: "ikas", category: "E-Ticaret", logoColor: "#0F172A", order: 2,
      shortDesc: "Modern tasarım anlayışı ve mobil öncelikli mimarisiyle yeni nesil e-ticaret deneyimi sunan platform.",
      description: "Yeni başlayanlar, marka odaklı işletmeler",
      features: ["Modern, temiz arayüz", "Mobil öncelikli mimari", "Hızlı mağaza açma"],
    },
    {
      name: "Ticimax", slug: "ticimax", category: "E-Ticaret", logoColor: "#F7941D", order: 3,
      shortDesc: "Çok kanallı satış ve güçlü stok yönetimi sunan platform. Geniş ürün portföyüne sahip işletmeler için geliştirilmiş.",
      description: "Çok kanallı satış yapanlar, geniş portföy sahipleri",
      features: ["Güçlü stok & sipariş yönetimi", "Çok kanallı satış desteği", "ERP entegrasyonu"],
    },
    {
      name: "Meta Ads", slug: "meta-ads", category: "Pazarlama", logoColor: "#0082FB", order: 4,
      shortDesc: "Facebook ve Instagram reklam platformu. Görsel ürünler için yüksek dönüşüm sağlayan geniş kitle hedefleme imkânı.",
      description: "B2C markalar, görsel ürün satıcıları",
      features: ["Detaylı kitle hedefleme", "Görsel & video reklam formatları", "Güçlü retargeting"],
    },
    {
      name: "Google Ads", slug: "google-ads", category: "Pazarlama", logoColor: "#4285F4", order: 5,
      shortDesc: "Arama ve alışveriş reklamlarıyla aktif satın alma niyetine sahip kullanıcılara ulaşın. Ölçülebilir ROI.",
      description: "Satın alma niyetli kitleye ulaşmak isteyenler",
      features: ["Aktif arama trafiği", "Google Alışveriş entegrasyonu", "Ölçülebilir, şeffaf ROI"],
    },
    {
      name: "PayTR", slug: "paytr", category: "Ödeme", logoColor: "#1A355E", order: 6,
      shortDesc: "Türkiye'nin yaygın sanal POS çözümlerinden biri. Kolay entegrasyon ve taksit seçenekleriyle e-ticarette güvenli ödeme.",
      description: "E-ticaret siteleri, taksitli satış yapanlar",
      features: ["Kolay platform entegrasyonu", "Taksit seçenekleri", "Güvenli ödeme altyapısı"],
    },
    {
      name: "Entegra", slug: "entegra", category: "Ödeme", logoColor: "#0096D6", order: 7,
      shortDesc: "Çok banka destekli sanal POS ve ödeme çözümleri. Rekabetçi komisyon oranları ve hızlı başvuru süreci.",
      description: "Komisyon maliyetini düşürmek isteyen işletmeler",
      features: ["Çok banka desteği", "Rekabetçi komisyon oranı", "Hızlı onay süreci"],
    },
    {
      name: "Logo Yazılım", slug: "logo-yazilim", category: "Muhasebe", logoColor: "#E31E25", order: 8,
      shortDesc: "Türkiye'nin köklü ERP ve muhasebe yazılımı. Geniş modül yapısı ve yaygın kullanımıyla orta-büyük ölçekli işletmeler için.",
      description: "Orta-büyük ölçekli işletmeler, ERP arayanlar",
      features: ["Geniş ERP modül yapısı", "E-fatura entegrasyonu", "Yaygın muhasebeci desteği"],
    },
    {
      name: "Uyumsoft", slug: "uyumsoft", category: "Muhasebe", logoColor: "#E5851D", order: 9,
      shortDesc: "E-ticaret odaklı muhasebe ve ERP çözümü. Online satış kanallarıyla güçlü entegrasyon ve kolay kullanım.",
      description: "E-ticaret işletmeleri, küçük-orta ölçekli",
      features: ["E-ticaret entegrasyonu", "Kolay kullanım arayüzü", "Uygun maliyet yapısı"],
    },
    {
      name: "Kobikom", slug: "kobikom", category: "Muhasebe", logoColor: "#003D7C", order: 10,
      shortDesc: "KOBİ'lere özel bulut tabanlı iş yönetimi yazılımı. Teknik bilgi gerektirmeden muhasebe ve stok takibi.",
      description: "KOBİ'ler, başlangıç aşamasındaki işletmeler",
      features: ["Bulut tabanlı, her yerden erişim", "KOBİ dostu basit arayüz", "Uygun başlangıç maliyeti"],
    },
    {
      name: "Sentoz", slug: "sentoz", category: "Muhasebe", logoColor: "#2563EB", order: 11,
      shortDesc: "Muhasebe ve finans yönetimini sadeleştiren yazılım. Vergi uyumu ve raporlama süreçleri için pratik çözüm.",
      description: "Muhasebe süreçlerini sadeleştirmek isteyenler",
      features: ["Kolay muhasebe takibi", "Vergi uyumu & beyanname", "Gelir/gider raporlama"],
    },
  ]

  for (const { features, ...data } of PLATFORMS) {
    const existing = await prisma.platform.findUnique({ where: { slug: data.slug } })
    if (existing) {
      await prisma.platformFeature.deleteMany({ where: { platformId: existing.id } })
      await prisma.platform.update({
        where: { slug: data.slug },
        data: {
          ...data,
          status: Status.PUBLISHED,
          features: { create: features.map((text, i) => ({ type: "ADVANTAGE", text, order: i })) },
        },
      })
    } else {
      await prisma.platform.create({
        data: {
          ...data,
          status: Status.PUBLISHED,
          features: { create: features.map((text, i) => ({ type: "ADVANTAGE", text, order: i })) },
        },
      })
    }
  }
  console.log(`✅ ${PLATFORMS.length} platform oluşturuldu/güncellendi`)

  // ─── 10. Çözümler ────────────────────────────────────────────────
  const SOLUTIONS = [
    {
      title: "İhtiyaç Analizi & Danışmanlık",
      slug: "ihtiyac-analizi",
      icon: "MessageSquare",
      color: "#00D084",
      category: "Danışmanlık",
      order: 0,
      shortDesc: "Nereden başlayacağınızı bilmiyorsanız buradan başlayın. İşletmenizin ihtiyaçlarını birlikte analiz eder, doğru yöne yönlendiririz.",
      content: "E-ticarete yeni mi başlıyorsunuz? Mevcut altyapınızı değiştirmeyi mi düşünüyorsunuz? Hangi adımı atacağından emin olmayan her işletme için ilk durağız.",
      ctaLabel: "Ücretsiz İhtiyaç Analizi Al",
      ctaUrl: "https://wa.me/905451416118",
      features: [
        "Mevcut durum değerlendirmesi",
        "Rakip & pazar analizi",
        "Bütçe ve öncelik planlaması",
        "Platform / ajans seçimi rehberliği",
        "Bağlayıcı sözleşme yok",
        "Tamamen ücretsiz",
      ],
    },
    {
      title: "E-Ticaret Altyapısı Seçimi",
      slug: "eticaret-altyapisi",
      icon: "Store",
      color: "#18AFC1",
      category: "Altyapı",
      order: 1,
      shortDesc: "T-Soft mu, İkas mı, İdeasoft mu? Yanlış altyapı seçimi yıllarca süren zaman ve para kaybına yol açabilir.",
      content: "Hangi platformun sizin için doğru olduğunu tarafsız biçimde değerlendiriyoruz. Kendi komisyon çıkarımız değil, sizin ihtiyacınız önce gelir. Değerlendirme sonunda sizi doğrudan ilgili altyapı firmasıyla buluşturuyoruz.",
      ctaLabel: "Altyapı Seçimi Danışmanlığı Al",
      ctaUrl: "https://wa.me/905451416118",
      ctaLabel2: "Platformları Karşılaştır",
      ctaUrl2: "/platformlar",
      features: [
        "Ürün hacmi & büyüme planı analizi",
        "B2B / B2C ihtiyaç değerlendirmesi",
        "SEO & reklam önceliği belirleme",
        "Entegrasyon gereksinimlerinin tespiti",
        "Tarafsız platform önerisi",
      ],
    },
    {
      title: "Marka Tescil Rehberliği",
      slug: "marka-tescil",
      icon: "ShieldCheck",
      color: "#059669",
      category: "Hukuk",
      order: 2,
      shortDesc: "TÜRKPATENT sürecini adım adım anlıyoruz. Sizi alanında uzman bir marka vekiline yönlendiriyoruz.",
      content: "Tescilsiz bir marka, rakibiniz tarafından tescil ettirilebilir. E-ticarete başlamadan önce marka adınızı güvence altına alın. Tescil işlemini biz yapmıyoruz — ama sizi doğru uzmana bağlamak bizim işimiz.",
      ctaLabel: "Marka Tescil Rehberliği İçin Yazın",
      ctaUrl: "https://wa.me/905451416118",
      features: [
        "TÜRKPATENT benzerlik araştırması",
        "Başvuru hazırlık rehberliği",
        "Sınıf seçimi danışmanlığı",
        "Uzman marka vekiline yönlendirme",
        "Süreç takibi bilgilendirmesi",
      ],
    },
    {
      title: "Dijital Pazarlama Partneri",
      slug: "dijital-pazarlama",
      icon: "Megaphone",
      color: "#2563EB",
      category: "Pazarlama",
      order: 3,
      shortDesc: "Meta mı, Google mı? Hangi ajansla çalışmalısınız? Her işletmenin ihtiyacı farklıdır.",
      content: "Aylık bütçenizi, hedef kitlenizi ve ürün kategorinizi dinleyerek hangi kanalın ve hangi ajansın size uygun olduğunu belirliyoruz. Ajans yönetimini biz yapmıyoruz — ama yanlış ajansa para vermeden önce doğru seçimi yapmanıza yardımcı oluyoruz.",
      ctaLabel: "Pazarlama Partneri Danışmanlığı Al",
      ctaUrl: "https://wa.me/905451416118",
      ctaLabel2: "Pazarlama Platformlarını İncele",
      ctaUrl2: "/platformlar",
      features: [
        "Meta Ads (Facebook & Instagram)",
        "Google Ads & Alışveriş reklamları",
        "SEO stratejisi & organik büyüme",
        "Looker Studio raporlama kurulumu",
        "Bütçeye uygun ajans eşleştirmesi",
      ],
    },
  ]

  for (const { features, ctaLabel, ctaUrl, ctaLabel2, ctaUrl2, ...data } of SOLUTIONS) {
    const existing = await prisma.solution.findUnique({ where: { slug: data.slug } })
    if (existing) {
      await prisma.solutionFeature.deleteMany({ where: { solutionId: existing.id } })
      await prisma.solution.update({
        where: { slug: data.slug },
        data: {
          ...data,
          status: Status.PUBLISHED,
          ctaLabel: ctaLabel ?? null,
          ctaUrl: ctaUrl ?? null,
          ctaLabel2: ctaLabel2 ?? null,
          ctaUrl2: ctaUrl2 ?? null,
          features: { create: features.map((text, i) => ({ type: "ADVANTAGE", text, order: i })) },
        },
      })
    } else {
      await prisma.solution.create({
        data: {
          ...data,
          status: Status.PUBLISHED,
          ctaLabel: ctaLabel ?? null,
          ctaUrl: ctaUrl ?? null,
          ctaLabel2: ctaLabel2 ?? null,
          ctaUrl2: ctaUrl2 ?? null,
          features: { create: features.map((text, i) => ({ type: "ADVANTAGE", text, order: i })) },
        },
      })
    }
  }
  console.log(`✅ ${SOLUTIONS.length} çözüm oluşturuldu/güncellendi`)

  console.log("\n🎉 Seed tamamlandı!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`👤 Admin e-posta : info@e-partnerim.com`)
  console.log(`🔑 Admin şifre  : EPartnerim2024!`)
  console.log(`🌐 Panel URL    : /panel`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
