import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  breadcrumb: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function PageHero({ breadcrumb, title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#FAFCFC] py-16 sm:py-20">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Yeşil blob */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,208,132,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1 text-sm" aria-label="Breadcrumb">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#CBD5E1]" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-[#0F172A]">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Badge */}
        {badge && (
          <span className="mb-4 inline-flex items-center rounded-full border border-[#00D084]/25 bg-[#00D084]/8 px-3 py-1 text-xs font-semibold text-[#00D084]">
            {badge}
          </span>
        )}

        {/* Başlık */}
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
          {title}
        </h1>

        {/* Alt başlık */}
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-[#64748B] leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Alt ayırıcı çizgi */}
        <div className="mt-10 h-px w-16 rounded-full bg-[#00D084]" />
      </div>
    </section>
  );
}
