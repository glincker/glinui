import { cva } from "class-variance-authority"

/** Track + thumb geometry per size. Every class is an explicit arbitrary value (never off-scale). */
export const SWITCH_SIZES = {
  sm: {
    track: "h-5 w-9 [--sw-travel:1rem]",
    thumb: "size-[1rem]",
    icon: "[&_svg]:size-[0.625rem]",
    spinner: "size-[0.625rem]",
    hit: "after:-inset-x-1 after:-inset-y-3"
  },
  md: {
    track: "h-6 w-11 [--sw-travel:1.25rem]",
    thumb: "size-[1.25rem]",
    icon: "[&_svg]:size-[0.75rem]",
    spinner: "size-[0.75rem]",
    hit: "after:-inset-x-0 after:-inset-y-2.5"
  },
  lg: {
    track: "h-7 w-[3.25rem] [--sw-travel:1.5rem]",
    thumb: "size-[1.5rem]",
    icon: "[&_svg]:size-[0.875rem]",
    spinner: "size-[0.875rem]",
    hit: "after:-inset-x-0 after:-inset-y-2"
  }
} as const

export type SwitchSize = keyof typeof SWITCH_SIZES

export const SWITCH_MOTION =
  "transition-transform duration-200 ease-[cubic-bezier(0.3,1.2,0.5,1)] motion-reduce:transition-none [[data-glin-motion=none]_&]:transition-none [[data-glin-motion=subtle]_&]:transition-none"

