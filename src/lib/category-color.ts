const CATEGORY_PALETTE = [
  { color: "#059669", bg: "#ECFDF5" },
  { color: "#0EA5E9", bg: "#F0F9FF" },
  { color: "#F97316", bg: "#FFF7ED" },
  { color: "#4F46E5", bg: "#EEF2FF" },
  { color: "#DB2777", bg: "#FDF2F8" },
]

export function categoryStyle(key: string) {
  const hash = [...key].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length]
}
