"use client"

import { signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"
import type { Session } from "next-auth"

interface Props {
  user: Session["user"]
}

export default function PanelTopbar({ user }: Props) {
  const roleLabel: Record<string, string> = {
    ADMIN: "Admin",
    EDITOR: "Editör",
    VIEWER: "Görüntüleyici",
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E4EAF5] bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5]">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name ?? ""} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <User size={15} />
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {roleLabel[(user as { role?: string }).role ?? ""] ?? ""}
            </p>
          </div>
        </div>

        {/* Çıkış */}
        <button
          onClick={() => signOut({ callbackUrl: "/panel/giris" })}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
          title="Çıkış Yap"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Çıkış</span>
        </button>
      </div>
    </header>
  )
}
