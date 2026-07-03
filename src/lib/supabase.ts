import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side istemci (Service Role — tüm izinler)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Public bucket adı
export const MEDIA_BUCKET = "media"

export async function uploadToSupabase(
  buffer: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: false,
    })

  if (error) throw new Error(`Upload hatası: ${error.message}`)

  const { data: urlData } = supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function deleteFromSupabase(path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .remove([path])

  if (error) throw new Error(`Silme hatası: ${error.message}`)
}
