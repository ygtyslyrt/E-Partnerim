import { prisma } from "@/lib/prisma"
import {
  FileText,
  Users,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Eye,
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard" }

async function getStats() {
  const [
    totalBlogPosts,
    publishedBlogPosts,
    totalPlatforms,
    totalSolutions,
    totalLeads,
    newLeads,
    unreadContact,
    unreadConsulting,
    partnerixSessions,
    completedSessions,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.platform.count(),
    prisma.solution.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.contactForm.count({ where: { status: "UNREAD" } }),
    prisma.consultingForm.count({ where: { status: "UNREAD" } }),
    prisma.partnerixSession.count(),
    prisma.partnerixSession.count({ where: { completedAt: { not: null } } }),
  ])

  const conversionRate =
    partnerixSessions > 0
      ? Math.round((completedSessions / partnerixSessions) * 100)
      : 0

  return {
    totalBlogPosts,
    publishedBlogPosts,
    totalPlatforms,
    totalSolutions,
    totalLeads,
    newLeads,
    unreadForms: unreadContact + unreadConsulting,
    partnerixSessions,
    completedSessions,
    conversionRate,
  }
}

export default async function PanelDashboard() {
  const stats = await getStats()

  const cards = [
    {
      label: "Toplam Lead",
      value: stats.totalLeads,
      sub: `${stats.newLeads} yeni`,
      icon: Users,
      color: "text-[#4F46E5] bg-[#EEF2FF]",
    },
    {
      label: "Blog Yazısı",
      value: stats.totalBlogPosts,
      sub: `${stats.publishedBlogPosts} yayında`,
      icon: FileText,
      color: "text-[#059669] bg-[#ECFDF5]",
    },
    {
      label: "Platform",
      value: stats.totalPlatforms,
      sub: `${stats.totalSolutions} çözüm`,
      icon: ShoppingBag,
      color: "text-[#0EA5E9] bg-[#F0F9FF]",
    },
    {
      label: "Okunmamış Form",
      value: stats.unreadForms,
      sub: "iletişim + danışmanlık",
      icon: MessageSquare,
      color: "text-[#F97316] bg-[#FFF7ED]",
    },
    {
      label: "Partnerix Oturumu",
      value: stats.partnerixSessions,
      sub: `${stats.completedSessions} tamamlandı`,
      icon: Eye,
      color: "text-[#8B5CF6] bg-[#F5F3FF]",
    },
    {
      label: "Dönüşüm Oranı",
      value: `%${stats.conversionRate}`,
      sub: "Partnerix tamamlanma",
      icon: TrendingUp,
      color: "text-[#10B981] bg-[#ECFDF5]",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          E-Partnerim yönetim paneline hoş geldiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[#E4EAF5] bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
              </div>
              <div className={`rounded-xl p-2.5 ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
