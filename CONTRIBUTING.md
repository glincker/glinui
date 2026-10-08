# Contributing to Glin UI

Glin UI is MIT licensed and free forever. Thanks for helping. Read `AGENTS.md` for conventions and `VISION.md` for direction.

## Setup

```
pnpm install
pnpm dev          # docs on http://localhost:3002
```

## Commands

```
pnpm typecheck && pnpm test                 # all packages
pnpm --filter @glinui/ui test               # library tests
pnpm --filter @glinui/docs test             # docs contract tests
pnpm --filter @glinui/docs audit:classes    # dead class, shadow and inline-style guard
pnpm --filter @glinui/docs tokens:check     # token health and contrast
```

Use `NEXT_DIST_DIR=.next-build pnpm --filter @glinui/docs build` for a production build, never a plain build while the dev server runs.

## Rules

- Tokens first: components use tokens from `packages/tokens`, no hardcoded colors. Keep light and dark values in sync.
- Class audit and token check must stay green before you open a pull request.
- Icons are Phosphor only. No `any`, files under 500 lines, `forwardRef` with `cva` and `cn`.
- Accessibility is part of done: keyboard, labels, focus ring, AA contrast, reduced motion.
- No em dashes or en dashes anywhere (code, comments, docs, copy). Use commas, periods or colons.

## Ports of third-party code

Only MIT, Apache-2.0, BSD, ISC, 0BSD, CC0 or Unlicense sources, verified first. Add an attribution header to every file, a registry `provenance` entry with a pinned commit and license snapshot, and run `pnpm --filter @glinui/docs notices:generate`. Use your own assets. Never port commercial or source-available code.

## Pull requests

- Title format: `<type>: <description>` with type one of feat, fix, perf, refactor, docs, test.
- Keep descriptions short. Do not add Co-Authored-By lines or AI mentions to commits.
- Add a changeset for any change to a published package: `pnpm changeset`.
