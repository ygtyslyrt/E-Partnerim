"use client"

import { useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function GirisPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    startTransition(async () => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("E-posta veya şifre hatalı.")
      } else {
        router.push("/panel")
        router.refresh()
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F4FB] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="text-2xl font-extrabold text-[#3730A3] tracking-tight">
            E-Partnerim
          </span>
          <p className="mt-1 text-sm text-slate-500">Yönetim Paneli</p>
        </div>

        <div className="rounded-2xl border border-[#E4EAF5] bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-xl font-bold text-slate-800">Giriş Yap</h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="info@e-partnerim.com"
                className="w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3730A3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition"
            >
              {isPending && <Loader2 size={15} className="animate-spin" />}
              {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
