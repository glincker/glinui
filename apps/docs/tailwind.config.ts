import type { Config } from "tailwindcss"
import glinPreset from "@glinui/tokens/tailwind-preset"

const config: Config = {
  presets: [glinPreset],
  // Class strategy plus theme scopes: `dark:` applies under .dark or [data-glin-theme=dark],
  // unless a nearer light scope ([data-glin-theme=light]) is present. See docs-local/variant-system.md.
  darkMode: [
    "variant",
    "&:where(.dark, .dark *, [data-glin-theme=dark], [data-glin-theme=dark] *):not(:where([data-glin-theme=light], [data-glin-theme=light] *))"
  ],
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/ui/dist/**/*.{js,mjs}",
    "../../packages/tokens/src/**/*.{css,ts}",
    "../../packages/motion/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)"
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        elevated: "var(--shadow-elevated)",
        glass: "var(--shadow-glass)"
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        normal: "var(--motion-normal)",
        slow: "var(--motion-slow)"
      },
      transitionTimingFunction: {
        standard: "var(--easing-standard)",
        emphasize: "var(--easing-emphasize)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "border-beam": {
          "0%": { "offset-distance": "0%" },
          "100%": { "offset-distance": "100%" }
        },
        "marquee-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-100% - var(--marquee-gap)))" }
        },
        "marquee-y": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(calc(-100% - var(--marquee-gap)))" }
        },
        "ripple-expand": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0" }
        },
        "meteor-fall": {
          "0%": { transform: "rotate(var(--meteor-angle, 215deg)) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "rotate(var(--meteor-angle, 215deg)) translateX(600px)", opacity: "0" }
        },
        "gradient-shift": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" }
        },
        "pulsate-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(1.5)", opacity: "0" }
        },
        "retro-grid-scroll": {
          "0%": { "background-position": "0 0" },
          "100%": { "background-position": "0 var(--retro-grid-cell, 60px)" }
        },
        orbit: {
          "0%": { transform: "rotate(calc(var(--orbit-start, 0) * 1deg)) translateY(calc(var(--orbit-radius, 100) * -1px)) rotate(calc(var(--orbit-start, 0) * -1deg))" },
          "100%": { transform: "rotate(calc(var(--orbit-start, 0) * 1deg + 360deg)) translateY(calc(var(--orbit-radius, 100) * -1px)) rotate(calc(var(--orbit-start, 0) * -1deg - 360deg))" }
        },
        "glow-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "word-rotate-in": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "word-rotate-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" }
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" }
        },
        "aurora-shift": {
          "0%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          "33%": { transform: "translate(30px, -50px) rotate(120deg) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) rotate(240deg) scale(0.9)" },
          "100%": { transform: "translate(0, 0) rotate(360deg) scale(1)" }
        },
        "particle-float": {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(var(--particle-distance, -200px)) translateX(var(--particle-drift, 20px))", opacity: "0" }
        },
        "prism-rotate": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" }
        },
        "chromatic-shift": {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(var(--chromatic-offset, 2px), calc(var(--chromatic-offset, 2px) * -1))" },
          "50%": { transform: "translate(0, var(--chromatic-offset, 2px))" },
          "75%": { transform: "translate(calc(var(--chromatic-offset, 2px) * -1), 0)" },
          "100%": { transform: "translate(0, 0)" }
        },
        "morphing-indicator": {
          "0%": { transform: "scaleX(0.8)", opacity: "0.6" },
          "100%": { transform: "scaleX(1)", opacity: "1" }
        },
        "dock-bounce": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0)" }
        },
        "mesh-shift": {
          "0%": { "background-position": "0% 0%" },
          "25%": { "background-position": "100% 0%" },
          "50%": { "background-position": "100% 100%" },
          "75%": { "background-position": "0% 100%" },
          "100%": { "background-position": "0% 0%" }
        },
        "ripple-press": {
          "0%": { transform: "translate(-50%,-50%) scale(0)", opacity: "0.5" },
          "100%": { transform: "translate(-50%,-50%) scale(4)", opacity: "0" }
        },
        "liquid-fill": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "light-leak-drift": {
          "0%": { transform: "translate(-30%, -30%) rotate(0deg)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translate(30%, 30%) rotate(45deg)", opacity: "0" }
        },
        "reveal-wipe": {
          "0%": { "clip-path": "inset(0 100% 0 0)" },
          "100%": { "clip-path": "inset(0 0 0 0)" }
        },
        "skeleton-shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "spotlight-pulse": {
          "0%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
          "100%": { opacity: "0.6", transform: "scale(1)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 200ms ease-out",
        "accordion-up": "accordion-up 200ms ease-out",
        "border-beam": "border-beam var(--border-beam-duration, 6s) linear infinite",
        "marquee-x": "marquee-x var(--marquee-duration, 30s) linear infinite",
        "marquee-y": "marquee-y var(--marquee-duration, 30s) linear infinite",
        "ripple-expand": "ripple-expand var(--ripple-duration, 2s) ease-out infinite",
        "meteor-fall": "meteor-fall var(--meteor-duration, 3s) linear infinite",
        "gradient-shift": "gradient-shift var(--gradient-duration, 6s) ease infinite",
        "pulsate-ring": "pulsate-ring var(--pulsate-duration, 2s) ease-out infinite",
        "retro-grid-scroll": "retro-grid-scroll var(--retro-grid-duration, 10s) linear infinite",
        orbit: "orbit var(--orbit-duration, 20s) linear infinite",
        "glow-rotate": "glow-rotate var(--glow-duration, 4s) linear infinite",
        "word-rotate-in": "word-rotate-in var(--word-rotate-duration, 0.3s) ease-out forwards",
        "word-rotate-out": "word-rotate-out var(--word-rotate-duration, 0.3s) ease-out forwards",
        blink: "blink 1s step-end infinite",
        "aurora-shift": "aurora-shift var(--aurora-duration, 8s) ease-in-out infinite",
        "particle-float": "particle-float var(--particle-duration, 5s) ease-out infinite",
        "prism-rotate": "prism-rotate var(--prism-duration, 3s) linear infinite",
        "chromatic-shift": "chromatic-shift var(--chromatic-duration, 4s) ease-in-out infinite",
        "morphing-indicator": "morphing-indicator 0.2s ease-out",
        "dock-bounce": "dock-bounce 0.4s ease-out",
        "mesh-shift": "mesh-shift var(--mesh-duration, 10s) ease-in-out infinite",
        "ripple-press": "ripple-press 0.6s ease-out forwards",
        "liquid-fill": "liquid-fill 0.3s ease-out forwards",
        "light-leak-drift": "light-leak-drift var(--light-leak-duration, 6s) ease-in-out infinite",
        "reveal-wipe": "reveal-wipe var(--reveal-duration, 0.8s) ease-out forwards",
        "skeleton-shimmer": "skeleton-shimmer 2s ease-in-out infinite",
        "spotlight-pulse": "spotlight-pulse var(--spotlight-pulse-duration, 3s) ease-in-out infinite"
      }
    }
  },
  plugins: []
}

export default config
