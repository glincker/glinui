export interface GlinTailwindPreset {
  /** Built-in animation plugin (animate-in/out, fade/zoom/slide, Radix height keyframes). */
  plugins: unknown[]
  theme: {
    extend: Record<string, unknown>
  }
}

/** Keys of the 4px spacing scale exposed as s-* utilities. */
export type GlinSpaceScaleKey = "s-1" | "s-2" | "s-3" | "s-4" | "s-5" | "s-6" | "s-8" | "s-10" | "s-12" | "s-16" | "s-20" | "s-30"

declare const preset: GlinTailwindPreset
export default preset
