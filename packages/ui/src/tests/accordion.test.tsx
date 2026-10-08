import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../index"

describe("Accordion", () => {
  it("opens accordion item on trigger click", async () => {
    const user = userEvent.setup()

    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Section content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    await user.click(screen.getByRole("button", { name: "Section 1" }))
    expect(screen.getByText("Section content")).toBeVisible()
  })

  it("applies glass variant to item", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" variant="glass" data-testid="item">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Section content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByTestId("item").className).toContain("backdrop-blur-xl")
  })
})
