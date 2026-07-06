import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getUsers } from "@/lib/actions/users"
import UserList from "@/components/admin/users/UserList"

export const metadata: Metadata = { title: "Kullanıcılar" }

export default async function KullanicilarPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/panel")

  const users = await getUsers()

  return <UserList initialUsers={users} currentUserId={session.user.id} />
}
