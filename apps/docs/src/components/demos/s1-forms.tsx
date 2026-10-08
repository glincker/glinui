"use client"

// Showcase demos for the Forms and inputs category. Each exported function is a self-contained,
// copy-pasteable example: the docs code strings are generated from these sources
// (see src/lib/showcase-s1-code.ts), so keep every demo free of local helpers.

import { useEffect, useState } from "react"
import {
  CheckCircle,
  CreditCard,
  EnvelopeSimple,
  Link as LinkIcon,
  MagnifyingGlass,
  Paperclip,
  Plus,
  ShieldCheck
} from "@phosphor-icons/react/dist/ssr"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Combobox,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Attachment,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Kbd,
  Label,
  PromptInput,
  RadioGroup,
  RadioGroupItem,
  Select,
  Slider,
  Switch,
  Textarea
} from "@glinui/ui"
import { BrandIcon } from "@/components/brand/brand-icon"

/* Input ----------------------------------------------------------------- */

export function InputSignUpForm() {
  const [email, setEmail] = useState("maya@acme")
  const [handle, setHandle] = useState("mayachen")
  const emailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const handleTaken = handle === "admin"
  const handleOk = handle.length >= 3 && !handleTaken

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Free for teams up to five people. No card needed.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={(event) => event.preventDefault()} noValidate>
          <Field>
            <FieldLabel>Full name</FieldLabel>
            <FieldControl><Input autoComplete="name" defaultValue="Maya Chen" /></FieldControl>
            <FieldDescription>Shown on invoices and in your team directory.</FieldDescription>
          </Field>
          <Field invalid={emailInvalid}>
            <FieldLabel>Work email</FieldLabel>
            <FieldControl>
              <Input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </FieldControl>
            {emailInvalid ? <FieldError>Enter a full address like maya@acme.com.</FieldError> : null}
          </Field>
          <Field invalid={handleTaken}>
            <FieldLabel>Username</FieldLabel>
            <FieldControl>
              <Input autoComplete="username" value={handle} onChange={(event) => setHandle(event.target.value.trim())} />
            </FieldControl>
            {handleTaken ? <FieldError>That username is taken. Try another.</FieldError> : null}
            {handleOk ? (
              <p className="flex items-center gap-1.5 text-sm text-[color:var(--tone-success-text)]">
                <CheckCircle weight="fill" className="size-4" aria-hidden />
                glin.app/{handle} is available
              </p>
            ) : null}
          </Field>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="solid" tone="accent" className="w-full" disabled={emailInvalid || handleTaken}>
          Create account
        </Button>
      </CardFooter>
    </Card>
  )
}

export function InputStatesDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel>Default</FieldLabel>
        <FieldControl><Input placeholder="Search projects" /></FieldControl>
      </Field>
      <Field>
        <FieldLabel>With value</FieldLabel>
        <FieldControl><Input defaultValue="Atlas redesign" /></FieldControl>
      </Field>
      <Field invalid>
        <FieldLabel>Invalid</FieldLabel>
        <FieldControl><Input defaultValue="not-an-email" /></FieldControl>
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
      <Field disabled>
        <FieldLabel>Disabled</FieldLabel>
        <FieldControl><Input defaultValue="Locked by an admin" /></FieldControl>
      </Field>
      <Field>
        <FieldLabel>Small</FieldLabel>
        <FieldControl><Input size="sm" placeholder="Compact" /></FieldControl>
      </Field>
      <Field>
        <FieldLabel>Large</FieldLabel>
        <FieldControl><Input size="lg" placeholder="Roomy" /></FieldControl>
      </Field>
    </div>
  )
}

/* Textarea -------------------------------------------------------------- */

