import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Kayıt Ol" };

export default function KayitPage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
          <Zap className="h-6 w-6 text-primary" />
          E-Partnerim
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Ücretsiz hesap oluşturun</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-primary hover:underline">
            Giriş yapın
          </Link>
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        {/* Form buraya gelecek */}
        <Button className="w-full" disabled aria-disabled>
          Kayıt Ol
        </Button>
      </div>
    </div>
  );
}
