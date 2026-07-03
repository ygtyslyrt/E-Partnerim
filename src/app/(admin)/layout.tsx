// Admin grubu — root layout'u override etmez, sadece geçiş katmanı
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
