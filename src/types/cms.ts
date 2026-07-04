// CMS genel tipleri — Prisma'dan türetilir ama UI katmanı için genişletilir

export type UserRole = "ADMIN" | "EDITOR" | "VIEWER"
export type ContentStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED"
export type LeadStatusType = "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST" | "ON_HOLD"
export type PriorityType = "LOW" | "MEDIUM" | "HIGH" | "URGENT"
export type LeadSourceType = "PARTNERIX" | "CONTACT_FORM" | "CONSULTING" | "MANUAL" | "REFERRAL" | "SOCIAL" | "ORGANIC"
export type FormStatusType = "UNREAD" | "READ" | "REPLIED" | "SPAM"

// Sayfa bölüm tipleri (sectionType string değerleri)
export type SectionType =
  | "hero"
  | "platforms"
  | "solutions"
  | "services"
  | "how-it-works"
  | "why-us"
  | "social-proof"
  | "cta"
  | "blog"

// Partnerix flow yüklenmiş hâli (tüm ilişkiler dahil)
export interface PartnerixFlowFull {
  id: string
  name: string
  slug: string
  active: boolean
  robotImage: string | null
  welcomeMsg: string | null
  bubbles: Array<{
    id: string
    text: string
    order: number
    delay: number
  }>
  steps: Array<{
    id: string
    question: string
    order: number
    options: Array<{
      id: string
      label: string
      value: string
      icon: string | null
      color: string | null
      order: number
    }>
  }>
  results: Array<{
    id: string
    title: string
    message: string | null
    ctaText: string | null
    ctaHref: string | null
    ctaType: string
  }>
}

// Hero bölümü içerik tipi
export interface HeroContent {
  badge: string | null
  title1: string
  title2: string
  gradient: string | null
  subtitle: string | null
  bgType: string
  bgColor: string | null
  bgImage: string | null
  dotPattern: boolean
}

// Dashboard istatistikleri
export interface DashboardStats {
  totalBlogPosts: number
  publishedBlogPosts: number
  totalPlatforms: number
  totalSolutions: number
  totalLeads: number
  newLeads: number
  unreadForms: number
  partnerixCompletionsToday: number
  partnerixConversionRate: number
}

// Sayfalama
export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Aksiyon sonucu
export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

// Medya
export interface UploadedMedia {
  id: string
  filename: string
  url: string
  webpUrl: string | null
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  size: number
  mimeType: string
  alt: string | null
}

// Lead Kanban görünümü
export interface LeadKanbanColumn {
  status: LeadStatusType
  label: string
  color: string
  leads: LeadCard[]
}

export interface LeadCard {
  id: string
  name: string
  company: string | null
  source: LeadSourceType
  priority: PriorityType
  sector: string | null
  budget: string | null
  createdAt: Date
  assignedTo: { name: string; avatar: string | null } | null
  tags: Array<{ name: string; color: string }>
}

// Navigasyon menü öğesi
export interface MenuItem {
  label: string
  href: string
  target?: string
  icon?: string
  badge?: string
  children?: MenuItem[]
}
