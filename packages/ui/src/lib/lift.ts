import { cva, type VariantProps } from "class-variance-authority"

/**
 * The glinr "lift" design language, extracted from CodePanel, InstallCommand and Card.
 * Spec and measurements: docs-local/design-dna.md
 *
 * Every string below is a complete literal so Tailwind can see it. Do not build
 * these classes by concatenation.
 *
 * Concentric corners: inner radius = outer radius minus the padding between them.
 * theme.css defines --lift-r-outer, --lift-pad and --lift-r-inner for that.
 */

/** Gradient hairline ring on the border box, sheen and flat face on the padding box. */
export const LIFT_RING =
  "border border-transparent [--face:var(--face-1,var(--surface-1))] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box]"

/**
 * liftShell: the outer raised container (cards, panels, popovers, dialogs, tables, code, accordions).
 * Large radius, gradient hairline ring, face-1 shell, elevation 1 to 3.
 */
export const liftShell = cva(
  `relative overflow-hidden text-[color:var(--color-foreground)] ${LIFT_RING}`,
  {
    variants: {
      radius: {
        lg: "rounded-[var(--radius-lg)]",
        xl: "rounded-[var(--lift-r-outer)]",
        "2xl": "rounded-[var(--radius-2xl)]"
      },
      elevation: {
        "1": "[box-shadow:var(--elev-1)]",
        "2": "[box-shadow:var(--elev-2)]",
        "3": "[box-shadow:var(--elev-3)]"
      },
      face: {
        "1": "[--face:var(--face-1,var(--surface-1))]",
        "0": "[--face:var(--face-0,var(--surface-0))]"
      }
    },
    defaultVariants: { radius: "xl", elevation: "2", face: "1" }
  }
)

/**
 * liftHeader: raised strip at the top of a shell (title, segmented controls, actions).
 * Sits on face-0 with a soft shadow that lets the well below read as recessed.
 */
export const liftHeader = cva(
  "relative z-[1] flex items-center justify-between gap-3 border-b border-[color:var(--line-soft)] [background:var(--sheen),var(--face-0,var(--surface-2))] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_8px_12px_-8px_rgb(0_0_0_/_0.35)]",
  {
    variants: {
      size: { sm: "px-3 py-2", md: "px-4 py-2.5", lg: "px-5 py-3" }
    },
    defaultVariants: { size: "md" }
  }
)

/**
 * liftWell: inset content area inside a shell (code, inputs, list bodies).
 * Margin equals --lift-pad so the inner radius stays concentric with the shell.
 */
export const liftWell = cva(
  "m-2 rounded-[var(--lift-r-inner)] bg-[var(--well,var(--surface-well))] [box-shadow:var(--elev-inset)]",
  {
    variants: {
      pad: { none: "", sm: "px-3 py-2", md: "px-4 py-3.5" },
      mono: {
        true: "font-mono text-[0.8125rem] leading-[1.7]",
        false: ""
      }
    },
    defaultVariants: { pad: "md", mono: false }
  }
)

/**
 * liftPill: fully round controls. `track` is the segmented container, `key` is a tactile
 * raised control (also the selected segment), `quiet` is an unselected segment.
 */
export const liftPill = cva("inline-flex items-center rounded-full font-medium transition-[transform,box-shadow,color,background-color] duration-fast ease-standard motion-reduce:transition-none", {
  variants: {
    kind: {
      track: `gap-1 p-[3px] [--face:var(--face-2,var(--surface-2))] [--ring-img:var(--ring)] border border-transparent [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-1)]`,
      key: "border border-transparent [--face:var(--face-3,var(--surface-3))] [--ring-img:var(--ring-hot,var(--ring))] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] text-[color:var(--color-foreground)] [box-shadow:var(--elev-1)] active:translate-y-px active:[box-shadow:var(--elev-inset)]",
      quiet: "border border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
    },
    size: { sm: "h-6 px-2 text-xs", md: "h-8 px-3 text-xs" }
  },
  defaultVariants: { kind: "key", size: "sm" }
})

/** Mono accent for commands, labels and file names. */
export const LIFT_MONO_LABEL = "truncate font-mono text-xs text-[color:var(--color-muted)]"

/** Flat shadcn-compatible container used by the `plain` look (1px border, small radius, shadow-sm). */
export const PLAIN_CONTAINER =
  "rounded-lg border border-[color:var(--color-border)] bg-[var(--surface-1)] text-[color:var(--color-foreground)] shadow-sm"

export type LiftShellProps = VariantProps<typeof liftShell>
export type LiftHeaderProps = VariantProps<typeof liftHeader>
export type LiftWellProps = VariantProps<typeof liftWell>
export type LiftPillProps = VariantProps<typeof liftPill>
