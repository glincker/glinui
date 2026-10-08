/**
 * Glin UI Tailwind preset. Maps the CSS variables in theme.css to utilities.
 *
 * Colour vars are OKLCH (not rgb triplets), so the `<alpha-value>` placeholder
 * cannot be used. Instead each colour is a function: with no opacity modifier it
 * returns the bare var(), with a modifier (bg-surface-1/50) it returns
 * color-mix(in oklab, var(--x) 50%, transparent).
 *
 * --line-soft is already a translucent rgb value and is referenced directly
 * (the opacity modifier is not applied to it).
 */

/** @param {string} name */
function token(name) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined || opacityValue === "1" || String(opacityValue).startsWith("var(--tw-")) return `var(${name})`
    return `color-mix(in oklab, var(${name}) calc(${opacityValue} * 100%), transparent)`
  }
}

const SPACE_SCALE = Object.fromEntries(
  [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 30].map((n) => [`s-${n}`, `var(--s-${n})`])
)

const animate = require("./tailwind-animate.cjs")

/** @type {import("./tailwind-preset").GlinTailwindPreset} */
const preset = {
  plugins: [animate],
  theme: {
    extend: {
      colors: {
        background: token("--color-background"),
        foreground: token("--color-foreground"),
        border: token("--color-border"),
        surface: {
          DEFAULT: token("--color-surface"),
          0: token("--surface-0"),
          1: token("--surface-1"),
          2: token("--surface-2"),
          3: token("--surface-3"),
          well: token("--surface-well")
        },
        brand: {
          DEFAULT: token("--color-brand"),
          foreground: token("--color-brand-foreground")
        },
        accent: {
          DEFAULT: token("--color-accent"),
          foreground: token("--color-accent-foreground")
        },
        muted: token("--color-muted"),
        subtle: token("--color-subtle"),
        line: { soft: "var(--line-soft)" },
        face: { 0: token("--face-0"), 1: token("--face-1"), 2: token("--face-2") },
        floor: { 1: token("--floor-1"), 2: token("--floor-2") },
        well: token("--well"),
        key: {
          DEFAULT: token("--key-bottom"),
          top: token("--key-top"),
          bottom: token("--key-bottom"),
          "white-top": token("--key-white-top"),
          "white-bottom": token("--key-white-bottom"),
          foreground: token("--key-foreground")
        },
        signal: {
          live: token("--color-signal-live"),
          ok: token("--color-signal-ok")
        }
      },
      boxShadow: {
        "elev-1": "var(--elev-1)",
        "elev-2": "var(--elev-2)",
        "elev-3": "var(--elev-3)",
        "elev-inset": "var(--elev-inset)",
        "drop-1": "var(--drop-1)",
        "drop-2": "var(--drop-2)",
        "drop-3": "var(--drop-3)",
        "drop-hover": "var(--drop-hover)",
        hl: "var(--hl)",
        "hl-top": "var(--hl-top)",
        "hl-strong": "var(--hl-strong)"
      },
      backgroundImage: {
        grain: "var(--grain)",
        "glow-top": "var(--glow-top)",
        ring: "var(--ring)",
        "ring-hot": "var(--ring-hot)",
        "ring-brand": "var(--ring-brand)",
        "ring-violet": "var(--ring-violet)",
        sheen: "var(--sheen)",
        hairline: "var(--hairline)"
      },
      borderRadius: {
        card: "var(--radius-card)",
        input: "var(--radius-input)",
        pill: "var(--radius-pill)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      fontSize: {
        caption: "var(--text-caption)",
        body: "var(--text-body)",
        lead: "var(--text-lead)",
        sub: "var(--text-sub)",
        h3: "var(--text-h3)",
        h2: "var(--text-h2)",
        display: "var(--text-display)"
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
        drawer: "var(--ease-drawer)"
      },
      maxWidth: {
        layout: "var(--layout-max)"
      },
      spacing: {
        gutter: "var(--layout-gutter)",
        section: "var(--layout-section)",
        nav: "var(--layout-nav-h)",
        ...SPACE_SCALE
      }
    }
  }
}

module.exports = preset
