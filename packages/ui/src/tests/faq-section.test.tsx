import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { FaqSection, faqJsonLd, faqJsonLdObject, type FaqItem } from "../components/faq-section"

const items: FaqItem[] = [
  { question: "Is it free?", answer: "Yes, it is free.", category: "Billing" },
  { question: "Does it work offline?", answer: <em>Mostly.</em>, answerText: "Mostly.", category: "Product" },
  { question: "Breaks </script> out?", answer: "No <b>way</b> & done.", category: "Product" }
]

describe("FaqSection", () => {
  it("renders a labelled section with accordion triggers", () => {
    render(<FaqSection items={items} title="Questions" />)
    expect(screen.getByRole("region", { name: "Questions" })).toBeInTheDocument()
    expect(screen.getAllByRole("button")).toHaveLength(3)
  })

  it("opens an item with the keyboard and toggles aria-expanded", async () => {
    const user = userEvent.setup()
    render(<FaqSection items={items} title="Q" />)
    const trigger = screen.getByRole("button", { name: "Is it free?" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    trigger.focus()
    await user.keyboard("{Enter}")
    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  it("supports both layouts", () => {
    const { container, rerender } = render(<FaqSection items={items} title="Q" />)
    expect(container.querySelector("section")).toHaveAttribute("data-layout", "two-column")
    rerender(<FaqSection items={items} title="Q" layout="centered" />)
    expect(container.querySelector("section")).toHaveAttribute("data-layout", "centered")
  })

  it("shows category tabs and filters items", async () => {
    const user = userEvent.setup()
    render(<FaqSection items={items} title="Q" categories />)
    expect(screen.getAllByRole("tab")).toHaveLength(2)
    expect(screen.getAllByRole("button")).toHaveLength(1)
    await user.click(screen.getByRole("tab", { name: "Product" }))
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })

  it("renders FAQPage JSON-LD only when asked, and escapes script breakouts", () => {
    const { container, rerender } = render(<FaqSection items={items} title="Q" />)
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull()
    rerender(<FaqSection items={items} title="Q" jsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')!
    expect(script.innerHTML).not.toContain("</script>")
    expect(JSON.parse(script.innerHTML)["@type"]).toBe("FAQPage")
  })

  it("faqJsonLd helper escapes and round-trips", () => {
    const json = faqJsonLd(items)
    expect(json).not.toMatch(/[<>&]/)
    const parsed = JSON.parse(json) as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> }
    expect(parsed.mainEntity).toHaveLength(3)
    expect(parsed.mainEntity[2]?.name).toBe("Breaks </script> out?")
    expect(parsed.mainEntity[1]?.acceptedAnswer.text).toBe("Mostly.")
  })

  it("skips items without a plain text answer", () => {
    const obj = faqJsonLdObject([{ question: "x", answer: <span>rich</span> }])
    expect(obj.mainEntity).toEqual([])
  })

  it("renders the aside slot", () => {
    render(<FaqSection items={items} title="Q" aside={<p>Contact us</p>} />)
    expect(screen.getByText("Contact us")).toBeInTheDocument()
  })
})
