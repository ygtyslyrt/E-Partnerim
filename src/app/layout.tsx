import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "E-Partnerim — E-Ticaretin Dijital Ortağı",
    template: "%s | E-Partnerim",
  },
  description:
    "50+ AI aracı ve uzman hizmetlerle KOBİ e-ticaret işletmenizi büyütün. Ücretsiz deneyin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${jakartaSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFCFC]">{children}</body>
    </html>
  );
}
