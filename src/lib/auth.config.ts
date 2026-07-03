import type { NextAuthConfig } from "next-auth"

// Edge-uyumlu config — Prisma kullanmaz, middleware'de çalışır
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/panel/giris",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname

      // Admin paneli: giriş yapılmamışsa login'e yönlendir
      if (path.startsWith("/panel") && path !== "/panel/giris") {
        return isLoggedIn
      }

      // Login sayfası: giriş yapılmışsa panele yönlendir
      if (path === "/panel/giris" && isLoggedIn) {
        return Response.redirect(new URL("/panel", nextUrl))
      }

      return true
    },
  },
  providers: [], // Middleware'de provider gerekmez
}
