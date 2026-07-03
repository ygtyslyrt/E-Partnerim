import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseAdmin, MEDIA_BUCKET } from "@/lib/supabase"
import sharp from "sharp"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const pathPrefix = (formData.get("path") as string) || "uploads"
    const maxWidth = parseInt((formData.get("maxWidth") as string) || "800", 10)

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Geçersiz dosya" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const webpBuffer = await sharp(buffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()

    const filename = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`

    const { data, error } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .upload(filename, webpBuffer, { contentType: "image/webp", upsert: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: urlData } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(data.path)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
