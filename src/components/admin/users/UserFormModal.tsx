"use client"

import { useState, useTransition } from "react"
import { X, Loader2, Save } from "lucide-react"
import type { Role } from "@prisma/client"
import { createUser, updateUser, type UserListItem } from "@/lib/actions/users"

interface Props {
  target: UserListItem | "new" | null
  onClose: () => void
  onSaved: (user: UserListItem) => void
}

const ROLES: { value: Role; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "EDITOR", label: "Editör" },
  { value: "VIEWER", label: "Görüntüleyici" },
]

export default function UserFormModal({ target, onClose, onSaved }: Props) {
  const isNew = target === "new"
  const user = isNew ? null : target

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [role, setRole] = useState<Role>(user?.role ?? "EDITOR")
  const [active, setActive] = useState(user?.active ?? true)
  const [password, setPassword] = useState("")

  if (!target) return null

  const inputCls =
    "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = isNew
        ? await createUser({ name, email, password, role, active })
        : await updateUser(user!.id, { name, email, role, active, password: password || undefined })

      if (result.success && result.data) {
        onSaved(result.data)
        onClose()
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="flex max-h-[90vh] w-[min(480px,95vw)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[#E4EAF5] px-5 py-4">
          <h2 className="flex-1 text-base font-bold text-slate-800">{isNew ? "Yeni Kullanıcı" : "Kullanıcıyı Düzenle"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {error && <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <div>
            <label className={labelCls}>Ad Soyad</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>{isNew ? "Şifre" : "Yeni Şifre (opsiyonel)"}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isNew ? "En az 8 karakter" : "Değiştirmek istemiyorsanız boş bırakın"}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={inputCls}>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-slate-700">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-[#E4EAF5] text-[#3730A3] focus:ring-[#3730A3]/20" />
            Aktif
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E4EAF5] bg-[#F8FAFC] px-5 py-3">
          <button onClick={onClose} className="rounded-xl border border-[#E4EAF5] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition">İptal</button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !name.trim() || !email.trim() || (isNew && password.length < 8)}
            className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition"
          >
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  )
}
