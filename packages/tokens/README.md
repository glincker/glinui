# @glinui/tokens

Design tokens for Glin UI. OKLCH color system, glass elevation levels, blur tiers, and shadow primitives.

## Install

```bash
npm install @glinui/tokens
```

## Usage

Import the CSS theme in your app entry:

```tsx
import "@glinui/tokens/theme.css"
```

Use tokens in your Tailwind classes or CSS:

```css
.my-card {
  background: var(--glass-3-surface);
  box-shadow: var(--glass-3-shadow);
  border-top-color: var(--glass-refraction-top);
  backdrop-filter: blur(var(--glass-blur-md));
}
```

## Token Categories

- **Colors**: OKLCH: `--color-background`, `--color-foreground`, `--color-accent`, etc.
- **Glass surfaces**: 5 elevation levels: `--glass-{1-5}-surface`, `--glass-{1-5}-shadow`
- **Blur tiers**: `--glass-blur-sm/md/lg/xl`
- **Shadows**: `--shadow-glass-sm/md/lg`
- **Refraction**: `--glass-refraction-top` for top edge highlight

## Tailwind preset

```ts
// tailwind.config.ts
import glinPreset from "@glinui/tokens/tailwind-preset"

export default { presets: [glinPreset], content: [/* ... */] }
```

Import `@glinui/tokens/theme.css` so the variables exist. The preset only extends the theme, so existing keys are kept.

| Utility | Maps to |
| --- | --- |
| `bg-surface`, `bg-surface-0/1/2/3`, `bg-surface-well` | `--color-surface`, `--surface-*` |
| `bg-background`, `text-foreground`, `border-border` | semantic colours |
| `text-muted`, `text-subtle` | `--color-muted`, `--color-subtle` |
| `bg-brand`, `text-brand-foreground`, `bg-accent`, `text-accent-foreground` | brand and accent |
| `text-signal-live`, `bg-signal-ok` | `--color-signal-*` |
| `border-line-soft` | `--line-soft` |
| `shadow-elev-1/2/3`, `shadow-elev-inset` | `--elev-*` |
| `shadow-drop-1/2/3` | `--drop-*` |
| `rounded-card`, `rounded-input`, `rounded-pill` | `--radius-*` |
| `font-sans`, `font-mono` | `--font-sans`, `--font-mono` |
| `text-caption/body/lead/sub/h3/h2/display` | `--text-*` (use Tailwind `text-sm` for the sm step) |
| `ease-out`, `ease-in-out`, `ease-drawer` | `--ease-*` |
| `max-w-layout` | `--layout-max` |
| `p-gutter`, `px-gutter`, `py-section`, `h-nav` | `--layout-gutter`, `--layout-section`, `--layout-nav-h` |

### Opacity modifier

Colour vars are OKLCH, not rgb triplets, so `rgb(var(--x) / <alpha-value>)` cannot work. Each colour is a function that returns the bare `var()` normally and `color-mix(in oklab, var(--x) 50%, transparent)` for `bg-surface-1/50`. This needs a browser with `color-mix` support. `border-line-soft` is already translucent and ignores the modifier.

## Documentation

