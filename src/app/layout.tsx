import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { getSiteSettings } from "@/lib/actions/settings";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const FALLBACK_TITLE = "E-Partnerim — E-Ticaretin Dijital Ortağı";
const FALLBACK_DESC = "50+ AI aracı ve uzman hizmetlerle KOBİ e-ticaret işletmenizi büyütün. Ücretsiz deneyin.";
const FALLBACK_URL = "https://e-partnerim.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = settings.seo_canonical_url || settings.site_url || FALLBACK_URL;
  const siteName = settings.site_name || "E-Partnerim";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings.seo_site_title || FALLBACK_TITLE,
      template: `%s | ${siteName}`,
    },
    description: settings.seo_meta_description || FALLBACK_DESC,
    keywords: settings.seo_meta_keywords ? settings.seo_meta_keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    verification: {
      google: settings.search_console || undefined,
      yandex: settings.seo_yandex_verification || undefined,
      other: settings.seo_bing_verification ? { "msvalidate.01": settings.seo_bing_verification } : undefined,
    },
  };
}

function parseOrganizationSchema(raw: string | undefined): Record<string, unknown> | null {
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const gaId = settings.ga_id?.trim();
  const gtmId = settings.gtm_id?.trim();
  const pixelId = settings.meta_pixel_id?.trim();
  const orgSchema = parseOrganizationSchema(settings.seo_json_ld_organization);

  return (
    <html
      lang="tr"
      className={`${jakartaSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFCFC]">
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}

        {orgSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
          />
        )}

        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');`}
            </Script>
          </>
        )}

        {gtmId && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}

        {pixelId && (
          <>
            <Script id="meta-pixel-init" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
                s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');`}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                alt=""
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
