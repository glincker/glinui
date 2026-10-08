import type { ReactElement, SVGProps } from "react"

/**
 * Own marks of GLINCKER products, copied from the sibling repos' favicons and logos.
 * Each is a small typed SVG, decorative (aria-hidden), no external requests.
 */
export type OwnLogoName = "theauth" | "thesvg" | "levelrail" | "glinr"
type LogoProps = Omit<SVGProps<SVGSVGElement>, "children">

const base = { "aria-hidden": true, focusable: false } as const

function Theauth(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...base} {...props}>
      <rect width="32" height="32" rx="8" fill="#0b0b12" />
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" stroke="#ffffff" strokeWidth="1.5" />
      <rect x="8" y="8" width="16" height="16" rx="4.5" stroke="#b6abff" strokeWidth="1.5" />
      <rect x="13" y="13" width="6" height="6" rx="2" fill="#eef35f" />
    </svg>
  )
}

function Thesvg(props: LogoProps) {
  return (
    <svg viewBox="0 0 512 512" fill="none" {...base} {...props}>
      <rect width="512" height="512" rx="108" fill="#09090B" />
      <rect x="184" y="84" width="220" height="220" rx="40" fill="#C2410C" />
      <rect x="148" y="120" width="220" height="220" rx="40" fill="#EA580C" />
      <rect x="112" y="156" width="220" height="220" rx="40" fill="#F97316" />
      <path d="M188 248 L168 266 L188 284 M256 248 L276 266 L256 284" stroke="#FFF7ED" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Levelrail(props: LogoProps) {
  return (
    <svg viewBox="0 0 256 256" {...base} {...props}>
      <rect x="10" y="174" width="236" height="68" rx="22" fill="#06232C" />
      <rect x="10" y="162" width="236" height="68" rx="22" fill="#084F67" />
      <rect x="42" y="103" width="172" height="68" rx="22" fill="#06232C" />
      <rect x="42" y="91" width="172" height="68" rx="22" fill="#107292" />
      <rect x="75" y="32" width="106" height="68" rx="22" fill="#06232C" />
      <rect x="75" y="20" width="106" height="68" rx="22" fill="#58B1CE" />
    </svg>
  )
}

const GLINR_PATH =
  "M 53.10 187.5 C 89.17 151.42 125.25 115.35 161.39 79.19 L 161.39 26.10 C 107.62 79.87 53.77 133.72 0 187.5 C 53.77 241.27 107.62 295.12 161.39 348.89 L 161.39 295.80 C 125.32 259.72 89.17 223.57 53.10 187.5 Z M 268.80 187.5 L 242.25 160.94 C 224.02 179.17 205.80 197.39 187.5 215.69 L 159.30 187.5 C 186.37 160.42 213.52 133.27 240.60 106.19 C 267.67 133.27 294.82 160.35 321.89 187.5 C 285.97 223.42 249.97 259.42 214.05 295.35 L 187.5 268.80 C 214.57 241.72 241.72 214.57 268.80 187.5 Z M 187.5 268.80 L 187.5 375 C 249.97 312.52 312.52 249.97 375 187.5 C 312.52 125.02 249.97 62.47 187.5 0 L 187.5 106.19 C 160.42 133.27 133.27 160.35 106.19 187.5 C 133.72 215.02 160.35 241.57 187.5 268.80 Z M 187.5 268.80"

function Glinr(props: LogoProps) {
  return (
    <svg viewBox="0 0 375 375" {...base} {...props}>
      <path fill="currentColor" fillRule="evenodd" d={GLINR_PATH} />
    </svg>
  )
}

const LOGOS: Record<OwnLogoName, (props: LogoProps) => ReactElement> = {
  theauth: Theauth,
  thesvg: Thesvg,
  levelrail: Levelrail,
  glinr: Glinr
}

export function OwnLogo({ name, ...props }: LogoProps & { name: OwnLogoName }) {
  const Logo = LOGOS[name]
  return <Logo {...props} />
}
