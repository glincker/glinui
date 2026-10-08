# AGENTS.md: Glin UI

> Modern-web design hub for React: components, animations, colors, tokens, and AI-ready prompts. Glass is one surface variant, not the identity. Read `VISION.md` for full strategy.

## Project

- **Goal**: The design hub for the modern web: components, animations, colors, tokens, and copy-for-AI prompts, competing with shadcn/ui, Animate UI, Skiper UI
- **Stack**: React 19, Next.js 15, Radix UI, Tailwind CSS, pnpm + Turbo
- **Packages**: `@glinui/ui`, `@glinui/tokens`, `@glinui/motion`, `@glinui/registry`
- **Docs**: `apps/docs/` (Next.js)
- **Phases**: `docs-local/PHASES.md` (roadmap + task tracker)

## Commands

```bash
pnpm dev          # Start dev servers
pnpm build        # Build all packages
pnpm typecheck    # TypeScript check
pnpm test         # Run Vitest tests
pnpm lint         # Lint all packages
```

## Rules

- Default to action. Only ask if: breaking public API, adding deps, or truly ambiguous after checking VISION.md + existing code + reference repos
- No `any` types. No inline styles. Tailwind only. Phosphor icons only (`@phosphor-icons/react`), no new icon sets
- Every component needs: variants (glass is one of them), a11y (Radix), reduced-motion fallback, tests, docs with Preview, Code and Prompt tabs
- Use `forwardRef`, `cva()` for variants, `cn()` for class merging
- Animate only `transform`/`opacity`. Budget 60fps on mid-tier devices
- Use CSS variables from `@glinui/tokens` (surface, elevation, ring, brand accent), never hardcode colors
- Do not run full validation on every iteration
- Run full validation (`pnpm typecheck && pnpm test`) only before committing or when a build/check fails
- Be continous dont stop after small tasks see whats next in pipeline and keep going updating the status in docs-local and proceeding so we can ship this faster

## Component Pattern

```
1. packages/ui/src/components/<name>.tsx  : forwardRef + cva + cn + glass variant
2. packages/ui/src/index.ts              : export from barrel
3. packages/ui/src/tests/<name>.test.tsx  : render, variants, a11y, disabled, className
4. apps/docs/                            : demo page + metadata
```

## When Stuck

1. Read existing components for patterns
2. Check `docs-local/git/shadcn-ui/`, `magicui/`, `heroui/`
3. Search official docs (Radix, Tailwind, MDN)
4. Check `VISION.md`
5. Only then ask

## Git

```
<type>: <description>
Co-Authored-By: Glin UI <bot@glincker.com>
```

Types: feat, fix, perf, refactor, docs, test, chore. One concern per PR.

## Structure

```
open-ui/
├── VISION.md          # Strategy, component catalog, business model
├── AGENTS.md          # This file
├── apps/docs/         # Next.js docs (glinui.com)
├── packages/ui/       # Component library
├── packages/tokens/   # Design tokens (OKLCH, glass, motion)
├── packages/motion/   # Animation presets
├── packages/registry/ # Component metadata for CLI
└── docs-local/        # Planning (not pushed)
    ├── PHASES.md      # Master roadmap
    ├── phases/        # Phase details
    ├── analysis/      # Research
    └── git/           # Reference repos
```

## Clean Room

Reference repos in `docs-local/git/` are for insight only. Rewrite from first principles. No code copying.

## Porting MIT components

Adapting MIT licensed components with attribution (provenance entry, header, notices) follows `docs-local/PORTING.md`. Restricted sources stay clean room.
