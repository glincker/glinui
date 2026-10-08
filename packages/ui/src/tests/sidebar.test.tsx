import { act, fireEvent, render, screen } from "@testing-library/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from "../components/sidebar"

function Probe() {
  const { state, open } = useSidebar()
  return <span data-testid="probe">{`${state}:${open}`}</span>
}

function Demo(props: { collapsible?: "offcanvas" | "icon" | "none"; storageKey?: string | null; variant?: "default" | "glass"; defaultOpen?: boolean }) {
  const { collapsible, storageKey, variant, defaultOpen } = props
  return (
    <SidebarProvider storageKey={storageKey} defaultOpen={defaultOpen}>
      <Sidebar collapsible={collapsible} variant={variant} label="Main">
        <SidebarHeader>Brand</SidebarHeader>
        <SidebarContent>
          <SidebarGroup collapsible>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Home"><span>Home</span></SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Settings</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <Probe />
      </SidebarInset>
    </SidebarProvider>
  )
}

function mockMatchMedia(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  })) as unknown as typeof window.matchMedia
}

describe("Sidebar", () => {
  beforeEach(() => {
    window.localStorage.clear()
    mockMatchMedia(false)
  })

  it("renders a navigation landmark with menu content", () => {
    render(<Demo />)
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument()
    expect(screen.getByRole("main")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("button", { name: "Settings" })).not.toHaveAttribute("aria-current")
  })

  it("applies glass variant and merges className", () => {
    render(
      <SidebarProvider storageKey={null}>
        <Sidebar variant="glass" className="w-72" label="G">x</Sidebar>
      </SidebarProvider>
    )
    const nav = screen.getByRole("navigation", { name: "G" })
    expect(nav.className).toContain("backdrop-blur-xl")
    expect(nav).toHaveClass("w-72")
  })

  it("sets width via CSS variables, not inline styles", () => {
    render(<Demo />)
    const root = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    expect(root.className).toContain("w-[var(--sidebar-width)]")
    expect(root.getAttribute("style")).toBeNull()
  })

  it("collapses via the trigger and reflects aria-expanded", () => {
    render(<Demo collapsible="icon" storageKey={null} />)
    const trigger = screen.getByRole("button", { name: "Toggle sidebar", hidden: false, description: "" })
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    fireEvent.click(trigger)
    expect(screen.getByTestId("probe")).toHaveTextContent("collapsed:false")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    const root = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    expect(root).toHaveAttribute("data-collapsible", "icon")
    expect(root).toHaveAttribute("data-state", "collapsed")
  })

  it("toggles with ctrl+B and cmd+B", () => {
    render(<Demo storageKey={null} />)
    expect(screen.getByTestId("probe")).toHaveTextContent("expanded:true")
    fireEvent.keyDown(window, { key: "b", ctrlKey: true })
    expect(screen.getByTestId("probe")).toHaveTextContent("collapsed:false")
    fireEvent.keyDown(window, { key: "b", metaKey: true })
    expect(screen.getByTestId("probe")).toHaveTextContent("expanded:true")
    fireEvent.keyDown(window, { key: "b" })
    expect(screen.getByTestId("probe")).toHaveTextContent("expanded:true")
  })

  it("persists and restores open state via localStorage", () => {
    const { unmount } = render(<Demo storageKey="test-sidebar" />)
    fireEvent.keyDown(window, { key: "b", ctrlKey: true })
    expect(window.localStorage.getItem("test-sidebar")).toBe("collapsed")
    unmount()
    render(<Demo storageKey="test-sidebar" />)
    expect(screen.getByTestId("probe")).toHaveTextContent("collapsed:false")
  })

  it("survives unavailable storage", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    render(<Demo />)
    expect(screen.getByTestId("probe")).toHaveTextContent("expanded:true")
    spy.mockRestore()
  })

  it("collapsible groups expose aria-expanded and hide content", () => {
    render(<Demo storageKey={null} />)
    const label = screen.getByRole("button", { name: "Platform" })
    expect(label).toHaveAttribute("aria-expanded", "true")
    fireEvent.click(label)
    expect(label).toHaveAttribute("aria-expanded", "false")
    expect(document.getElementById(label.getAttribute("aria-controls") as string)).toHaveAttribute("hidden")
  })

  it("renders as a sheet on mobile and toggles it", () => {
    mockMatchMedia(true)
    render(<Demo storageKey={null} />)
    expect(screen.queryByRole("navigation", { name: "Main" })).toBeNull()
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }))
    })
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument()
  })

  it("throws outside a provider", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<SidebarTrigger />)).toThrow(/SidebarProvider/)
    err.mockRestore()
  })
})
