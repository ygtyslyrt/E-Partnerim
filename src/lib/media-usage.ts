"use server"

import { prisma } from "@/lib/prisma"

export type MediaUsageFields = Record<string, string | null | undefined>

// Bir içerik kaydedildiğinde, alanlarındaki görsel URL'lerini Media tablosuyla eşleştirip
// MediaUsage kayıtlarını senkronize eder. Her (entityType, entityId, fieldName) tekil bir slottur.
export async function syncMediaUsage(
  entityType: string,
  entityId: string,
  entityLabel: string,
  entityHref: string,
  fields: MediaUsageFields
): Promise<void> {
  for (const [fieldName, url] of Object.entries(fields)) {
    if (!url) {
      await prisma.mediaUsage.deleteMany({ where: { entityType, entityId, fieldName } })
      continue
    }

    const media = await prisma.media.findFirst({
      where: { OR: [{ url }, { webpUrl: url }] },
      select: { id: true },
    })

    if (!media) {
      await prisma.mediaUsage.deleteMany({ where: { entityType, entityId, fieldName } })
      continue
    }

    await prisma.mediaUsage.upsert({
      where: { entityType_entityId_fieldName: { entityType, entityId, fieldName } },
      create: { mediaId: media.id, entityType, entityId, entityLabel, entityHref, fieldName },
      update: { mediaId: media.id, entityLabel, entityHref },
    })
  }
}
