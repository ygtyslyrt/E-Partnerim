"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import Image from "next/image";

/* ────────────────────────────────────────────────────────────────
   Partnerix Karakteri — TEK render katmanı.

   Bugün: PNG + CSS/framer-motion ile çiziyor.
   Yarın: gerçek bir .glb modeli eklendiğinde SADECE bu dosyanın
   içi bir 3D sahneyle değiştirilecek — dışarıdan (prop arayüzü,
   şema, admin formu) hiçbir şey değişmeyecek. `scale`/`posX`/`posY`
   alanları bugün 2D CSS transform, yarın 3D world-position anlamına
   gelecek şekilde jenerik tutuluyor.
──────────────────────────────────────────────────────────────── */

export interface CharacterVisualStyle {
  avatar: string | null;
  scale: number;
  posX: number;
  posY: number;
  color: string;
  shadowEnabled: boolean;
  glowEnabled: boolean;
  glowColor: string;
  neonSecondary: string;
  backgroundEffect: string;
  hoverAnimation: string;    // none | scale | bounce | rotate | glow
  talkingAnimation: string;  // none | pulse | bounce | shake
  isTalking: boolean;
  zIndex: number;
}

const CARD_H = 460; // Wizard kart yüksekliği ile hizalı — asla değişmez

const HOVER_VARIANTS: Record<string, TargetAndTransition> = {
  scale: { scale: 1.06 },
  bounce: { y: -8 },
  rotate: { rotate: 4 },
  glow: {},
  none: {},
};

export default function PartnerixCharacterVisual({ style }: { style: CharacterVisualStyle }) {
  const [hovering, setHovering] = useState(false);

  const glowBackground = style.backgroundEffect === "gradient"
    ? `linear-gradient(135deg, ${style.glowColor} 0%, ${style.neonSecondary} 100%)`
    : style.glowColor;

  const glowOpacity = style.hoverAnimation === "glow" && hovering ? 0.22 : 0.10;

  const talkingAnimate = !style.isTalking || style.talkingAnimation === "none"
    ? {}
    : style.talkingAnimation === "pulse"
    ? { scale: [1, 1.05, 1] }
    : style.talkingAnimation === "bounce"
    ? { y: [0, -7, 0] }
    : style.talkingAnimation === "shake"
    ? { x: [0, -3, 3, -3, 3, 0] }
    : {};

  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: 200,
        height: CARD_H,
        zIndex: style.zIndex,
        transform: `translate(${style.posX}px, ${style.posY}px) scale(${style.scale})`,
      }}
    >
      {/* Zemin parıltısı */}
      {style.glowEnabled && style.backgroundEffect !== "none" && (
        <motion.div
          className="absolute bottom-0 left-1/2 h-16 w-40 -translate-x-1/2 rounded-full"
          animate={{ opacity: glowOpacity }}
          transition={{ duration: 0.3 }}
          style={{ background: glowBackground, filter: "blur(28px)" }}
        />
      )}

      {/* Hover katmanı */}
      <motion.div
        className="absolute inset-0"
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
        whileHover={HOVER_VARIANTS[style.hoverAnimation] ?? {}}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Konuşma animasyonu katmanı */}
        <motion.div
          className="absolute inset-0"
          animate={talkingAnimate}
          transition={{ duration: 0.6, repeat: style.isTalking ? Infinity : 0, ease: "easeInOut" }}
        >
          {/* Float */}
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          >
            {/* Sway */}
            <motion.div
              className="absolute inset-0"
              animate={{ x: [0, 3, -2, 3, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Wave (hafif el sallama) */}
              <motion.div
                className="absolute inset-0"
                style={{ transformOrigin: "bottom center" }}
                animate={{ rotate: [0, -2.5, 0, -2.5, 0, 0, 0, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
              >
                {/* Breathe */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.014, 1] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src={style.avatar || "/partnerix-robot.png"}
                    alt="Partnerix AI Danışmanı"
                    fill
                    className="object-contain object-bottom"
                    style={style.shadowEnabled ? { filter: "drop-shadow(0 14px 28px rgba(79,70,229,0.10))" } : undefined}
                    priority
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Ayak altı gölgesi */}
      {style.shadowEnabled && (
        <motion.div
          animate={{ scaleX: [1, 0.74, 1], opacity: [0.13, 0.04, 0.13] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 h-2.5 w-28 -translate-x-1/2 rounded-full"
          style={{ background: "#1E1B4B", filter: "blur(8px)" }}
        />
      )}
    </div>
  );
}