[glinui.com/docs/tokens](https://glinui.com/docs/tokens)

## License

MIT

## theauth parity: how to reproduce the signatures

Import the tokens and the utilities, then compose classes. Utilities live in `@layer glinui-utilities`, so any unlayered or later-layer rule overrides them.

```css
@import "@glinui/tokens/theme.css";
@import "@glinui/tokens/utilities.css";
```

| Utility | Look |
| --- | --- |
| `.lift` + `.lift-1/2/3` | Sheen over a solid face, 1px gradient ring, layered elevation (`--elev`) |
| `.face-0/1/2` | Face tone under the sheen (surface scale) |
| `.ring-hot`, `.ring-brand` | Brighter white ring, brand-tinted ring |
| `.well` | Recessed inset surface |
| `.hairline-top` | 1px top-lit divider that fades at both ends |
| `.floor-1/2` | Faintly lifted section floor so shadows read |
| `.grain-glow` | Static dotted glow (violet, teal, lime), tune with `--glow-a/b/c` and `--glow-height` |
| `.grain-glow-hover` | Pointer-following dotted glow via `--mx/--my` (fine pointer, motion-safe only) |
| `.key`, `.key-white` | Tactile pill keys, hover fade, press `scale .98` plus 1px drop |
| `.lift-hover` | 2px rise and a pre-painted hover shadow faded in via `::after` |
| `.press` | Press feedback only |
| `.focus-ring` | 2px accent outline, 3px offset |
| `.skip-link`, `.sticky-below-nav` | Skip link, sticky offset below the nav |
| `.eyebrow` | Mono 12px uppercase label, `data-dot` adds the dot |

Do not put `.lift-hover` and `.grain-glow-hover` on the same element (both use `::after`); wrap one inside the other.

### New tokens

`--grain`, `--floor-1/2`, `--face-0/1/2`, `--ring-hot`, `--ring-brand-hot`, `--ring-violet(-hot)`, `--drop-hover`, `--hl`, `--hl-top`, `--hl-strong`, `--glow-a/b/c`, `--glow-top`, `--key-*` (top, bottom, hover, active, white variants, foreground, edge, glow), `--s-1` to `--s-30`. `--face`, `--key-top` and `--key-bottom` are registered with `@property` so state changes interpolate. Tailwind: `bg-face-1`, `bg-floor-1`, `bg-key-top`, `shadow-drop-hover`, `bg-grain`, `bg-glow-top`, `p-s-4`.

### Migration notes: named palette aliases

Dark values match theauth exactly; light values are adaptations. theauth palette names resolve to semantic tokens so its CSS migrates incrementally:

| theauth | glinui token |
| --- | --- |
| `--void` | `--floor-1` |
| `--obsidian`, `--carbon`, `--graphite` | `--face-0`, `--face-1`, `--face-2` |
| `--slate` | `--surface-3` |
| `--ash`, `--steel` | `--color-border` (steel is a stronger mix) |
| `--fog`, `--smoke`, `--cloud`, `--silver`, `--white` | `--color-subtle`, `--color-muted`, muted/foreground mixes, `--color-foreground` |
| `--violet`, `--live`, `--teal` | `--color-accent`, `--color-signal-live`, `--color-signal-ok` |

Button tokens renamed: `--k-top`/`--k-bot` are `--key-top`/`--key-bottom`. Prefer the semantic names in new code and drop the aliases once migrated.

## Motion

The Tailwind preset ships its own animation plugin, so no `tailwindcss-animate` or `tw-animate-css` is needed.

Utilities (same semantics as tailwindcss-animate):

- `animate-in` / `animate-out`, driven by the `enter` / `exit` keyframes and `--tw-enter-*` / `--tw-exit-*` custom properties.
- `fade-in-*`, `fade-out-*`, `zoom-in-*`, `zoom-out-*`, `spin-in-*`, `spin-out-*`.
- `slide-in-from-{top,bottom,left,right}-*` and `slide-out-to-{top,bottom,left,right}-*` (spacing scale, fractions and `full`).
- `duration-*`, `delay-*`, `ease-*` also feed the animation, plus `fill-mode-*`, `direction-*`, `repeat-*`, `running`, `paused`.
- `animate-accordion-down/up` and `animate-collapsible-down/up` use `--radix-accordion-content-height` and `--radix-collapsible-content-height`.

Use them behind state variants, for example `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`.

Tokens (`theme.css`): `--motion-micro` 140ms, `--motion-overlay-in` 200ms, `--motion-overlay-out` 140ms, `--motion-drawer` 320ms, plus `--ease-out` (enter), `--ease-exit`, `--ease-in-out` / `--ease-morph` and `--ease-drawer`.

Reduced motion: under `prefers-reduced-motion: reduce` the motion tokens collapse to 1ms and `animate-in` / `animate-out` drop translate, scale and rotate, leaving an opacity-only crossfade.

Without Tailwind, import `@glinui/tokens/animations.css` after `theme.css` and use `glin-animate-in` / `glin-animate-out` with `glin-fade`, `glin-zoom`, `glin-from-{top,bottom,left,right}` and `glin-drawer`. Movement is gated by `prefers-reduced-motion: no-preference`. Accordion and collapsible height animations use `glin-accordion-content` and `glin-collapsible-content`.

## Base colors

`data-glin-base` swaps the neutral scale: `obsidian` (default), `neutral`, `zinc`, `slate`, `stone`, `gray`. Import `@glinui/tokens/preferences.css` (it pulls in `bases.css`).

```html
<html data-glin-base="zinc">            <!-- whole app -->
<section data-glin-base="slate" class="dark">...</section>   <!-- scoped, with a theme -->
```

```tsx
<GlinProvider target="document" defaults={{ base: "zinc" }} />
<ThemeScope theme="dark" base="stone">...</ThemeScope>
```

Typed swatches: `import { baseColors } from "@glinui/tokens"` (id, label, light and dark neutral swatches). `bases.css` and `src/bases.ts` are generated from `scripts/bases.mjs` with `pnpm --filter @glinui/tokens bases:build`. All text pairs are AA in every base and theme.

## Token health

`pnpm --filter @glinui/docs tokens:check` reports custom properties used with `var()` but defined nowhere, light tokens missing a dark value, public tokens missing from `src/index.ts`, preset references to undefined tokens, stale generated files, and any base color pair below WCAG AA (`--report` lists every ratio).
