"use client"

import { useState } from "react"
import { Pencil, Trash2, PlusCircle, UserCircle2 } from "lucide-react"
import type { Role } from "@prisma/client"
import { toggleUserActive, deleteUser, type UserListItem } from "@/lib/actions/users"
import UserFormModal from "./UserFormModal"

const ROLE_LABEL: Record<Role, string> = { ADMIN: "Admin", EDITOR: "Editör", VIEWER: "Görüntüleyici" }
const ROLE_STYLE: Record<Role, string> = {
  ADMIN: "border-indigo-100 bg-indigo-50 text-indigo-700",
  EDITOR: "border-blue-100 bg-blue-50 text-blue-700",
  VIEWER: "border-slate-200 bg-slate-50 text-slate-600",
}

function UserRow({ user, isSelf, onToggle, onDelete, onEdit }: {
  user: UserListItem
  isSelf: boolean
  onToggle: () => void
  onDelete: () => void
  onEdit: () => void
}) {
  const [confirmDel, setConfirmDel] = useState(false)

  return (
    <tr className="transition-colors hover:bg-[#F8FAFC]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.name} className="h-8 w-8 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3730A3] text-xs font-bold text-white">
              {user.name[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-800">{user.name}{isSelf && <span className="ml-1.5 text-xs font-normal text-slate-400">(Siz)</span>}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${ROLE_STYLE[user.role]}`}>{ROLE_LABEL[user.role]}</span>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={isSelf}
          className={`relative h-5 w-9 rounded-full transition-colors disabled:opacity-40 ${user.active ? "bg-[#00D084]" : "bg-slate-200"}`}
          title={isSelf ? "Kendinizi devre dışı bırakamazsınız" : undefined}
        >
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${user.active ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={onEdit} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title="Düzenle">
            <Pencil size={15} />
          </button>
          {!isSelf && (
            confirmDel ? (
              <div className="flex items-center gap-1">
                <button type="button" onClick={onDelete} className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition">Sil</button>
                <button type="button" onClick={() => setConfirmDel(false)} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">İptal</button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmDel(true)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition" title="Sil">
                <Trash2 size={15} />
              </button>
            )
          )}
        </div>
      </td>
    </tr>
  )
}

export default function UserList({ initialUsers, currentUserId }: { initialUsers: UserListItem[]; currentUserId: string }) {
  const [users, setUsers] = useState<UserListItem[]>(initialUsers)
  const [target, setTarget] = useState<UserListItem | "new" | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleToggle(user: UserListItem) {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u)))
    const result = await toggleUserActive(user.id, user.active)
    if (!result.success) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, active: user.active } : u)))
      setError(result.error ?? "İşlem başarısız")
    }
  }

  async function handleDelete(id: string) {
    const prev = users
    setUsers((p) => p.filter((u) => u.id !== id))
    const result = await deleteUser(id)
    if (!result.success) {
      setUsers(prev)
      setError(result.error ?? "Silme başarısız")
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kullanıcılar</h1>
          <p className="mt-1 text-sm text-slate-500">{users.length} kullanıcı</p>
        </div>
        <button type="button" onClick={() => setTarget("new")} className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] transition">
          <PlusCircle size={16} />
          Yeni Kullanıcı
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">×</button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <UserCircle2 size={32} className="text-slate-300" />
            <p className="text-sm text-slate-400">Henüz kullanıcı yok.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Kullanıcı</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Rol</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Aktif</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Katılım</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isSelf={user.id === currentUserId}
                  onToggle={() => handleToggle(user)}
                  onDelete={() => handleDelete(user.id)}
                  onEdit={() => setTarget(user)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserFormModal
        target={target}
        onClose={() => setTarget(null)}
        onSaved={(saved) => setUsers((prev) => (prev.some((u) => u.id === saved.id) ? prev.map((u) => (u.id === saved.id ? saved : u)) : [...prev, saved]))}
      />
    </div>
  )
}
