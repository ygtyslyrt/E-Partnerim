"use client"

import { useId } from "react"
import { Reorder, useDragControls } from "framer-motion"
import { Plus, Trash2, GripVertical, CheckCircle2, XCircle } from "lucide-react"

export interface FeatureItem {
  _key: string
  type: "ADVANTAGE" | "DISADVANTAGE"
  text: string
}

interface Props {
  items: FeatureItem[]
  onChange: (items: FeatureItem[]) => void
}

function FeatureRow({
  item,
  onDelete,
  onTextChange,
}: {
  item: FeatureItem
  onDelete: () => void
  onTextChange: (text: string) => void
}) {
  const controls = useDragControls()
  const isAdv = item.type === "ADVANTAGE"

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm ${
        isAdv ? "border-emerald-100" : "border-rose-100"
      }`}
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="touch-none cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing"
        aria-label="Sırala"
      >
        <GripVertical size={15} />
      </button>
      {isAdv ? (
        <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
      ) : (
        <XCircle size={15} className="shrink-0 text-rose-400" />
      )}
      <input
        type="text"
        value={item.text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={isAdv ? "Avantajı açıkla..." : "Dezavantajı açıkla..."}
        className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg p-1 text-slate-300 hover:text-red-500 transition"
        aria-label="Sil"
      >
        <Trash2 size={14} />
      </button>
    </Reorder.Item>
  )
}

function Group({
  type,
  items,
  onReorder,
  onAdd,
  onDelete,
  onTextChange,
}: {
  type: "ADVANTAGE" | "DISADVANTAGE"
  items: FeatureItem[]
  onReorder: (reordered: FeatureItem[]) => void
  onAdd: () => void
  onDelete: (key: string) => void
  onTextChange: (key: string, text: string) => void
}) {
  const isAdv = type === "ADVANTAGE"
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4
          className={`flex items-center gap-1.5 text-sm font-semibold ${
            isAdv ? "text-emerald-700" : "text-rose-600"
          }`}
        >
          {isAdv ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {isAdv ? "Avantajlar" : "Dezavantajlar"}
          <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-normal text-slate-500">
            {items.length}
          </span>
        </h4>
        <button
          type="button"
          onClick={onAdd}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
            isAdv
              ? "text-emerald-700 hover:bg-emerald-50"
              : "text-rose-600 hover:bg-rose-50"
          }`}
        >
          <Plus size={12} /> Ekle
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-5 text-center text-xs text-slate-400">
          {isAdv ? "Henüz avantaj eklenmedi" : "Henüz dezavantaj eklenmedi"}
        </div>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-2">
          {items.map((item) => (
            <FeatureRow
              key={item._key}
              item={item}
              onDelete={() => onDelete(item._key)}
              onTextChange={(text) => onTextChange(item._key, text)}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  )
}

export default function FeatureEditor({ items, onChange }: Props) {
  const uid = useId()

  const advantages = items.filter((i) => i.type === "ADVANTAGE")
  const disadvantages = items.filter((i) => i.type === "DISADVANTAGE")

  function add(type: "ADVANTAGE" | "DISADVANTAGE") {
    onChange([...items, { _key: `${uid}-${Date.now()}`, type, text: "" }])
  }

  function remove(key: string) {
    onChange(items.filter((i) => i._key !== key))
  }

  function setText(key: string, text: string) {
    onChange(items.map((i) => (i._key === key ? { ...i, text } : i)))
  }

  function reorder(type: "ADVANTAGE" | "DISADVANTAGE", reordered: FeatureItem[]) {
    onChange([...items.filter((i) => i.type !== type), ...reordered])
  }

  return (
    <div className="space-y-6">
      <Group
        type="ADVANTAGE"
        items={advantages}
        onReorder={(r) => reorder("ADVANTAGE", r)}
        onAdd={() => add("ADVANTAGE")}
        onDelete={remove}
        onTextChange={setText}
      />
      <Group
        type="DISADVANTAGE"
        items={disadvantages}
        onReorder={(r) => reorder("DISADVANTAGE", r)}
        onAdd={() => add("DISADVANTAGE")}
        onDelete={remove}
        onTextChange={setText}
      />
    </div>
  )
}
