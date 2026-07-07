"use client"

import { useState, useCallback, useRef } from "react"
import { Reorder, useDragControls } from "framer-motion"
import {
  GripVertical, Eye, EyeOff, ChevronDown, Sparkles, Store, Package,
  Users, Grid3X3, Route, ShieldCheck, FileText, MousePointerClick,
} from "lucide-react"
import { reorderSections, toggleSectionVisibility } from "@/lib/actions/sections"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"
import HeroEditor from "./HeroEditor"
import PlatformsSectionEditor from "./PlatformsSectionEditor"
import SolutionsSectionEditor from "./SolutionsSectionEditor"
import ServicesEditor from "./ServicesEditor"
import HowItWorksEditor from "./HowItWorksEditor"
import WhyUsEditor from "./WhyUsEditor"
import SocialProofEditor from "./SocialProofEditor"
import BlogSectionEditor from "./BlogSectionEditor"
import CtaEditor from "./CtaEditor"
import type { BlogCategory } from "@prisma/client"

export interface SectionRow {
  id: string
  sectionType: string
  order: number
  visible: boolean
}

const SECTION_META: Record<string, { label: string; icon: React.ElementType }> = {
  hero: { label: "Hero", icon: Sparkles },
  platforms: { label: "Platformlar", icon: Store },
  solutions: { label: "Çözümler", icon: Package },
  "social-proof": { label: "Referanslar", icon: Users },
  services: { label: "Hizmetler", icon: Grid3X3 },
  "how-it-works": { label: "Nasıl Çalışır", icon: Route },
  "why-us": { label: "Neden Biz", icon: ShieldCheck },
  blog: { label: "Blog Önizleme", icon: FileText },
  cta: { label: "CTA", icon: MousePointerClick },
}

interface Props {
  initialSections: SectionRow[]
  contentMap: Record<string, unknown>
  categories: BlogCategory[]
}

function SectionEditor({ sectionType, content, categories }: { sectionType: string; content: unknown; categories: BlogCategory[] }) {
  switch (sectionType) {
    case "hero":
      return <HeroEditor initialData={content as never} />
    case "platforms":
      return <PlatformsSectionEditor initialData={content as never} />
    case "solutions":
      return <SolutionsSectionEditor initialData={content as never} />
    case "services":
      return <ServicesEditor initialData={content as never} />
    case "how-it-works":
      return <HowItWorksEditor initialData={content as never} />
    case "why-us":
      return <WhyUsEditor initialData={content as never} />
    case "social-proof":
      return <SocialProofEditor initialData={content as never} />
    case "blog":
      return <BlogSectionEditor initialData={content as never} categories={categories} />
    case "cta":
      return <CtaEditor initialData={content as never} />
    default:
      return null
  }
}

function SectionRowItem({
  section, content, categories, onToggle, expanded, onExpand,
}: {
  section: SectionRow
  content: unknown
  categories: BlogCategory[]
  onToggle: () => void
  expanded: boolean
  onExpand: () => void
}) {
  const controls = useDragControls()
  const meta = SECTION_META[section.sectionType] ?? { label: section.sectionType, icon: FileText }
  const Icon = meta.icon

  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      className="rounded-2xl border border-[#E4EAF5] bg-white shadow-sm"
      whileDrag={{ scale: 1.01, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="touch-none cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF] shrink-0">
          <Icon size={15} className="text-[#4F46E5]" />
        </div>

        <button type="button" onClick={onExpand} className="flex flex-1 items-center gap-2 text-left">
          <span className="text-sm font-semibold text-slate-800">{meta.label}</span>
          {!section.visible && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">Gizli</span>
          )}
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          title={section.visible ? "Gizle" : "Göster"}
        >
          {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>

        <button
          type="button"
          onClick={onExpand}
          className={`rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition ${expanded ? "rotate-180" : ""}`}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-[#F0F4F8] p-5">
          <SectionEditor sectionType={section.sectionType} content={content} categories={categories} />
        </div>
      )}
    </Reorder.Item>
  )
}

export default function SectionsManager({ initialSections, contentMap, categories }: Props) {
  const [sections, setSections] = useState<SectionRow[]>(initialSections)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleReorder = useCallback((reordered: SectionRow[]) => {
    setSections(reordered)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const result = await reorderSections(reordered.map((s) => s.id))
      if (!result.success) setToast({ message: result.error ?? "Sıralama kaydedilemedi", type: "error" })
    }, 800)
  }, [])

  async function handleToggle(section: SectionRow) {
    const nextVisible = !section.visible
    setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, visible: nextVisible } : s)))
    const result = await toggleSectionVisibility(section.id, nextVisible)
    if (!result.success) {
      setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, visible: section.visible } : s)))
      setToast({ message: result.error ?? "Görünürlük değiştirilemedi", type: "error" })
    } else {
      setToast({ message: nextVisible ? "Bölüm gösterildi" : "Bölüm gizlendi", type: "success" })
    }
  }

  return (
    <>
      <Reorder.Group axis="y" values={sections} onReorder={handleReorder} className="space-y-2">
        {sections.map((section) => (
          <SectionRowItem
            key={section.id}
            section={section}
            content={contentMap[section.sectionType]}
            categories={categories}
            onToggle={() => handleToggle(section)}
            expanded={expandedId === section.id}
            onExpand={() => setExpandedId((id) => (id === section.id ? null : section.id))}
          />
        ))}
      </Reorder.Group>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  )
}
