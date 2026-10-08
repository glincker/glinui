/**
 * Glin UI animation plugin (Tailwind v3). Built in so consumers need no extra
 * dependency. Class semantics match tailwindcss-animate: animate-in/out driven by
 * the enter/exit keyframes and --tw-enter-* / --tw-exit-* custom properties.
 *
 * Reduced motion: translate, scale and rotate are neutralised, so only opacity
 * (a crossfade) remains. Durations also collapse via the tokens in theme.css.
 *
 * Exported as a plain { handler, config } object so no `tailwindcss/plugin`
 * import is needed from this package.
 */

const VAR_DURATION = "var(--tw-animation-duration, var(--tw-duration, var(--motion-overlay-in, 200ms)))"
const VAR_EXIT_DURATION = "var(--tw-animation-duration, var(--tw-duration, var(--motion-overlay-out, 140ms)))"
const TAIL = "var(--tw-animation-delay, 0s) var(--tw-animation-iteration-count, 1) var(--tw-animation-direction, normal) var(--tw-animation-fill-mode, none)"
const EASE_IN = "var(--tw-ease, var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1)))"
const EASE_OUT = "var(--tw-ease, var(--ease-in-out, cubic-bezier(0.77, 0, 0.175, 1)))"

const ENTER_VARS = ["opacity", "scale", "rotate", "translate-x", "translate-y"]

function resetVars(prefix) {
  const out = {}
  for (const v of ENTER_VARS) out[`--tw-${prefix}-${v}`] = "initial"
  return out
}

function neutralise(prefix) {
  const out = {}
  for (const v of ["scale", "rotate", "translate-x", "translate-y"]) out[`--tw-${prefix}-${v}`] = "initial !important"
  return out
}

function frame(prefix) {
  return {
    opacity: `var(--tw-${prefix}-opacity, 1)`,
    transform: `translate3d(var(--tw-${prefix}-translate-x, 0), var(--tw-${prefix}-translate-y, 0), 0) scale3d(var(--tw-${prefix}-scale, 1), var(--tw-${prefix}-scale, 1), var(--tw-${prefix}-scale, 1)) rotate(var(--tw-${prefix}-rotate, 0))`
  }
}

const REDUCE = "@media (prefers-reduced-motion: reduce)"

/** @param {{ addUtilities: Function, matchUtilities: Function, theme: Function }} api */
function handler({ addUtilities, matchUtilities, theme }) {
  addUtilities({
    ".animate-in": { ...resetVars("enter"), [REDUCE]: neutralise("enter") },
    ".animate-out": { ...resetVars("exit"), [REDUCE]: neutralise("exit") },
    ".running": { "animation-play-state": "running" },
    ".paused": { "animation-play-state": "paused" },
    ".fill-mode-none": { "animation-fill-mode": "none" },
    ".fill-mode-forwards": { "--tw-animation-fill-mode": "forwards", "animation-fill-mode": "forwards" },
    ".fill-mode-backwards": { "--tw-animation-fill-mode": "backwards", "animation-fill-mode": "backwards" },
    ".fill-mode-both": { "--tw-animation-fill-mode": "both", "animation-fill-mode": "both" },
    ".direction-normal": { "--tw-animation-direction": "normal", "animation-direction": "normal" },
    ".direction-reverse": { "--tw-animation-direction": "reverse", "animation-direction": "reverse" },
    ".direction-alternate": { "--tw-animation-direction": "alternate", "animation-direction": "alternate" },
    ".direction-alternate-reverse": { "--tw-animation-direction": "alternate-reverse", "animation-direction": "alternate-reverse" },
    ".repeat-infinite": { "--tw-animation-iteration-count": "infinite", "animation-iteration-count": "infinite" },
    ".repeat-1": { "--tw-animation-iteration-count": "1", "animation-iteration-count": "1" }
  })

  const opacity = theme("animationOpacity") || theme("opacity")
  const scale = theme("animationScale") || theme("scale")
  const rotate = theme("animationRotate") || theme("rotate")
  const translate = theme("animationTranslate") || theme("translate")

  const pair = (name, prop, values, fn) => {
    for (const prefix of ["enter", "exit"]) {
      const dir = prefix === "enter" ? "in" : "out"
      matchUtilities(
        { [`${name === "slide" ? "slide-" + dir + "-from" : name + "-" + dir}`]: (v) => fn(prefix, v) },
        { values }
      )
    }
  }

  // fade-in-*, fade-out-*
  pair("fade", "opacity", { DEFAULT: "0", ...opacity }, (p, v) => ({ [`--tw-${p}-opacity`]: String(v) }))
  // zoom-in-*, zoom-out-*
  pair("zoom", "scale", { DEFAULT: "0", ...scale }, (p, v) => ({ [`--tw-${p}-scale`]: String(v) }))
  // spin-in-*, spin-out-*
  pair("spin", "rotate", { DEFAULT: "30deg", ...rotate }, (p, v) => ({ [`--tw-${p}-rotate`]: String(v) }))

  // slide-in-from-{dir}-*, slide-out-to-{dir}-*
  const dirs = {
    top: ["translate-y", -1],
    bottom: ["translate-y", 1],
    left: ["translate-x", -1],
    right: ["translate-x", 1]
  }
  const values = { DEFAULT: "100%", ...translate }
  const signed = (v, sign) => (sign < 0 ? `calc(${v} * -1)` : String(v))
  for (const [dir, [axis, sign]] of Object.entries(dirs)) {
    matchUtilities({ [`slide-in-from-${dir}`]: (v) => ({ [`--tw-enter-${axis}`]: signed(v, sign) }) }, { values })
    matchUtilities({ [`slide-out-to-${dir}`]: (v) => ({ [`--tw-exit-${axis}`]: signed(v, sign) }) }, { values })
  }

  // duration, delay and ease classes also feed animations through custom
  // properties. Static (not matchUtilities) on purpose: redefining the dynamic
  // utilities would make arbitrary values like duration-[200ms] ambiguous and
  // Tailwind would drop them. For arbitrary values use [--tw-duration:...],
  // [--tw-animation-delay:...] or [--tw-ease:...].
  const feed = (prefix, themeKey, varName, prop) => {
    const out = {}
    for (const [key, value] of Object.entries(theme(themeKey) || {})) {
      if (key === "DEFAULT" || typeof value !== "string") continue
      out[`.${prefix}-${key}`] = { [varName]: value, [prop]: value }
    }
    addUtilities(out)
  }
  feed("duration", "transitionDuration", "--tw-duration", "transition-duration")
  feed("delay", "transitionDelay", "--tw-animation-delay", "transition-delay")
  feed("ease", "transitionTimingFunction", "--tw-ease", "transition-timing-function")
}

const config = {
  theme: {
    extend: {
      keyframes: {
        enter: { from: frame("enter") },
        exit: { to: frame("exit") },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" }
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        in: `enter ${VAR_DURATION} ${EASE_IN} ${TAIL}`,
        out: `exit ${VAR_EXIT_DURATION} ${EASE_OUT} ${TAIL}`,
        "accordion-down": "accordion-down var(--motion-overlay-in, 200ms) var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1))",
        "accordion-up": "accordion-up var(--motion-overlay-out, 140ms) var(--ease-in-out, cubic-bezier(0.77, 0, 0.175, 1))",
        "collapsible-down": "collapsible-down var(--motion-overlay-in, 200ms) var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1))",
        "collapsible-up": "collapsible-up var(--motion-overlay-out, 140ms) var(--ease-in-out, cubic-bezier(0.77, 0, 0.175, 1))"
      }
    }
  }
}

module.exports = { handler, config }
