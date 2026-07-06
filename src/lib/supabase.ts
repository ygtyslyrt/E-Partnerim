import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Public bucket adı
export const MEDIA_BUCKET = "media"

const globalForSupabase = globalThis as unknown as { supabaseAdmin?: SupabaseClient }

// Next.js build zamanında (page data toplama aşamasında) bu modül import edilir;
// client'ı üst seviyede oluşturmak env değişkenleri henüz yokken build'i çökertir.
// Bu yüzden client yalnızca ilk gerçek kullanımda (request anında) oluşturulur.
export function getSupabaseAdmin(): SupabaseClient {
  if (globalForSupabase.supabaseAdmin) return globalForSupabase.supabaseAdmin

  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const client = createClient(supabaseUrl, supabaseServiceKey)

  globalForSupabase.supabaseAdmin = client
  return client
}

export async function uploadToSupabase(
  buffer: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin()
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
  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .remove([path])

  if (error) throw new Error(`Silme hatası: ${error.message}`)
}
