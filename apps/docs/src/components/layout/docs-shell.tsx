"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { CommandPalette } from "@/components/layout/command-palette"
import { DocsSidebar } from "@/components/layout/docs-sidebar"
import { DocsTopbar } from "@/components/layout/docs-topbar"
import { LandingNav } from "@/components/layout/landing-nav"
import type { NavGroup, NavLinkItem } from "@/components/layout/landing-nav-types"
import { SiteFooter } from "@/components/layout/site-footer"
import { useDocsDirection } from "@/lib/docs-direction"

const landingLinks: NavLinkItem[] = [
  { href: "/docs/getting-started", label: "Docs" },
  { href: "/docs/components", label: "Components" },
  { href: "/docs/animations", label: "Animations" },
  { href: "/docs/colors", label: "Colors" },
  { href: "/docs/tokens", label: "Tokens" },
  { href: "/blog", label: "Blog" }
]

const landingGroups: NavGroup[] = [
  {
    label: "Guides",
    items: [
      { href: "/docs/getting-started", label: "Getting Started" },
      { href: "/docs/ai", label: "AI-ready docs" },
      { href: "/docs/variants", label: "Variants" },
      { href: "/docs/accessibility", label: "Accessibility" },
      { href: "/docs/forms-accessibility", label: "Forms Accessibility" },
      { href: "/docs/forms-recipes", label: "Form Recipes" },
      { href: "/docs/focus-management", label: "Focus Management" },
      { href: "/docs/color-contrast", label: "Color Contrast" },
      { href: "/docs/screen-reader-testing", label: "Screen Reader Testing" },
      { href: "/docs/motion", label: "Motion" },
      { href: "/docs/engines", label: "Animation engines" },
      { href: "/docs/glass-physics", label: "Glass Physics" },
      { href: "/docs/api-metadata", label: "API Metadata" }
    ]
  },
  {
    label: "Compare",
    items: [
      { href: "/docs/shadcn-alternative", label: "vs shadcn/ui" },
      { href: "/docs/magicui-alternative", label: "vs Magic UI" },
      { href: "/docs/radix-ui-components", label: "Radix UI Components" },
      { href: "/docs/glassmorphism-react-components", label: "Glassmorphism React" }
    ]
  }
]

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { direction } = useDocsDirection()
  const isLandingRoute = pathname === "/"
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setCommandOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  React.useEffect(() => {
    setCommandOpen(false)
    setMobileNavOpen(false)
  }, [pathname])

  if (isLandingRoute) {
    return (
      <div className="relative min-h-screen bg-[var(--surface-0)]">
        <LandingNav links={landingLinks} groups={landingGroups} onOpenSearch={() => setCommandOpen(true)} />
        <main id="main-content" dir={direction} className="w-full overflow-x-clip px-[var(--layout-gutter)]">
          {children}
        </main>
        <SiteFooter />
        <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--surface-0)]">
      <DocsTopbar
        onOpenCommandPalette={() => setCommandOpen(true)}
        onOpenNav={() => setMobileNavOpen(true)}
        navOpen={mobileNavOpen}
      />

      <div className="flex min-h-0 flex-1">
        <DocsSidebar
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          onOpenSearch={() => {
            setMobileNavOpen(false)
            setCommandOpen(true)
          }}
        />

        <main
          data-docs-scroll-root
          dir={direction}
          className="min-w-0 flex-1 overflow-y-auto bg-[var(--surface-0)]"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</div>
          <SiteFooter />
        </main>
      </div>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  )
}
