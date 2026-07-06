import type { NextAuthConfig } from "next-auth"

// Edge-uyumlu config — Prisma kullanmaz, proxy.ts'de çalışır
// Panel oturum koruma mantığı artık doğrudan proxy.ts içinde (auth() wrapper'ı ile) yürütülüyor.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/panel/giris",
  },
  providers: [], // Proxy'de provider gerekmez
}
