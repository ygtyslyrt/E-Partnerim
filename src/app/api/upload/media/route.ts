import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseAdmin, MEDIA_BUCKET } from "@/lib/supabase"
import { prisma } from "@/lib/prisma"
import sharp from "sharp"
import type { Session } from "next-auth"
import type { NextRequest } from "next/server"

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const MODEL_EXTENSIONS = [".glb", ".gltf"]
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg"]

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getExtension(name: string): string {
  const idx = name.lastIndexOf(".")
  return idx === -1 ? "" : name.slice(idx).toLowerCase()
}

type AuthedReq = NextRequest & { auth: Session | null }

// auth() wrapper pattern doğrudan request.headers'dan cookie okur
// headers() from next/headers kullanmaz — Next.js 16 uyumlu
export const POST = auth(async function handler(req: AuthedReq) {
  const session = req.auth
  if (!session?.user) {
    return NextResponse.json({ error: "Oturum bulunamadı — lütfen yeniden giriş yapın" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folderId = (formData.get("folderId") as string) || null

    if (!file) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })

    const ext = getExtension(file.name)
    const isImage = IMAGE_TYPES.includes(file.type)
    const isSvg = file.type === "image/svg+xml"
    const isPdf = file.type === "application/pdf"
    const isModel = MODEL_EXTENSIONS.includes(ext)
    const isAudio = AUDIO_EXTENSIONS.includes(ext) || file.type.startsWith("audio/")

    if (!isImage && !isSvg && !isPdf && !isModel && !isAudio) {
      return NextResponse.json({ error: `Desteklenmeyen dosya türü: ${file.type || ext}` }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const id = uid()
    let url: string
    let webpUrl: string | null = null
    let thumbnailUrl: string | null = null
    let width: number | null = null
    let height: number | null = null
    let storedMimeType: string = file.type

    if (isImage) {
      const meta = await sharp(buffer).metadata()
      width = meta.width ?? null
      height = meta.height ?? null

      const webpBuf = await sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer()
      const storagePath = `images/${id}.webp`
      const { data: up, error: upErr } = await supabaseAdmin.storage
        .from(MEDIA_BUCKET).upload(storagePath, webpBuf, { contentType: "image/webp", upsert: false })
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
      url = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(up.path).data.publicUrl
      webpUrl = url

      const thumbBuf = await sharp(buffer).resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true }).webp({ quality: 75 }).toBuffer()
      const thumbPath = `thumbnails/${id}.webp`
      const { data: th } = await supabaseAdmin.storage
        .from(MEDIA_BUCKET).upload(thumbPath, thumbBuf, { contentType: "image/webp", upsert: false })
      if (th) thumbnailUrl = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(th.path).data.publicUrl

    } else if (isSvg) {
      const storagePath = `svgs/${id}.svg`
      const { data: up, error: upErr } = await supabaseAdmin.storage
        .from(MEDIA_BUCKET).upload(storagePath, buffer, { contentType: "image/svg+xml", upsert: false })
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
      url = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(up.path).data.publicUrl

    } else if (isPdf) {
      const storagePath = `pdfs/${id}.pdf`
      const { data: up, error: upErr } = await supabaseAdmin.storage
        .from(MEDIA_BUCKET).upload(storagePath, buffer, { contentType: "application/pdf", upsert: false })
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
      url = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(up.path).data.publicUrl

    } else if (isModel) {
      // Tarayıcılar .glb/.gltf için tutarsız mime tipleri bildirir (çoğunlukla application/octet-stream
      // veya boş) — dosya uzantısından zorla normalize ediyoruz ki Medya Kütüphanesi'nde filtrelenebilsin.
      storedMimeType = ext === ".gltf" ? "model/gltf+json" : "model/gltf-binary"
      const storagePath = `models/${id}${ext}`
      const { data: up, error: upErr } = await supabaseAdmin.storage
        .from(MEDIA_BUCKET).upload(storagePath, buffer, { contentType: storedMimeType, upsert: false })
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
      url = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(up.path).data.publicUrl

    } else {
      // Ses dosyaları
      storedMimeType = file.type.startsWith("audio/")
        ? file.type
        : ext === ".mp3" ? "audio/mpeg" : ext === ".wav" ? "audio/wav" : "audio/ogg"
      const storagePath = `audio/${id}${ext || ".mp3"}`
      const { data: up, error: upErr } = await supabaseAdmin.storage
        .from(MEDIA_BUCKET).upload(storagePath, buffer, { contentType: storedMimeType, upsert: false })
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
      url = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(up.path).data.publicUrl
    }

    const media = await prisma.media.create({
      data: {
        filename: `${id}.${file.name.split(".").pop() ?? "bin"}`,
        originalName: file.name,
        url,
        webpUrl,
        thumbnailUrl,
        mimeType: storedMimeType,
        size: file.size,
        width,
        height,
        folderId,
        uploadedBy: session.user.id ?? null,
      },
    })

    return NextResponse.json({ ...media, createdAt: media.createdAt.toISOString() })
  } catch (e: unknown) {
    const err = e as Error
    console.error("[upload/media]", err.name, err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
})
