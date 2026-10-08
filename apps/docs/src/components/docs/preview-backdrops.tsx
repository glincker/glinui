"use client"

import { getStageDefault } from "@/lib/stage-defaults"
import { cn } from "@glinui/ui"

export type PreviewBg = "mesh" | "light" | "dark" | "vivid" | "photo"

export const previewBgClasses: Record<PreviewBg, string> = {
  mesh: [
    "bg-[radial-gradient(circle_at_20%_30%,rgb(196_181_253_/_0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgb(125_211_252_/_0.12),transparent_50%),linear-gradient(180deg,rgb(240_240_244_/_0.7),rgb(228_228_232_/_0.5))]",
    "dark:bg-[radial-gradient(circle_at_20%_30%,rgb(196_181_253_/_0.06),transparent_50%),radial-gradient(circle_at_80%_70%,rgb(125_211_252_/_0.06),transparent_50%),linear-gradient(180deg,rgb(255_255_255_/_0.04),rgb(255_255_255_/_0.015))]"
  ].join(" "),
  light: "bg-white",
  dark: "bg-neutral-900",
  vivid:
    "bg-[linear-gradient(135deg,rgb(99_102_241),rgb(168_85_247),rgb(236_72_153))] dark:bg-[linear-gradient(135deg,rgb(79_70_229),rgb(147_51_234),rgb(219_39_119))]",
  photo: [
    "bg-[radial-gradient(ellipse_40%_50%_at_15%_20%,rgb(251_146_60_/_0.85),transparent_70%),radial-gradient(ellipse_45%_55%_at_85%_15%,rgb(56_189_248_/_0.85),transparent_70%),radial-gradient(ellipse_50%_60%_at_70%_90%,rgb(232_121_249_/_0.8),transparent_70%),radial-gradient(ellipse_45%_50%_at_20%_85%,rgb(52_211_153_/_0.7),transparent_70%),linear-gradient(135deg,rgb(30_27_75),rgb(49_46_129))]",
    "dark:bg-[radial-gradient(ellipse_40%_50%_at_15%_20%,rgb(234_88_12_/_0.7),transparent_70%),radial-gradient(ellipse_45%_55%_at_85%_15%,rgb(2_132_199_/_0.75),transparent_70%),radial-gradient(ellipse_50%_60%_at_70%_90%,rgb(192_38_211_/_0.65),transparent_70%),radial-gradient(ellipse_45%_50%_at_20%_85%,rgb(5_150_105_/_0.55),transparent_70%),linear-gradient(135deg,rgb(15_14_40),rgb(30_27_75))]"
  ].join(" ")
}

const previewSwatchClasses: Record<PreviewBg, string> = {
  mesh: "bg-[linear-gradient(135deg,rgb(196_181_253_/_0.3),rgb(125_211_252_/_0.3))]",
  light: "bg-white",
  dark: "bg-neutral-900",
  vivid: "bg-[linear-gradient(135deg,rgb(99_102_241),rgb(236_72_153))]",
  photo: "bg-[linear-gradient(135deg,rgb(251_146_60),rgb(56_189_248),rgb(232_121_249))]"
}

export type PreviewScope = {
  "data-glin-theme"?: "light" | "dark"
  "data-glass-luminance"?: "bright" | "dim" | "neutral"
}

/**
 * Theme scope a backdrop establishes on the stage so components adapt:
 * light backdrop forces the light tokens, dark/vivid/photo force the dark tokens,
 * mesh follows the site theme.
 */
export function backdropScope(bg: PreviewBg): PreviewScope {
  switch (bg) {
    case "light":
      return { "data-glin-theme": "light", "data-glass-luminance": "bright" }
    case "dark":
      return { "data-glin-theme": "dark", "data-glass-luminance": "dim" }
    case "vivid":
    case "photo":
      return { "data-glin-theme": "dark", "data-glass-luminance": "neutral" }
    default:
      return {}
  }
}

const previewBgLabels: Record<PreviewBg, string> = {
  mesh: "Preview on mesh background (follows site theme)",
  light: "Preview on light background",
  dark: "Preview on dark background",
  vivid: "Preview on vivid gradient background",
  photo: "Preview on photo background"
}

const GLASSY = /glass|liquid|blur|aurora/i

/** Glass and translucent components need a colorful backdrop to read. */
export function defaultBackdropFor(componentId: string, badge?: string): PreviewBg {
  const override = getStageDefault(componentId)?.backdrop
  if (override) return override
  return GLASSY.test(componentId) || (badge ? GLASSY.test(badge) : false) ? "photo" : "mesh"
}

export function BackgroundSwitcher({
  value,
  onChange,
  className
}: {
  value: PreviewBg
  onChange: (bg: PreviewBg) => void
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label="Preview background"
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border/60 bg-white/70 px-1.5 py-1 backdrop-blur-md dark:bg-neutral-900/70",
        className
      )}
    >
      {(Object.keys(previewBgClasses) as PreviewBg[]).map((bg) => (
        <button
          key={bg}
          type="button"
          onClick={() => onChange(bg)}
          aria-label={previewBgLabels[bg]}
          title={previewBgLabels[bg]}
          aria-pressed={value === bg}
          className={cn(
            "size-4 rounded-full border transition-[box-shadow,border-color] duration-150 motion-reduce:transition-none",
            previewSwatchClasses[bg],
            value === bg
              ? "border-neutral-400 shadow-[0_0_0_2px_rgb(255_255_255),0_0_0_3.5px_var(--color-accent)] dark:border-neutral-500 dark:shadow-[0_0_0_2px_rgb(23_23_23),0_0_0_3.5px_var(--color-accent)]"
              : "border-black/10 hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
          )}
        />
      ))}
    </div>
  )
}
