import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../index"

describe("Tabs", () => {
  it("renders tabs and switches content", async () => {
    const user = userEvent.setup()

    render(
      <Tabs defaultValue="one">
        <TabsList aria-label="Tabs list">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel One</TabsContent>
        <TabsContent value="two">Panel Two</TabsContent>
      </Tabs>
    )

    expect(screen.getByText("Panel One")).toBeVisible()
    await user.click(screen.getByRole("tab", { name: "Two" }))
    expect(screen.getByText("Panel Two")).toBeVisible()
  })

  it("applies glass variant classes", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList variant="glass" data-testid="list">
          <TabsTrigger value="one" variant="glass">
            One
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one" variant="glass" data-testid="content">
          Panel
        </TabsContent>
      </Tabs>
    )

    expect(screen.getByTestId("list").className).toContain("backdrop-blur-xl")
    expect(screen.getByTestId("content").className).toContain("backdrop-blur-xl")
  })

  it("supports liquid variant classes", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList variant="liquid" data-testid="list">
          <TabsTrigger value="one" variant="liquid">
            One
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one" variant="liquid" data-testid="content">
          Panel
        </TabsContent>
      </Tabs>
    )

    expect(screen.getByTestId("list").className).toContain("radial-gradient")
    expect(screen.getByTestId("content").className).toContain("radial-gradient")
  })
})
