import type { Metadata } from "next"
import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs-pages-b/callout"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { RelatedLinks } from "@/components/docs-pages-b/related-links"
import { createDocsMetadata } from "@/lib/docs-metadata"

const authRecipe = `import { Button, Input, Label } from "@glinui/ui"

export function LoginForm() {
  return (
    <form className="space-y-4" aria-label="Login form">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" />
      </div>
      <Button type="submit" variant="glass" className="w-full">Sign in</Button>
    </form>
  )
}`

const checkoutRecipe = `import { Button, Input, Label, Select } from "@glinui/ui"

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "gb", label: "United Kingdom" }
]

export function CheckoutAddressForm() {
  return (
    <form className="grid gap-4" aria-label="Checkout address form">
      <div className="space-y-1.5">
        <Label htmlFor="full-name">Full name</Label>
        <Input id="full-name" autoComplete="name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address-line-1">Address line 1</Label>
        <Input id="address-line-1" autoComplete="address-line1" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="country">Country</Label>
        <Select id="country" options={countries} placeholder="Select country" />
      </div>
      <Button type="submit" variant="glass">Continue to payment</Button>
    </form>
  )
}`

const settingsRecipe = `import { Label, Switch, Textarea } from "@glinui/ui"

export function NotificationSettingsForm() {
  return (
    <form className="space-y-5" aria-label="Notification settings">
      <div className="flex items-center justify-between rounded-lg border border-line-soft p-4">
        <div className="space-y-0.5">
          <Label htmlFor="marketing-emails">Marketing emails</Label>
          <p className="text-sm text-muted">Product updates and release notes.</p>
        </div>
        <Switch id="marketing-emails" aria-label="Marketing emails" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea id="feedback" rows={4} placeholder="Tell us what to improve" />
      </div>
    </form>
  )
}`

export const metadata: Metadata = createDocsMetadata({
  title: "Form Recipes",
  description:
    "Copyable auth, checkout, and settings form recipes with explicit labels, autofill hints, and accessible defaults.",
  path: "/docs/forms-recipes",
  keywords: ["form recipes", "auth form UI", "checkout form UI", "settings form UI"]
})

const recipes = [
  { id: "auth", title: "Auth Recipe", note: "Email and password with autofill hints.", code: authRecipe },
  { id: "checkout", title: "Checkout Recipe", note: "Address form with a labeled country select.", code: checkoutRecipe },
  { id: "settings", title: "Settings Recipe", note: "A switch and a textarea with clear names.", code: settingsRecipe }
]

export default function FormsRecipesPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Recipes"
        title="Form Recipes"
        lead="Copy these auth, checkout, and settings forms into your app. Each has explicit labels and the right autocomplete values."
      />

      <Callout variant="tip" title="Before you ship">
        Add validation messages and wire them with aria-describedby. These recipes show structure, not business logic.
      </Callout>

      {recipes.map((recipe) => (
        <PageSection key={recipe.id} id={recipe.id} title={recipe.title} description={recipe.note}>
          <CodeBlock language="tsx" code={recipe.code} />
        </PageSection>
      ))}

      <RelatedLinks
        links={[
          { href: "/docs/forms-accessibility", label: "Forms Accessibility", description: "The labeling contract behind these recipes." },
          { href: "/docs/getting-started", label: "Getting Started", description: "Install the CLI or the package." },
          { href: "/docs/components", label: "Component Catalog", description: "Every input and control." }
        ]}
      />
    </main>
  )
}
