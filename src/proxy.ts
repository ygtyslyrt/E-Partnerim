import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { findActiveRedirect, incrementRedirectHit } from "@/lib/actions/seo"

const { auth } = NextAuth(authConfig)

// Tek proxy dosyası hem panel oturum korumasını hem de SEO yönlendirme/404 mantığını yürütür.
export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth?.user

  if (pathname.startsWith("/panel")) {
    if (pathname !== "/panel/giris" && !isLoggedIn) {
      return NextResponse.redirect(new URL("/panel/giris", req.nextUrl))
    }
    if (pathname === "/panel/giris" && isLoggedIn) {
      return NextResponse.redirect(new URL("/panel", req.nextUrl))
    }
    return NextResponse.next()
  }

  const redirect = await findActiveRedirect(pathname)
  if (redirect) {
    incrementRedirectHit(redirect.id).catch(() => {})
    return NextResponse.redirect(new URL(redirect.toPath, req.url), redirect.type)
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-pathname", pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
}
