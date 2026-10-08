import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Combobox, type ComboboxOption } from "../components/combobox"

const options: ComboboxOption[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro", keywords: ["islands"] },
  { value: "nuxt", label: "Nuxt", disabled: true }
]

describe("Combobox", () => {
  it("renders a combobox trigger with placeholder and aria state", () => {
    render(<Combobox options={options} placeholder="Pick one" aria-label="Framework" />)
    const trigger = screen.getByRole("combobox", { name: "Framework" })
    expect(trigger).toHaveTextContent("Pick one")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox")
  })

  it("opens, filters, selects, and closes (uncontrolled)", async () => {
    const onValueChange = vi.fn()
    render(<Combobox options={options} aria-label="Framework" onValueChange={onValueChange} />)
    const trigger = screen.getByRole("combobox", { name: "Framework" })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    await userEvent.type(screen.getByPlaceholderText("Search..."), "rem")
    expect(screen.queryByText("Next.js")).toBeNull()
    await userEvent.click(screen.getByText("Remix"))
    expect(onValueChange).toHaveBeenCalledWith("remix")
    expect(trigger).toHaveTextContent("Remix")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("matches by keywords and shows the empty state", async () => {
    render(<Combobox options={options} aria-label="F" emptyText="Nothing here" />)
    await userEvent.click(screen.getByRole("combobox"))
    const search = screen.getByPlaceholderText("Search...")
    await userEvent.type(search, "islands")
    expect(screen.getByText("Astro")).toBeInTheDocument()
    await userEvent.clear(search)
    await userEvent.type(search, "zzz")
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
  })

  it("supports keyboard selection", async () => {
    render(<Combobox options={options} aria-label="F" />)
    const trigger = screen.getByRole("combobox")
    trigger.focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(trigger).toHaveTextContent(/Remix|Astro|Next\.js/)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("is controlled via value and open", async () => {
    const onValueChange = vi.fn()
    render(<Combobox options={options} value="astro" onValueChange={onValueChange} aria-label="F" />)
    const trigger = screen.getByRole("combobox")
    expect(trigger).toHaveTextContent("Astro")
    await userEvent.click(trigger)
    await userEvent.click(screen.getByText("Remix"))
    expect(onValueChange).toHaveBeenCalledWith("remix")
    expect(trigger).toHaveTextContent("Astro")
  })

  it("supports defaultValue, clearable and hidden form input", async () => {
    const { container } = render(
      <Combobox options={options} defaultValue="next" clearable name="fw" aria-label="F" />
    )
    const hidden = container.querySelector("input[type=hidden]")
    expect(hidden).toHaveAttribute("name", "fw")
    expect(hidden).toHaveValue("next")
    await userEvent.click(screen.getByRole("combobox"))
    await userEvent.click(screen.getAllByText("Next.js").slice(-1)[0])
    expect(screen.getByRole("combobox")).toHaveTextContent("Select an option")
  })

  it("applies variants, sizes, disabled, invalid and className", () => {
    render(
      <>
        <Combobox options={options} variant="glass" size="lg" className="custom" aria-label="G" />
        <Combobox options={options} disabled aria-invalid aria-label="D" />
      </>
    )
    const g = screen.getByRole("combobox", { name: "G" })
    expect(g.className).toContain("backdrop-blur-xl")
    expect(g.className).toContain("h-10")
    expect(g.className).toContain("custom")
    expect(screen.getByRole("combobox", { name: "D" })).toBeDisabled()
    expect(screen.getByRole("combobox", { name: "D" })).toHaveAttribute("aria-invalid", "true")
  })
})