export function TextareaFeedbackForm() {
  const [message, setMessage] = useState("The export button is hidden on narrow screens, so I could not download my invoices from my phone.")
  const limit = 280
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send feedback</CardTitle>
        <CardDescription>Tell us what is slowing you down. A person reads every message.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field>
          <FieldLabel>Topic</FieldLabel>
          <FieldControl>
            <Select
              defaultValue="bug"
              options={[
                { value: "bug", label: "Something is broken" },
                { value: "idea", label: "Feature idea" },
                { value: "billing", label: "Billing question" }
              ]}
            />
          </FieldControl>
        </Field>
        <Field>
          <FieldLabel>Message</FieldLabel>
          <FieldControl>
            <Textarea rows={4} maxLength={limit} value={message} onChange={(event) => setMessage(event.target.value)} />
          </FieldControl>
          <FieldDescription>{limit - message.length} characters left.</FieldDescription>
        </Field>
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => setMessage("")}>Clear</Button>
        <Button variant="solid" tone="accent" disabled={message.trim().length === 0}>Send feedback</Button>
      </CardFooter>
    </Card>
  )
}

/* Select ---------------------------------------------------------------- */

export function SelectPreferences() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Applies to every workspace you belong to.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/60">
        <Field orientation="responsive" className="py-3 first:pt-0">
          <div className="grid flex-auto gap-0.5">
            <FieldLabel>Language</FieldLabel>
            <FieldDescription>Used for menus and emails.</FieldDescription>
          </div>
          <FieldControl>
            <Select
              className="md:w-48"
              defaultValue="en"
              options={[
                { value: "en", label: "English" },
                { value: "de", label: "Deutsch" },
                { value: "fr", label: "Francais" },
                { value: "ja", label: "Japanese" }
              ]}
            />
          </FieldControl>
        </Field>
        <Field orientation="responsive" className="py-3">
          <div className="grid flex-auto gap-0.5">
            <FieldLabel>Time zone</FieldLabel>
            <FieldDescription>Schedules and digests follow it.</FieldDescription>
          </div>
          <FieldControl>
            <Select
              className="md:w-48"
              defaultValue="pt"
              options={[
                { value: "pt", label: "Pacific (UTC-8)" },
                { value: "et", label: "Eastern (UTC-5)" },
                { value: "cet", label: "Central Europe (UTC+1)" },
                { value: "ist", label: "India (UTC+5:30)" }
              ]}
            />
          </FieldControl>
        </Field>
        <Field orientation="responsive" className="py-3 last:pb-0">
          <div className="grid flex-auto gap-0.5">
            <FieldLabel>Date format</FieldLabel>
            <FieldDescription>How dates appear in tables.</FieldDescription>
          </div>
          <FieldControl>
            <Select
              className="md:w-48"
              defaultValue="iso"
              options={[
                { value: "iso", label: "2026-10-07" },
                { value: "us", label: "10/07/2026" },
                { value: "eu", label: "07/10/2026" }
              ]}
            />
          </FieldControl>
        </Field>
      </CardContent>
    </Card>
  )
}

/* Checkbox -------------------------------------------------------------- */

export function CheckboxColumns() {
  const columns = ["Invoice number", "Customer", "Amount", "Status", "Due date"]
  const [selected, setSelected] = useState<string[]>(["Invoice number", "Customer", "Amount"])
  const all = selected.length === columns.length
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Export columns</CardTitle>
        <CardDescription>{selected.length} of {columns.length} included in the CSV.</CardDescription>
      </CardHeader>
      <CardContent>
        <fieldset className="grid gap-3 border-0 p-0">
          <legend className="sr-only">Columns to export</legend>
          <label className="flex items-center gap-2.5 border-b border-border/60 pb-3 text-sm font-medium text-foreground">
            <Checkbox
              checked={all ? true : selected.length === 0 ? false : "indeterminate"}
              onCheckedChange={(next) => setSelected(next === true ? columns : [])}
            />
            Select all
          </label>
          {columns.map((column) => (
            <label key={column} className="flex items-center gap-2.5 text-sm text-foreground">
              <Checkbox
                checked={selected.includes(column)}
                onCheckedChange={(next) =>
                  setSelected((current) => (next === true ? [...current, column] : current.filter((item) => item !== column)))
                }
              />
              {column}
            </label>
          ))}
        </fieldset>
      </CardContent>
      <CardFooter>
        <Button variant="solid" tone="accent" className="w-full" disabled={selected.length === 0}>Export CSV</Button>
      </CardFooter>
    </Card>
  )
}

