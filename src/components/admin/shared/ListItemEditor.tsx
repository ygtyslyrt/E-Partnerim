"use client"

import { Reorder, useDragControls } from "framer-motion"
import { Plus, Trash2, GripVertical } from "lucide-react"
import type { ReactNode } from "react"

interface RowProps<T> {
  item: T
  onDelete: () => void
  children: ReactNode
}

function Row<T>({ item, onDelete, children }: RowProps<T>) {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="rounded-xl border border-[#E4EAF5] bg-white p-3 shadow-sm"
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="mt-1 touch-none cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing"
          aria-label="Sırala"
        >
          <GripVertical size={15} />
        </button>
        <div className="min-w-0 flex-1">{children}</div>
        <button
          type="button"
          onClick={onDelete}
          className="mt-1 rounded-lg p-1 text-slate-300 hover:text-red-500 transition"
          aria-label="Sil"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </Reorder.Item>
  )
}

interface Props<T extends { _key: string }> {
  items: T[]
  onChange: (items: T[]) => void
  onAdd: () => T
  addLabel?: string
  emptyLabel?: string
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode
}

export default function ListItemEditor<T extends { _key: string }>({
  items,
  onChange,
  onAdd,
  addLabel = "Ekle",
  emptyLabel = "Henüz öğe eklenmedi",
  renderItem,
}: Props<T>) {
  function update(key: string, patch: Partial<T>) {
    onChange(items.map((i) => (i._key === key ? { ...i, ...patch } : i)))
  }
  function remove(key: string) {
    onChange(items.filter((i) => i._key !== key))
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
          {emptyLabel}
        </div>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={onChange} className="space-y-2">
          {items.map((item) => (
            <Row key={item._key} item={item} onDelete={() => remove(item._key)}>
              {renderItem(item, (patch) => update(item._key, patch))}
            </Row>
          ))}
        </Reorder.Group>
      )}
      <button
        type="button"
        onClick={() => onChange([...items, onAdd()])}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#4F46E5] hover:bg-[#EEF2FF] transition"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  )
}
