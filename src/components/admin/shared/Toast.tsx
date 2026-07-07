"use client"

import { useEffect } from "react"
import { CheckCircle2, XCircle } from "lucide-react"

export interface ToastState {
  message: string
  type: "success" | "error"
}

interface Props {
  toast: ToastState | null
  onClose: () => void
  duration?: number
}

export default function Toast({ toast, onClose, duration = 3000 }: Props) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [toast, duration, onClose])

  if (!toast) return null

  const isError = toast.type === "error"

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {isError ? (
        <XCircle size={17} className="mt-0.5 shrink-0" />
      ) : (
        <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
      )}
      <span>{toast.message}</span>
    </div>
  )
}
