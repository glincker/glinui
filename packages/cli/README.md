# glinui

CLI for adding Glin UI liquid glass components to your project.

## Quick Start

```bash
npx glinui init
npx glinui add button glass-card input
```

## Install into a fresh project

Requirements: a React project with Tailwind CSS and a `tsconfig.json` (path aliases are optional).

```bash
# 1. Configure Glin UI (writes glinui.json and src/lib/utils.ts with cn)
pnpm dlx @glinui/cli init --yes

# 2. Add components (dependencies are written to package.json)
pnpm dlx @glinui/cli add button button-group sidebar message-scroller input-otp

# 3. Install what was added to package.json
pnpm install
```

Add `@import "@glinui/tokens/theme.css";` to your global CSS so the tokens load.

What `add` does:

- Copies the component, its sibling components (for example `sidebar` pulls in `sheet` and `tooltip`) and helper files such as `use-prefers-reduced-motion`.
- Rewrites monorepo imports (`../lib/cn`, `./button`) to your aliases. With a tsconfig `paths` alias such as `@/*` you get `@/lib/utils` and `@/components/ui/button`. Without one, relative paths are computed from each destination file.
- Creates the utils module exporting `cn` (clsx + tailwind-merge) if it is missing, and never overwrites an existing one.
- For components adapted from other open source projects, makes sure the attribution header is present in the copied file and adds the upstream copyright and license text to `THIRD_PARTY_NOTICES.md` in your project root (one section per source, safe to run repeatedly). `--no-notices` skips that file; you remain bound by the MIT notice of adapted components, so keep the header comment and ship the license text yourself.
- Adds missing packages to `package.json` (`--install` also runs your package manager). Use `--dry-run` to preview without writing anything.

### Aliases config

`glinui.json` accepts file paths or import aliases, and `components.json` (shadcn) is read when `glinui.json` is absent.

```json
{
  "aliases": {
    "components": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib"
  }
}
```

`utils` points at the module exporting `cn` (`@/lib/utils` is `src/lib/utils.ts`). `lib` is where hooks and helpers go and defaults to the folder holding utils. Older projects with `src/lib/utils/cn.ts` keep working.

### shadcn-compatible URLs

Every item is also published as a shadcn registry item with `@/` imports, which the shadcn CLI rewrites to your `components.json` aliases:

```bash
npx shadcn@latest add https://glinui.com/r/button.json
npx shadcn@latest add https://glinui.com/r/sidebar.json
```

Sibling components arrive through `registryDependencies` URLs. The index lives at `https://glinui.com/r/registry.json`.

## Commands

### `glinui init`

Initialize Glin UI in your project. Creates `glinui.json` config and scaffolds `src/lib/utils.ts` with the `cn()` utility.

```bash
npx glinui init
npx glinui init --yes  # Accept defaults
```

### `glinui add [components...]`

Add components to your project. Fetches source from the registry and writes files to your components directory.

```bash
npx glinui add button
npx glinui add glass-card spotlight-card border-beam
npx glinui add --overwrite button  # Overwrite existing
npx glinui add button --dry-run    # Preview, write nothing
npx glinui add shine-border --no-notices  # Skip THIRD_PARTY_NOTICES.md (you remain bound by the MIT notice)
```

### `glinui list`

List all available components in the registry.

```bash
npx glinui list
npx glinui list --type signature  # Filter by type
```

### `glinui diff [component]`

Show differences between your local component and the registry version.

```bash
npx glinui diff button
```

## Configuration

`glinui.json`:

```json
{
  "$schema": "https://glinui.com/r/schema.json",
  "style": "default",
  "tailwind": {
    "css": "src/app/globals.css"
  },
  "aliases": {
    "components": "src/components/ui",
    "utils": "src/lib/utils"
  }
}
```

## Documentation

[glinui.com/docs/getting-started](https://glinui.com/docs/getting-started)

## License

MIT
