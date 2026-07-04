"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"

async function getOrCreateCharacter() {
  const flow = await prisma.partnerixFlow.findFirst({ orderBy: { createdAt: "asc" } })
  if (!flow) return null
  const existing = await prisma.partnerixCharacter.findUnique({ where: { flowId: flow.id } })
  if (existing) return existing
  return prisma.partnerixCharacter.create({ data: { flowId: flow.id } })
}

export async function getPartnerixCharacter() {
  const character = await getOrCreateCharacter()
  if (!character) return null
  return prisma.partnerixCharacter.findUnique({
    where: { id: character.id },
    include: {
      animations: { orderBy: { order: "asc" } },
      behaviors: true,
      ctas: { orderBy: { order: "asc" } },
    },
  })
}

export type PartnerixCharacterFull = Awaited<ReturnType<typeof getPartnerixCharacter>>

export interface AnimationInput {
  _key: string
  key: string
  label: string
  file?: string | null
}

export interface BehaviorInput {
  trigger: string
  animationKey?: string | null
}

export interface CtaInput {
  label: string
  href?: string | null
  color: string
  hoverColor?: string | null
  icon?: string | null
  enabled: boolean
}

export interface PartnerixCharacterInput {
  name: string
  subtitle?: string | null
  description?: string | null
  avatar?: string | null
  model3d?: string | null
  defaultPose: string
  scale: number
  posX: number
  posY: number
  posZ: number
  rotX: number
  rotY: number
  rotZ: number
  shadowEnabled: boolean
  backgroundEffect: string
  glowEnabled: boolean
  glowColor: string
  robotColor: string
  neonColorPrimary: string
  neonColorSecondary: string
  theme: string
  bubbleBg: string
  bubbleTextColor: string
  bubbleBorderRadius: number
  bubbleShadow: string
  bubbleWidth: number
  bubbleFontFamily?: string | null
  bubbleFontSize: number
  bubbleAnimationDuration: number
  audioEnabled: boolean
  audioFile?: string | null
  audioVolume: number
  audioAutoplay: boolean
  audioSpeakingEffect: boolean
  enabled: boolean
  position: string
  desktopVisible: boolean
  mobileVisible: boolean
  height: string
  width: string
  marginTop?: string | null
  marginRight?: string | null
  marginBottom?: string | null
  marginLeft?: string | null
  padding?: string | null
  zIndex: number
  positionMobile?: string | null
  scaleMobile?: number | null
  heightMobile?: string | null
  widthMobile?: string | null
  hoverAnimation: string
  entranceAnimation: string
  talkingAnimation: string
  welcomeTitle?: string | null
  welcomeSubtitle?: string | null
  welcomeMessage?: string | null
  firstBubbleText?: string | null
  startButtonText: string
  welcomeAnimationKey?: string | null
  animations: AnimationInput[]
  behaviors: BehaviorInput[]
  ctas: CtaInput[]
}

export async function updatePartnerixCharacter(data: PartnerixCharacterInput): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    const character = await getOrCreateCharacter()
    if (!character) return { success: false, error: "Partnerix akışı bulunamadı" }

    // Bağımlılık sırası: önce karşılama animasyonu referansı temizlenir, sonra
    // davranışlar (animasyona referans verir), sonra animasyonlar silinebilir.
    await prisma.partnerixCharacter.update({ where: { id: character.id }, data: { welcomeAnimationId: null } })
    await prisma.partnerixBehavior.deleteMany({ where: { characterId: character.id } })
    await prisma.partnerixAnimation.deleteMany({ where: { characterId: character.id } })

    const animationKeyToId: Record<string, string> = {}
    for (let i = 0; i < data.animations.length; i++) {
      const a = data.animations[i]
      const created = await prisma.partnerixAnimation.create({
        data: { characterId: character.id, key: a.key, label: a.label, file: a.file || null, order: i },
      })
      animationKeyToId[a._key] = created.id
    }

    for (const b of data.behaviors) {
      await prisma.partnerixBehavior.create({
        data: {
          characterId: character.id,
          trigger: b.trigger,
          animationId: b.animationKey ? animationKeyToId[b.animationKey] ?? null : null,
        },
      })
    }

    await prisma.partnerixCta.deleteMany({ where: { characterId: character.id } })
    if (data.ctas.length) {
      await prisma.partnerixCta.createMany({
        data: data.ctas.map((c, i) => ({
          characterId: character.id,
          label: c.label,
          href: c.href || null,
          color: c.color,
          hoverColor: c.hoverColor || null,
          icon: c.icon || null,
          enabled: c.enabled,
          order: i,
        })),
      })
    }

    await prisma.partnerixCharacter.update({
      where: { id: character.id },
      data: {
        name: data.name,
        subtitle: data.subtitle || null,
        description: data.description || null,
        avatar: data.avatar || null,
        model3d: data.model3d || null,
        defaultPose: data.defaultPose,
        scale: data.scale,
        posX: data.posX,
        posY: data.posY,
        posZ: data.posZ,
        rotX: data.rotX,
        rotY: data.rotY,
        rotZ: data.rotZ,
        shadowEnabled: data.shadowEnabled,
        backgroundEffect: data.backgroundEffect,
        glowEnabled: data.glowEnabled,
        glowColor: data.glowColor,
        robotColor: data.robotColor,
        neonColorPrimary: data.neonColorPrimary,
        neonColorSecondary: data.neonColorSecondary,
        theme: data.theme,
        bubbleBg: data.bubbleBg,
        bubbleTextColor: data.bubbleTextColor,
        bubbleBorderRadius: data.bubbleBorderRadius,
        bubbleShadow: data.bubbleShadow,
        bubbleWidth: data.bubbleWidth,
        bubbleFontFamily: data.bubbleFontFamily || null,
        bubbleFontSize: data.bubbleFontSize,
        bubbleAnimationDuration: data.bubbleAnimationDuration,
        audioEnabled: data.audioEnabled,
        audioFile: data.audioFile || null,
        audioVolume: data.audioVolume,
        audioAutoplay: data.audioAutoplay,
        audioSpeakingEffect: data.audioSpeakingEffect,
        enabled: data.enabled,
        position: data.position,
        desktopVisible: data.desktopVisible,
        mobileVisible: data.mobileVisible,
        height: data.height,
        width: data.width,
        marginTop: data.marginTop || null,
        marginRight: data.marginRight || null,
        marginBottom: data.marginBottom || null,
        marginLeft: data.marginLeft || null,
        padding: data.padding || null,
        zIndex: data.zIndex,
        positionMobile: data.positionMobile || null,
        scaleMobile: data.scaleMobile ?? null,
        heightMobile: data.heightMobile || null,
        widthMobile: data.widthMobile || null,
        hoverAnimation: data.hoverAnimation,
        entranceAnimation: data.entranceAnimation,
        talkingAnimation: data.talkingAnimation,
        welcomeTitle: data.welcomeTitle || null,
        welcomeSubtitle: data.welcomeSubtitle || null,
        welcomeMessage: data.welcomeMessage || null,
        firstBubbleText: data.firstBubbleText || null,
        startButtonText: data.startButtonText,
        welcomeAnimationId: data.welcomeAnimationKey ? animationKeyToId[data.welcomeAnimationKey] ?? null : null,
      },
    })

    revalidatePath("/panel/partnerix/karakter")
    revalidatePath("/")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}
