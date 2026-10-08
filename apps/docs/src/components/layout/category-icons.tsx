import type { ComponentType } from "react"
import {
  Bell,
  Cards,
  Compass,
  CursorClick,
  Gradient,
  Layout,
  Lightning,
  Sparkle,
  SquaresFour,
  Stack,
  Table,
  TextAa,
  Textbox,
  type IconProps
} from "@phosphor-icons/react"

const icons: Record<string, ComponentType<IconProps>> = {
  Bell,
  Cards,
  Compass,
  CursorClick,
  Gradient,
  Layout,
  Lightning,
  Sparkle,
  SquaresFour,
  Stack,
  Table,
  TextAa,
  Textbox
}

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Lightning
  return <Icon className={className} aria-hidden="true" />
}
