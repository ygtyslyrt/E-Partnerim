"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingBag,
  Lightbulb,
  Bot,
  Image as ImageIcon,
  Globe,
  Settings,
  UserCog,
  ChevronRight,
  MessagesSquare,
  Tags,
  Handshake,
} from "lucide-react"
import type { UserRole } from "@/types/cms"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: string
  roles?: UserRole[]
}

const NAV: NavItem[] = [
  { href: "/panel",                icon: LayoutDashboard, label: "Dashboard" },
  { href: "/panel/icerik",         icon: Globe,           label: "İçerik Yönetimi" },
  { href: "/panel/blog",           icon: FileText,        label: "Blog" },
  { href: "/panel/platformlar",    icon: ShoppingBag,     label: "Platformlar" },
  { href: "/panel/cozumler",       icon: Lightbulb,       label: "Çözümler" },
  { href: "/panel/partnerler",     icon: Handshake,       label: "Partnerler" },
  { href: "/panel/partnerix",      icon: Bot,             label: "Partnerix" },
  { href: "/panel/formlar",        icon: MessagesSquare,  label: "Formlar" },
  { href: "/panel/crm",            icon: Users,           label: "CRM / Leads" },
  { href: "/panel/medya",          icon: ImageIcon,       label: "Medya" },
  { href: "/panel/seo",            icon: Tags,            label: "SEO" },
  { href: "/panel/kullanicilar",   icon: UserCog,         label: "Kullanıcılar", roles: ["ADMIN"] },
  { href: "/panel/ayarlar",        icon: Settings,        label: "Ayarlar",      roles: ["ADMIN"] },
]

export default function PanelSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname()

  const filteredNav = NAV.filter(
    (item) => !item.roles || item.roles.includes(role)
  )

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[#E4EAF5] bg-white lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-[#E4EAF5]">
        <span className="text-lg font-extrabold text-[#3730A3] tracking-tight">
          E-Partnerim
        </span>
        <span className="ml-1.5 rounded bg-[#EEF2FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#4F46E5]">
          Panel
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {filteredNav.map((item) => {
          const isActive =
            item.href === "/panel"
              ? pathname === "/panel"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#EEF2FF] text-[#3730A3]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <item.icon size={17} className={isActive ? "text-[#4F46E5]" : "text-slate-400"} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-[#4F46E5]" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#E4EAF5] px-4 py-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition"
        >
          <Globe size={12} />
          Siteyi Görüntüle
        </Link>
      </div>
    </aside>
  )
}