/* Radio group ----------------------------------------------------------- */

export function RadioPlanPicker() {
  const plans = [
    { value: "starter", name: "Starter", price: "$0", note: "Up to 3 projects" },
    { value: "pro", name: "Pro", price: "$24", note: "Unlimited projects, SSO" },
    { value: "scale", name: "Scale", price: "$96", note: "Audit log, 99.9% uptime SLA" }
  ]
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Choose a plan</CardTitle>
        <CardDescription>Billed monthly. Change or cancel any time.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="pro" aria-label="Plan" className="grid gap-2">
          {plans.map((plan) => (
            <label
              key={plan.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 px-3 py-3 has-[[data-state=checked]]:border-[var(--color-accent)] has-[[data-state=checked]]:bg-[var(--surface-1)]"
            >
              <RadioGroupItem value={plan.value} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">{plan.name}</span>
                <span className="block text-xs text-[var(--color-muted)]">{plan.note}</span>
              </span>
              <span className="text-sm font-medium tabular-nums text-foreground">{plan.price}<span className="text-xs font-normal text-[var(--color-muted)]">/seat</span></span>
            </label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

/* Slider ---------------------------------------------------------------- */

export function SliderPriceFilter() {
  const [range, setRange] = useState([40, 220])
  const [volume, setVolume] = useState([65])
  const results = Math.max(0, Math.round((range[1] - range[0]) * 0.42))
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Filter listings</CardTitle>
        <CardDescription>{results} stays match your budget.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="price-range">Price per night</Label>
            <output htmlFor="price-range" className="text-sm font-medium tabular-nums text-foreground">
              ${range[0]} to ${range[1]}
            </output>
          </div>
          <Slider id="price-range" value={range} onValueChange={setRange} min={0} max={400} step={10} aria-label="Price range" />
        </div>
        <div className="grid gap-3">
          <div className="flex items-baseline justify-between">
            <Label>Preview volume</Label>
            <span className="text-sm tabular-nums text-[var(--color-muted)]">{volume[0]}%</span>
          </div>
          <Slider value={volume} onValueChange={setVolume} max={100} step={1} aria-label="Preview volume" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={() => { setRange([40, 220]); setVolume([65]) }}>Reset</Button>
        <Button variant="solid" tone="accent">Show {results} stays</Button>
      </CardFooter>
    </Card>
  )
}

/* Switch ---------------------------------------------------------------- */

export function SwitchNotifications() {
  const items = [
    { id: "mentions", label: "Mentions and replies", note: "When someone tags you in a thread.", on: true },
    { id: "digest", label: "Weekly digest", note: "A Monday summary of what shipped.", on: true },
    { id: "deploys", label: "Deploy failures", note: "Immediate email when a build fails.", on: true },
    { id: "marketing", label: "Product news", note: "Occasional updates about new features.", on: false }
  ]
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Email notifications</CardTitle>
        <CardDescription>Choose what lands in your inbox.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/60">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <label htmlFor={`sw-${item.id}`} className="block text-sm font-medium text-foreground">{item.label}</label>
              <p id={`sw-${item.id}-note`} className="text-sm text-[var(--color-muted)]">{item.note}</p>
            </div>
            <Switch id={`sw-${item.id}`} aria-describedby={`sw-${item.id}-note`} defaultChecked={item.on} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

/* Combobox -------------------------------------------------------------- */

export function ComboboxFrameworkPicker() {
  const frameworks = [
    { value: "nextjs", label: "Next.js", keywords: ["react", "vercel"] },
    { value: "remix", label: "Remix", keywords: ["react"] },
    { value: "astro", label: "Astro", keywords: ["islands"] },
    { value: "nuxt", label: "Nuxt", keywords: ["vue"] },
    { value: "vite", label: "Vite", keywords: ["spa"] }
  ] as const
  const [value, setValue] = useState("nextjs")
  const current = frameworks.find((item) => item.value === value)
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>New project</CardTitle>
        <CardDescription>Pick the framework we should scaffold. Type to filter the list.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field>
          <FieldLabel>Framework</FieldLabel>
          <FieldControl>
            <Combobox
              options={frameworks.map((item) => ({ ...item, keywords: [...item.keywords] }))}
              value={value}
              onValueChange={setValue}
              placeholder="Select a framework"
              searchPlaceholder="Search frameworks"
              aria-label="Framework"
            />
          </FieldControl>
        </Field>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Frameworks">
          {frameworks.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={item.value === value}
              onClick={() => setValue(item.value)}
              className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-sm text-foreground outline-none transition-colors hover:bg-[var(--surface-1)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] aria-pressed:border-[var(--color-accent)] aria-pressed:bg-[var(--surface-1)]"
            >
              <BrandIcon name={item.value} size={16} />
              {item.label}
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <span className="text-sm text-[var(--color-muted)]">{current ? `${current.label} starter selected` : "Nothing selected"}</span>
        <Button variant="solid" tone="accent" disabled={!current}>Create project</Button>
      </CardFooter>
    </Card>
  )
}

/* Input group ----------------------------------------------------------- */

export function InputGroupShare() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Share this board</CardTitle>
        <CardDescription>Anyone with the link can view. Only members can comment.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <InputGroup>
          <InputGroupAddon><LinkIcon /></InputGroupAddon>
          <InputGroupInput aria-label="Share link" readOnly defaultValue="glin.app/b/atlas-roadmap" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="ghost">Copy</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
          <InputGroupInput aria-label="Custom domain" defaultValue="roadmap" />
          <InputGroupAddon align="inline-end"><InputGroupText>.glin.app</InputGroupText></InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon><MagnifyingGlass /></InputGroupAddon>
          <InputGroupInput aria-label="Invite by email" placeholder="Invite by email" />
          <InputGroupAddon align="inline-end"><Kbd>Enter</Kbd></InputGroupAddon>
        </InputGroup>
      </CardContent>
    </Card>
  )
}

/* Input OTP ------------------------------------------------------------- */

export function InputOtpVerify() {
  const [code, setCode] = useState("482")
  const [seconds, setSeconds] = useState(24)
  const [verified, setVerified] = useState(false)
  useEffect(() => {
    if (seconds <= 0) return
    const id = setTimeout(() => setSeconds((value) => value - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-full bg-[var(--surface-1)] text-[var(--color-accent)]">
          <EnvelopeSimple weight="duotone" className="size-5" aria-hidden />
        </div>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>We sent a 6 digit code to maya@acme.com. It expires in 10 minutes.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setCode}
          onComplete={() => setVerified(true)}
          aria-label="Verification code"
        >
          <InputOTPGroup>
            {[0, 1, 2].map((index) => <InputOTPSlot key={index} index={index} />)}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {[3, 4, 5].map((index) => <InputOTPSlot key={index} index={index} />)}
          </InputOTPGroup>
        </InputOTP>
        <p className="min-h-5 text-sm text-[var(--color-muted)]" aria-live="polite">
          {verified ? (
            <span className="flex items-center gap-1.5 text-[color:var(--tone-success-text)]">
              <ShieldCheck weight="fill" className="size-4" aria-hidden />
              Email verified
            </span>
          ) : (
            "Paste works too. The code fills every box."
          )}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          disabled={seconds > 0}
          onClick={() => { setSeconds(30); setCode(""); setVerified(false) }}
        >
          {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
        </Button>
        <Button variant="solid" tone="accent" disabled={code.length < 6}>Verify</Button>
      </CardFooter>
    </Card>
  )
}

/* Field ----------------------------------------------------------------- */

export function FieldCheckoutForm() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Studio keyboard, 75%. $129.00 with free shipping.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={(event) => event.preventDefault()}>
          <FieldSet>
            <FieldLegend>Contact</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldControl><Input type="email" autoComplete="email" defaultValue="maya@acme.com" /></FieldControl>
                <FieldDescription>We send the receipt and tracking here.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Shipping</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel>Street address</FieldLabel>
                <FieldControl><Input autoComplete="street-address" defaultValue="410 Alder Street" /></FieldControl>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>City</FieldLabel>
                  <FieldControl><Input autoComplete="address-level2" defaultValue="Portland" /></FieldControl>
                </Field>
                <Field invalid>
                  <FieldLabel>Postal code</FieldLabel>
                  <FieldControl><Input autoComplete="postal-code" defaultValue="972" /></FieldControl>
                  <FieldError>Enter a 5 digit ZIP code.</FieldError>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Payment</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel>Card number</FieldLabel>
                <FieldControl>
                  <InputGroup>
                    <InputGroupAddon><CreditCard /></InputGroupAddon>
                    <InputGroupInput inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" />
                  </InputGroup>
                </FieldControl>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Expiry</FieldLabel>
                  <FieldControl><Input autoComplete="cc-exp" placeholder="MM / YY" /></FieldControl>
                </Field>
                <Field>
                  <FieldLabel>CVC</FieldLabel>
                  <FieldControl><Input autoComplete="cc-csc" placeholder="123" /></FieldControl>
                </Field>
              </div>
              <label className="flex items-center gap-2.5 text-sm text-foreground">
                <Checkbox defaultChecked />
                Billing address is the same as shipping
              </label>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="solid" tone="accent" className="w-full">Pay $129.00</Button>
      </CardFooter>
    </Card>
  )
}

/* Label ----------------------------------------------------------------- */

export function LabelPairings() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Invite a teammate</CardTitle>
        <CardDescription>Labels name a control for everyone, including screen readers.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="invite-email">
            Email address <span className="text-[color:var(--tone-danger-text)]" aria-hidden>*</span>
          </Label>
          <Input id="invite-email" type="email" required placeholder="jordan@acme.com" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="invite-note">
            Note <span className="text-xs font-normal text-[var(--color-muted)]">(optional)</span>
          </Label>
          <Textarea id="invite-note" rows={2} placeholder="Say hi, share context" />
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox id="invite-admin" />
          <Label htmlFor="invite-admin">Make this person an admin</Label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="invite-copy">Send me a copy</Label>
          <Switch id="invite-copy" defaultChecked />
        </div>
      </CardContent>
    </Card>
  )
}

/* Prompt input ---------------------------------------------------------- */

export function PromptComposer() {
  const library = [
    { name: "q3-report.pdf", size: 482000, type: "application/pdf" },
    { name: "metrics.csv", size: 96400, type: "text/csv" },
    { name: "launch-notes.md", size: 7800, type: "text/markdown" }
  ]
  const [files, setFiles] = useState(library.slice(0, 2))
  const [thread, setThread] = useState<string[]>([])
  const next = library.find((file) => !files.some((item) => item.name === file.name))

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {thread.length > 0 ? (
        <ul className="grid gap-2" aria-label="Sent messages">
          {thread.map((message, index) => (
            <li key={`${message}-${index}`} className="ms-auto max-w-[85%] rounded-xl bg-[var(--color-accent)] px-3 py-2 text-sm text-[var(--color-accent-foreground)]">
              {message}
            </li>
          ))}
        </ul>
      ) : null}
      <PromptInput
        label="Message"
        placeholder="Ask about the attached files"
        defaultValue="Summarize the main risks in these files and list three follow-ups."
        attachments={
          files.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {files.map((file) => (
                <Attachment
                  key={file.name}
                  name={file.name}
                  size={file.size}
                  type={file.type}
                  onRemove={() => setFiles((current) => current.filter((item) => item.name !== file.name))}
                />
              ))}
            </div>
          ) : null
        }
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leadingIcon={next ? <Plus weight="bold" /> : <Paperclip weight="bold" />}
            disabled={!next}
            onClick={() => next && setFiles((current) => [...current, next])}
          >
            {next ? "Attach file" : "All files attached"}
          </Button>
        }
        onSubmit={(value) => setThread((current) => [...current, value])}
      />
      <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <Badge variant="soft" size="sm">{files.length} attached</Badge>
        Press Enter to send, Shift and Enter for a new line.
      </div>
    </div>
  )
}
