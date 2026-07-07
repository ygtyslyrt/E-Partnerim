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

  // ─── 2b. Diğer yönetilebilir sayfalar (SEO amaçlı) ─────────────
  const managedPages = [
    { slug: "/blog", title: "Blog", seoTitle: "Blog — E-Partnerim", seoDesc: "E-ticaret, dijital pazarlama ve KOBİ büyüme stratejileri üzerine tarafsız içerikler." },
    { slug: "/platformlar", title: "Platformlar", seoTitle: "Platformlar — E-Partnerim", seoDesc: "Türkiye'nin önde gelen e-ticaret altyapılarını, entegrasyon araçlarını ve iş yazılımlarını tarafsız biçimde değerlendiriyoruz." },
    { slug: "/cozumler", title: "Çözümler", seoTitle: "Çözümler — E-Partnerim", seoDesc: "Hangi e-ticaret altyapısını seçmeli, dijital pazarlamayı nasıl yönetmeli? Ücretsiz rehberlik ve doğru partnere yönlendirme." },
    { slug: "/partnerler", title: "Partnerler", seoTitle: "İş Ortaklarımız — E-Partnerim", seoDesc: "Doğrulanmış, uzman e-ticaret ajansları, danışmanlar ve hizmet sağlayıcıları." },
    { slug: "/partnerix", title: "Partnerix", seoTitle: "Partnerix — E-Partnerim", seoDesc: "Yapay zeka destekli ihtiyaç analizi ile işletmeniz için en doğru dijital çözüm ortaklarını bulun." },
    { slug: "/iletisim", title: "İletişim", seoTitle: "İletişim — E-Partnerim", seoDesc: "E-Partnerim ile iletişime geçin. WhatsApp, telefon veya e-posta ile ulaşabilirsiniz." },
  ]
  for (const p of managedPages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug, title: p.title, type: PageType.STANDARD, status: Status.PUBLISHED,
        publishedAt: new Date(), seoTitle: p.seoTitle, seoDesc: p.seoDesc, robots: "index,follow",
      },
    })
  }
  console.log("✅ Yönetilebilir sayfalar (Blog, Platformlar, Çözümler, Partnerler, Partnerix, İletişim) oluşturuldu")

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
      showPartnerixDemo: true,
      partnerixMessage: "Merhaba! 👋 Ben Partnerix.",
    },
  })

  // ─── 4. Diğer Bölümler ────────────────────────────────────────
  // Sıra: Hero, Platformlar, Çözümler, Referanslar, Hizmetler, Nasıl Çalışır, Neden Biz, Blog Önizleme, CTA
  const sectionOrder: Record<string, number> = {
    hero: 0,
    platforms: 1,
    solutions: 2,
    "social-proof": 3,
    services: 4,
    "how-it-works": 5,
    "why-us": 6,
    blog: 7,
    cta: 8,
  }

  async function upsertSection(sectionType: string) {
    return prisma.pageSectionMeta.upsert({
      where: { pageId_sectionType: { pageId: homepage.id, sectionType } },
      update: { order: sectionOrder[sectionType] },
      create: { pageId: homepage.id, sectionType, order: sectionOrder[sectionType], visible: true },
    })
  }
  await prisma.pageSectionMeta.update({ where: { id: heroMeta.id }, data: { order: sectionOrder.hero } })

  // Platformlar (öne çıkanları gösterir)
  const platformsMeta = await upsertSection("platforms")
  await prisma.platformsSectionConfig.upsert({
    where: { sectionId: platformsMeta.id },
    update: {},
    create: {
      sectionId: platformsMeta.id,
      title: "Öne Çıkan Platformlar",
      subtitle: "Türkiye'nin lider e-ticaret altyapıları ve iş ortaklarımız.",
      showCount: 6,
    },
  })

  // Çözümler (öne çıkanları gösterir)
  const solutionsMeta = await upsertSection("solutions")
  await prisma.solutionsSectionConfig.upsert({
    where: { sectionId: solutionsMeta.id },
    update: {},
    create: {
      sectionId: solutionsMeta.id,
      title: "Öne Çıkan Çözümler",
      subtitle: "İhtiyacınıza en uygun danışmanlık ve hizmet çözümlerimiz.",
      showCount: 4,
    },
  })

  // Referanslar (SocialProof)
  const socialProofMeta = await upsertSection("social-proof")
  const socialProof = await prisma.socialProofSectionContent.upsert({
    where: { sectionId: socialProofMeta.id },
    update: {},
    create: {
      sectionId: socialProofMeta.id,
      title: "Güçlü Ortaklıkların Desteğiyle",
      subtitle: "Türkiye'nin önde gelen e-ticaret, ödeme ve pazarlama platformları ile entegre çalışıyoruz",
    },
  })
  const existingLogos = await prisma.socialProofLogo.count({ where: { sectionId: socialProof.id } })
  if (existingLogos === 0) {
    await prisma.socialProofLogo.createMany({
      data: [
        { name: "T-Soft", color: "#E5510F", order: 0 },
        { name: "İdeasoft", color: "#3AAA35", order: 1 },
        { name: "İkas", color: "#0F172A", order: 2 },
        { name: "Ticimax", color: "#F7941D", order: 3 },
        { name: "Meta", color: "#0082FB", order: 4 },
        { name: "Google Ads", color: "#4285F4", order: 5 },
        { name: "Paytr", color: "#1A355E", order: 6 },
        { name: "Entegra", color: "#0096D6", order: 7 },
        { name: "Logo Yazılım", color: "#E31E25", order: 8 },
        { name: "Uyumsoft", color: "#E5851D", order: 9 },
        { name: "Kobikom", color: "#003D7C", order: 10 },
        { name: "Sentoz", color: "#2563EB", order: 11 },
      ].map((l) => ({ ...l, sectionId: socialProof.id })),
    })
  }
  const existingStats = await prisma.socialProofStat.count({ where: { sectionId: socialProof.id } })
  if (existingStats === 0) {
    await prisma.socialProofStat.createMany({
      data: [
        { value: "10+", label: "Yıllık Deneyim", order: 0, sectionId: socialProof.id },
        { value: "%95", label: "Müşteri Başarı Oranı", order: 1, sectionId: socialProof.id },
        { value: "4", label: "Temel Hizmet Kategorisi", order: 2, sectionId: socialProof.id },
      ],
    })
  }

  // Hizmetler (Services)
  const servicesMeta = await upsertSection("services")
  const services = await prisma.servicesSectionContent.upsert({
    where: { sectionId: servicesMeta.id },
    update: {},
    create: {
      sectionId: servicesMeta.id,
      title: "E-Ticaretinizin Her Adımında Yanınızdayız",
      subtitle: "Danışmanlıktan kuruluma, pazarlamadan marka tesciline — tek çatı altında.",
      ctaLabel: "Tüm hizmetlerimiz hakkında bilgi alın",
      ctaUrl: "https://wa.me/905451416118",
    },
  })
  const existingServiceItems = await prisma.serviceItem.count({ where: { servicesId: services.id } })
  if (existingServiceItems === 0) {
    await prisma.serviceItem.createMany({
      data: [
        {
          title: "Ne yapmanız gerektiğini net bir şekilde görün", description: "İhtiyacınızı analiz ediyor, size en uygun çözümü ücretsiz belirliyoruz. Bağlayıcı sözleşme yok.",
          icon: "MessageCircle", color: "#00D084", highlighted: true, statValue: "%85", statLabel: "2 haftada net yön belirleme", order: 0, servicesId: services.id,
        },
        {
          title: "Kurulum & Teknik Destek", description: "Teknik bilgi gerektirmeden sisteminizi kurun. Yayına hazır olana kadar her adımda yanınızdayız.",
          icon: "Cpu", color: "#00D084", statValue: "%90", statLabel: "30 gün içinde teknik aksaksız", order: 1, servicesId: services.id,
        },
        {
          title: "Marka Tescil", description: "Markanızı koruyun, rakiplerden önce tescil ettirin. Marka haklarınız güvende.",
          icon: "ShieldCheck", color: "#00D084", statValue: "%75", statLabel: "tescil sonrası güven artışı", order: 2, servicesId: services.id,
        },
        {
          title: "Dijital Pazarlama", description: "Verilerinizi anlamlı sonuçlara dönüştürüyoruz. Veri odaklı kampanyalar ve analizlerle satış stratejinizi güçlendiriyoruz.",
          icon: "BarChart2", color: "#00D084", statValue: "%88", statLabel: "ölçülebilir satış artışı", order: 3, servicesId: services.id,
        },
      ],
    })
  }

  // Nasıl Çalışır (HowItWorks)
  const howItWorksMeta = await upsertSection("how-it-works")
  const howItWorks = await prisma.howItWorksSectionContent.upsert({
    where: { sectionId: howItWorksMeta.id },
    update: {},
    create: {
      sectionId: howItWorksMeta.id,
      title: "3 Adımda Doğru Çözüme",
      subtitle: "Sizi satmaya değil, doğru kararı vermeye yönlendiriyoruz. Ücretsiz, tarafsız, sonuç odaklı.",
    },
  })
  const existingSteps = await prisma.howItWorksStep.count({ where: { sectionId: howItWorks.id } })
  if (existingSteps === 0) {
    await prisma.howItWorksStep.createMany({
      data: [
        { stepNo: 1, title: "Anlat", description: "İşletmenizin mevcut durumunu, hedeflerinizi ve dijital ihtiyaçlarınızı bizimle paylaşın. Hiçbir teknik bilgiye gerek yok.", icon: "MessageSquare", order: 0, sectionId: howItWorks.id },
        { stepNo: 2, title: "Analiz Et", description: "İhtiyaçlarınızı birlikte değerlendiriyoruz. Hangi çözümün, hangi altyapının, hangi partnerin size uygun olduğunu belirliyoruz.", icon: "ScanSearch", order: 1, sectionId: howItWorks.id },
        { stepNo: 3, title: "Yönlendir", description: "Size en uygun partner firmayı veya platformu tarafsız biçimde öneriyor, sizi doğrudan bağlantıya geçiriyoruz. Ücretsiz.", icon: "Handshake", highlighted: true, order: 2, sectionId: howItWorks.id },
      ],
    })
  }

  // Neden Biz (WhyUs)
  const whyUsMeta = await upsertSection("why-us")
  const whyUs = await prisma.whyUsSectionContent.upsert({
    where: { sectionId: whyUsMeta.id },
    update: {},
    create: {
      sectionId: whyUsMeta.id,
      title: "Satmıyoruz. En Doğru Çözümü Birlikte Buluyoruz.",
      description: "Tarafsız danışmanlık anlayışımızla önce ihtiyacınızı anlarız, sonra size en uygun platformu veya partneri ücretsiz olarak yönlendiririz.",
      stat1Value: "%95", stat1Label: "Müşteri Başarı Oranı",
      stat2Value: "10+", stat2Label: "Yıllık Deneyim",
      ctaLabel: "Ücretsiz Danışmanlık Al",
    },
  })
  const existingFeatures = await prisma.whyUsFeature.count({ where: { sectionId: whyUs.id } })
  if (existingFeatures === 0) {
    await prisma.whyUsFeature.createMany({
      data: [
        { title: "Güçlü Partner Ağı", description: "T-Soft, İkas, Meta ve Google gibi lider platformlarla ortaklığımız sayesinde en uygun bağlantıyı kuruyoruz.", icon: "Link2", order: 0, sectionId: whyUs.id },
        { title: "Tarafsız Rehberlik", description: "Size hiçbir şey satmıyoruz. Hangi çözümün doğru olduğunu tarafsız biçimde değerlendiriyoruz.", icon: "Award", order: 1, sectionId: whyUs.id },
        { title: "Mevcut Yapıya Uyum", description: "Sıfırdan başlamak zorunda değilsiniz. Mevcut altyapınıza en uygun çözümü birlikte buluyoruz.", icon: "Layers", order: 2, sectionId: whyUs.id },
        { title: "Veriye Dayalı Yönlendirme", description: "Sektör verilerine dayanan rehberlik ile tahmin değil, gerçek içgörüyle karar veriyorsunuz.", icon: "BarChart2", order: 3, sectionId: whyUs.id },
        { title: "Güvenilir Süreç", description: "10+ yıllık deneyim ve onlarca işletmeyle oluşturduğumuz kanıtlanmış yönlendirme süreci.", icon: "ShieldCheck", order: 4, sectionId: whyUs.id },
        { title: "Anında Erişim", description: "WhatsApp, telefon veya e-posta — sorularınızı hemen yanıtlıyor, sizi doğru yere bağlıyoruz.", icon: "MessageCircle", order: 5, sectionId: whyUs.id },
      ],
    })
  }

  // Blog Önizleme
  const blogMeta = await upsertSection("blog")
  await prisma.blogSectionConfig.upsert({
    where: { sectionId: blogMeta.id },
    update: {},
    create: { sectionId: blogMeta.id, title: "Sektörden Haberler ve İpuçları", subtitle: null, showCount: 4 },
  })

  // CTA
  const ctaMeta = await upsertSection("cta")
  await prisma.ctaSectionContent.upsert({
    where: { sectionId: ctaMeta.id },
    update: {},
    create: {
      sectionId: ctaMeta.id,
      eyebrow: "Ücretsiz · Tarafsız · Bağlayıcı Değil",
      title: "Dijital Yol Haritanızı Birlikte Oluşturalım.",
      subtitle: "Hangi altyapıyı seçmeli, hangi adımdan başlamalısınız? Bunu birlikte buluyoruz — ücretsiz, tarafsız, sonuç odaklı.",
      buttons: [
        { label: "Ücretsiz Danışmanlık Al", type: "whatsapp" },
        { label: "info@e-partnerim.com", type: "mail" },
      ],
      style: "default",
    },
  })

  console.log("✅ Ana sayfa bölümleri ve içerikleri oluşturuldu")

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
    { key: "address",         value: "Merkez Mah. Marmara Cad. Bekir Aşçı İş Merkezi No:10, Avcılar / İstanbul", group: SettingsGroup.CONTACT, label: "Adres", type: "text"  },
    { key: "instagram",       value: "https://www.instagram.com/e.partnerim", group: SettingsGroup.SOCIAL, label: "Instagram URL",        type: "url"   },
    { key: "linkedin",        value: "https://www.linkedin.com/company/e-partnerim", group: SettingsGroup.SOCIAL, label: "LinkedIn URL",  type: "url"   },
    { key: "twitter",         value: "",                        group: SettingsGroup.SOCIAL,    label: "Twitter/X URL",        type: "url"   },
    { key: "facebook",        value: "https://www.facebook.com/epartnerim", group: SettingsGroup.SOCIAL, label: "Facebook URL",         type: "url"   },
    { key: "tiktok",          value: "https://www.tiktok.com/@e.partnerim", group: SettingsGroup.SOCIAL, label: "TikTok URL",           type: "url"   },
    { key: "ga_id",           value: "",                        group: SettingsGroup.ANALYTICS, label: "Google Analytics ID",  type: "text"  },
    { key: "meta_pixel_id",   value: "",                        group: SettingsGroup.ANALYTICS, label: "Meta Pixel ID",        type: "text"  },
    { key: "gtm_id",          value: "",                        group: SettingsGroup.ANALYTICS, label: "GTM ID",               type: "text"  },
    { key: "search_console",  value: "",                        group: SettingsGroup.ANALYTICS, label: "Search Console Key",   type: "text"  },
    { key: "seo_site_title",          value: "E-Partnerim — E-Ticaretin Dijital Ortağı", group: SettingsGroup.SEO, label: "Site Title",          type: "text"     },
    { key: "seo_meta_description",    value: "50+ AI aracı ve uzman hizmetlerle KOBİ e-ticaret işletmenizi büyütün. Ücretsiz deneyin.", group: SettingsGroup.SEO, label: "Meta Description", type: "textarea" },
    { key: "seo_meta_keywords",       value: "",                 group: SettingsGroup.SEO, label: "Meta Keywords",             type: "text"     },
    { key: "seo_canonical_url",       value: "https://e-partnerim.com", group: SettingsGroup.SEO, label: "Canonical URL",      type: "url"      },
    { key: "seo_robots",              value: "index,follow",     group: SettingsGroup.SEO, label: "Robots Meta",               type: "text"     },
    { key: "seo_bing_verification",   value: "",                 group: SettingsGroup.SEO, label: "Bing Verification",         type: "text"     },
    { key: "seo_yandex_verification", value: "",                 group: SettingsGroup.SEO, label: "Yandex Verification",       type: "text"     },
    { key: "seo_json_ld_organization", value: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "E-Partnerim", url: "https://e-partnerim.com", logo: "https://e-partnerim.com/logo-icon.svg" }, null, 2), group: SettingsGroup.SEO, label: "JSON-LD Organization Schema", type: "textarea" },
    { key: "seo_robots_txt",          value: "",                 group: SettingsGroup.SEO, label: "Robots.txt (özel içerik, boşsa otomatik oluşturulur)", type: "textarea" },
    { key: "footer_description", value: "İşletmenizin dijital yol arkadaşı. Türkiye'nin önde gelen e-ticaret altyapıları ile iş birliği yapıyoruz.", group: SettingsGroup.BRANDING, label: "Footer Açıklama Metni", type: "textarea" },
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
