import type { BrandName } from "@/components/brand/brands"

export type FrameworkKey = "next" | "vite" | "remix" | "astro" | "tanstack"

export type FrameworkSetup = {
  key: FrameworkKey
  label: string
  brand: BrandName
  note: string
  createCommand: string
  tokenFile: string
  tokenLanguage: string
  tokenImport: string
  usageFile: string
  usage: string
}

const buttonUsage = (fileHeader: string, exportLine: string) => `${fileHeader}
import { Button } from "@glinui/ui"

${exportLine} {
  return (
    <main className="p-10">
      <Button>Ship it</Button>
    </main>
  )
}`

export const frameworkSetups: FrameworkSetup[] = [
  {
    key: "next",
    label: "Next.js",
    brand: "nextjs",
    note: "App Router. Import the theme CSS before the Tailwind directives.",
    createCommand: "npm create next-app@latest my-app -- --ts --tailwind --eslint --app",
    tokenFile: "app/globals.css",
    tokenLanguage: "css",
    tokenImport: `@import "@glinui/tokens/theme.css";

@tailwind base;
@tailwind components;
@tailwind utilities;`,
    usageFile: "app/page.tsx",
    usage: buttonUsage("// app/page.tsx", "export default function Page()")
  },
  {
    key: "vite",
    label: "Vite",
    brand: "vite",
    note: "React + TypeScript template. Import the theme CSS once in the entry file.",
    createCommand: "npm create vite@latest my-app -- --template react-ts",
    tokenFile: "src/main.tsx",
    tokenLanguage: "tsx",
    tokenImport: `import React from "react"
import ReactDOM from "react-dom/client"
import "@glinui/tokens/theme.css"
import "./index.css"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
    usageFile: "src/App.tsx",
    usage: buttonUsage("// src/App.tsx", "export default function App()")
  },
  {
    key: "remix",
    label: "Remix / other",
    brand: "remix",
    note: "Any bundler that handles CSS side-effect imports. Import the theme once at the root.",
    createCommand: "npx create-remix@latest my-app",
    tokenFile: "app/root.tsx",
    tokenLanguage: "tsx",
    tokenImport: `import "@glinui/tokens/theme.css"
import "./tailwind.css"

// ...the rest of your root route stays unchanged`,
    usageFile: "app/routes/_index.tsx",
    usage: buttonUsage("// app/routes/_index.tsx", "export default function Index()")
  },
  {
    key: "astro",
    label: "Astro",
    brand: "astro",
    note: "Use the React integration (npx astro add react) and Tailwind CSS 3. Import the theme in your base layout and hydrate interactive components with a client directive.",
    createCommand: "npm create astro@latest my-app",
    tokenFile: "src/layouts/Layout.astro",
    tokenLanguage: "tsx",
    tokenImport: `---
import "@glinui/tokens/theme.css"
import "../styles/global.css"
---

<html lang="en">
  <body>
    <slot />
  </body>
</html>`,
    usageFile: "src/pages/index.astro",
    usage: `---
import Layout from "../layouts/Layout.astro"
import { Button } from "@glinui/ui"
---

<Layout>
  <main class="p-10">
    <Button client:load>Ship it</Button>
  </main>
</Layout>`
  },
  {
    key: "tanstack",
    label: "TanStack Start",
    brand: "tanstack",
    note: "File based routes on Vite. Import the theme at the top of the global stylesheet that your root route already links.",
    createCommand: "npm create @tanstack/start@latest my-app",
    tokenFile: "src/styles/app.css",
    tokenLanguage: "css",
    tokenImport: `@import "@glinui/tokens/theme.css";

@tailwind base;
@tailwind components;
@tailwind utilities;`,
    usageFile: "src/routes/index.tsx",
    usage: `// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@glinui/ui"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  return (
    <main className="p-10">
      <Button>Ship it</Button>
    </main>
  )
}`
  }
]

export const installCommand = "npm install @glinui/ui @glinui/tokens"

export const presetEsm = `// tailwind.config.ts
import type { Config } from "tailwindcss"
import glinPreset from "@glinui/tokens/tailwind-preset"

const config: Config = {
  presets: [glinPreset],
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@glinui/ui/dist/**/*.{js,mjs}"
  ]
}

export default config`

export const presetCjs = `// tailwind.config.js (CommonJS)
module.exports = {
  presets: [require("@glinui/tokens/tailwind-preset")],
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@glinui/ui/dist/**/*.{js,mjs}"
  ]
}`

export const presetUsage = `<section className="rounded-card border border-line-soft bg-surface-1 p-6 shadow-elev-2">
  <h2 className="text-h3 text-foreground">Tokens through Tailwind</h2>
  <p className="text-muted">bg-surface-1, shadow-elev-2, rounded-card</p>
</section>`

export const registryOwnershipSnippet = `# Adds source files directly to your app
pnpm dlx @glinui/cli@latest add button

# Example result:
# components/ui/button.tsx
# lib/utils.ts`

export const troubleshooting: { q: string; a: string }[] = [
  {
    q: "Components render unstyled or without shadows",
    a: "The theme CSS is missing or loaded after Tailwind. Import @glinui/tokens/theme.css once at the app entry, and in Next.js place the @import line above the @tailwind directives."
  },
  {
    q: "Tailwind classes like bg-surface-1 or shadow-elev-2 do nothing",
    a: "Add the preset to tailwind.config and make sure theme.css is imported so the variables exist. The preset only maps utilities to CSS variables, it does not define them."
  },
  {
    q: "Classes used inside @glinui/ui are purged in production",
    a: "Add ./node_modules/@glinui/ui/dist/**/*.{js,mjs} to the Tailwind content array so utilities used by the components are generated."
  },
  {
    q: "bg-surface-1/50 loses its opacity",
    a: "Opacity modifiers use color-mix, which needs a browser with color-mix support. Update the browser target, or use a plain surface token."
  },
  {
    q: "Dark mode does not switch",
    a: "Tokens switch on the .dark class on the html element. Set darkMode: \"class\" in Tailwind and toggle the class from your theme provider."
  }
]