export const switchVariants = cva(
  [
    "group peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full outline-none",
    "after:absolute after:content-['']",
    "transition-[background-color,box-shadow] duration-200 ease-standard",
    "motion-reduce:transition-none [[data-glin-motion=none]_&]:transition-none [[data-glin-motion=subtle]_&]:transition-none",
    "focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[loading=true]:cursor-progress data-[loading=true]:disabled:opacity-100"
  ].join(" "),
  {
    variants: {
      variant: {
        glinr: [
          "bg-[var(--surface-well)] [box-shadow:var(--elev-inset),inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_16%,transparent)] hover:enabled:brightness-[0.97]",
          "data-[state=checked]:bg-[var(--sw-active,var(--color-accent))]",
          "data-[state=checked]:[box-shadow:var(--solid-elev-1)]"
        ].join(" "),
        solid: [
          "[--sw-on-fg:var(--neutral-solid-fg)]",
          "bg-[var(--surface-3)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_18%,transparent)] [--sw-thumb:#ffffff]",
          "data-[state=checked]:[--sw-thumb:var(--neutral-solid-fg)] data-[state=checked]:bg-[var(--sw-active,var(--neutral-solid))] data-[state=checked]:[box-shadow:var(--solid-elev-1)]"
        ].join(" "),
        plain: [
          "bg-[color-mix(in_oklab,var(--color-foreground)_20%,transparent)] [--sw-thumb:#ffffff] [--sw-on-fg:var(--neutral-solid-fg)]",
          "data-[state=checked]:[--sw-thumb:var(--neutral-solid-fg)] data-[state=checked]:bg-[var(--sw-active,var(--neutral-solid))]"
        ].join(" "),
        soft: [
          "bg-[var(--surface-2)] shadow-[inset_0_0_0_1px_var(--line-soft)] [--sw-thumb:#ffffff] [--sw-on-fg:var(--tone-accent-fg)]",
          "data-[state=checked]:bg-[var(--sw-active,color-mix(in_oklab,var(--tone-accent)_80%,var(--surface-1)))]"
        ].join(" "),
        outline: [
          "bg-transparent shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--color-foreground)_40%,transparent)] [--sw-thumb:var(--color-muted)] [--sw-on-fg:var(--tone-accent-fg)]",
          "data-[state=checked]:bg-[color-mix(in_oklab,var(--tone-accent)_14%,transparent)] data-[state=checked]:[--sw-thumb:var(--tone-accent)] data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--tone-accent)]"
        ].join(" "),
        ghost: [
          "bg-[color-mix(in_oklab,var(--color-foreground)_10%,transparent)] [--sw-thumb:#ffffff] [--sw-on-fg:var(--neutral-solid-fg)]",
          "data-[state=checked]:[--sw-thumb:var(--neutral-solid-fg)] data-[state=checked]:bg-[color-mix(in_oklab,var(--color-foreground)_70%,transparent)]"
        ].join(" "),
        default: [
          "bg-[var(--surface-3)] [box-shadow:var(--elev-inset),inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_12%,transparent)] hover:enabled:brightness-[0.97]",
          "data-[state=checked]:bg-[var(--sw-active,var(--color-accent))]",
          "data-[state=checked]:shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_0_0_1px_rgb(0_0_0/0.08)]"
        ].join(" "),
        glass: [
          "bg-[color-mix(in_oklab,var(--surface-3)_62%,transparent)] backdrop-blur-md backdrop-saturate-[180%] dark:bg-[color-mix(in_oklab,white_26%,transparent)]",
          "[box-shadow:inset_0_0_0_1px_rgb(15_23_42/0.16),inset_0_1px_0_var(--glass-refraction-top),var(--shadow-soft)]",
          "dark:[box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.16),inset_0_1px_0_var(--glass-refraction-top),var(--shadow-soft)]",
          "data-[state=checked]:[box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.28),inset_0_1px_0_rgb(255_255_255/0.4),var(--shadow-soft)]"
        ].join(" "),
        frosted: [
          "bg-[var(--glass-3-surface)] backdrop-blur-[40px] backdrop-saturate-[200%]",
          "[box-shadow:inset_0_0_0_1px_rgb(15_23_42/0.18),inset_0_1px_0_var(--glass-refraction-top),var(--shadow-soft)]",
          "dark:[box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.18),inset_0_1px_0_var(--glass-refraction-top),var(--shadow-soft)]"
        ].join(" "),
        liquid: [
          "bg-[linear-gradient(165deg,color-mix(in_oklab,var(--surface-1)_70%,transparent),color-mix(in_oklab,var(--surface-3)_55%,transparent))] backdrop-blur-xl backdrop-saturate-[180%]",
          "shadow-[inset_0_0_0_1px_rgb(15_23_42/0.14),inset_0_1px_0_rgb(255_255_255/0.6),0_2px_6px_rgb(0_0_0/0.06)]",
          "data-[state=checked]:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3),inset_0_1px_0_rgb(255_255_255/0.5),0_0_14px_color-mix(in_oklab,var(--color-accent)_30%,transparent)]"
        ].join(" "),
        matte: [
          "bg-[var(--surface-3)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]",
          "data-[state=checked]:bg-[var(--sw-active,var(--color-accent))]"
        ].join(" ")
      }
    },
    defaultVariants: { variant: "glinr" }
  }
)

/** Track-level liquid fill, scales from the inline start. */
export const FILL_CLASS = [
  "absolute inset-0 origin-left rtl:origin-right scale-x-0 rounded-full",
  "group-data-[state=checked]:scale-x-100",
  "bg-[linear-gradient(135deg,var(--sw-active,var(--color-accent)),color-mix(in_oklab,var(--sw-active,var(--color-accent))_72%,transparent))]",
  SWITCH_MOTION
].join(" ")

export const THUMB_BG_CLASS = [
  "absolute inset-0 rounded-full bg-[var(--sw-thumb,#ffffff)] [box-shadow:var(--elev-1),0_0_0_0.5px_rgb(0_0_0/0.14)]",
  "origin-left rtl:origin-right group-data-[state=checked]:origin-right rtl:group-data-[state=checked]:origin-left",
  "group-enabled:group-active:scale-x-[1.15]",
  SWITCH_MOTION
].join(" ")
