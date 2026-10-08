# @glinui/ui

Liquid Glass component library for React. 126 components with glassmorphic variants, built on Radix UI and Tailwind CSS.

## Install

```bash
npm install @glinui/ui @glinui/tokens
```

## Usage

```tsx
import { Button, GlassCard, Input } from "@glinui/ui"

export function Example() {
  return (
    <GlassCard>
      <Input variant="glass" placeholder="Email" />
      <Button variant="glass">Submit</Button>
    </GlassCard>
  )
}
```

## Features

- 126 components (primitives + signature effects)
- Glass, liquid, matte, glow, and outline variants
- Built on Radix UI for accessibility
- Tailwind CSS styling with design tokens
- Reduced-motion fallbacks
- React 18/19 compatible

## CLI

Add individual components to your project:

```bash
npx glinui add button glass-card input
```

## Contributing

Tailwind drops classes it cannot compile without any error (for example `size-4.5`, `bg-[var(--color-accent)]/80`, or `aria-invalid:`), so the UI just looks broken. Before opening a PR, run the class audit:

```bash
pnpm --filter @glinui/docs audit:classes
```

It lists every class that generates no CSS, every opacity-on-`var()` pattern, invalid CSS values, and inline `style` props. Use token colors (`bg-accent/80`) or `color-mix` arbitrary values (`bg-[color-mix(in_oklab,var(--x)_80%,transparent)]`) instead. The same check runs in `pnpm --filter @glinui/docs test`.

It also flags `ambiguous-var-utility`: Tailwind 3 reads `[box-shadow:var(--elev-1)]` as a shadow color, so the shadow silently never renders. Never write `[box-shadow:var(--x)]` (or a shadow list with a bare `var()` item); write `[box-shadow:var(--x)]`, with variants as usual (`hover:[box-shadow:var(--elev-2)]`). The same trap exists for `text-[var(--size)]` (use `text-[length:var(--size)]`), `border-[var(--width)]` (`border-[length:...]`), `font-[var(--font-sans)]` (`font-[family-name:...]`) and `bg-[var(--gradient)]` (`bg-[image:...]`).

## Documentation

[glinui.com](https://glinui.com)

## License

MIT
