import * as React from "react"
import { render, screen } from "@testing-library/react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  BentoCard,
  Card,
  CardContent,
  CardHeader,
  DepthCard,
  DepthLayer,
  GlinProvider,
  GlowBorder,
  IconFrame,
  MagicCard,
  NeonGradientCard,
  Separator,
  SpotlightCard
} from "../index"

type Style = "glinr" | "minimal" | "glass"

function inStyle(style: Style, node: React.ReactNode) {
  return render(<GlinProvider defaults={{ style }}>{node}</GlinProvider>)
}

describe("Card variants", () => {
  it("defaults to glinr without a provider", () => {
    render(<Card data-testid="c" />)
    const card = screen.getByTestId("c")
    expect(card).toHaveAttribute("data-variant", "glinr")
    expect(card.className).toContain("padding-box")
    expect(card.className).not.toContain("backdrop-blur")
  })

  it("follows the ambient style: minimal is plain, glass is glass", () => {
    const minimal = inStyle("minimal", <Card data-testid="c" />)
    expect(screen.getByTestId("c")).toHaveAttribute("data-variant", "plain")
    expect(screen.getByTestId("c").className).not.toContain("padding-box")
    minimal.unmount()
    inStyle("glass", <Card data-testid="c" />)
    expect(screen.getByTestId("c")).toHaveAttribute("data-variant", "glass")
    expect(screen.getByTestId("c").className).toContain("backdrop-blur-xl")
  })

  it("explicit variant wins over the ambient style", () => {
    inStyle("glass", <Card variant="solid" data-testid="c" />)
    expect(screen.getByTestId("c")).toHaveAttribute("data-variant", "solid")
    expect(screen.getByTestId("c").className).not.toContain("backdrop-blur")
  })

  it.each(["glinr", "solid", "plain", "soft", "outline", "ghost", "gradient", "glass"] as const)("renders %s", (variant) => {
    render(<Card variant={variant} tone="accent" data-testid="c" />)
    expect(screen.getByTestId("c")).toHaveAttribute("data-variant", variant)
  })

  it("keeps legacy names working", () => {
    render(
      <>
        <Card variant="default" data-testid="d" />
        <Card variant="elevated" data-testid="e" />
        <Card variant="interactive" data-testid="i" />
        <Card variant="frosted" data-testid="f" />
      </>
    )
    expect(screen.getByTestId("d")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("e").className).toContain("--elev-3")
    expect(screen.getByTestId("i").className).toContain("hover:-translate-y-0.5")
    expect(screen.getByTestId("f").className).toContain("backdrop-blur-[40px]")
  })

  it("renders a raised header strip and an inset well", () => {
    render(
      <Card>
        <CardHeader variant="strip" data-testid="h">
          Title
        </CardHeader>
        <CardContent inset data-testid="w">
          Body
        </CardContent>
      </Card>
    )
    expect(screen.getByTestId("h").className).toContain("--sheen")
    expect(screen.getByTestId("h").className).toContain("-mx-6")
    expect(screen.getByTestId("w")).toHaveAttribute("data-inset", "true")
    expect(screen.getByTestId("w").className).toContain("--elev-inset")
  })
})

describe("Effect cards resolve a crisp base surface", () => {
  it("MagicCard and SpotlightCard default to glinr and accept glass", () => {
    render(
      <>
        <MagicCard data-testid="m" />
        <SpotlightCard data-testid="s" />
        <MagicCard variant="glass" data-testid="mg" />
      </>
    )
    expect(screen.getByTestId("m")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("s")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("mg")).toHaveAttribute("data-variant", "glass")
  })

  it("NeonGradientCard and GlowBorder follow the ambient style", () => {
    const view = render(<NeonGradientCard data-testid="n">x</NeonGradientCard>)
    expect(screen.getByTestId("n")).toHaveAttribute("data-variant", "glinr")
    view.unmount()
    inStyle("minimal", <NeonGradientCard data-testid="n">x</NeonGradientCard>)
    expect(screen.getByTestId("n")).toHaveAttribute("data-variant", "plain")
  })

  it("GlowBorder uses the glinr face and explicit variants win", () => {
    const { container } = render(
      <>
        <GlowBorder>a</GlowBorder>
        <GlowBorder variant="glass">b</GlowBorder>
      </>
    )
    const faces = container.querySelectorAll("[data-variant]")
    expect(faces[0]).toHaveAttribute("data-variant", "glinr")
    expect(faces[1]).toHaveAttribute("data-variant", "glass")
  })
})

describe("BentoCard", () => {
  it("defaults to glinr, minimal is plain, glass is opt-in", () => {
    const view = render(<BentoCard name="A" description="d" data-testid="b" />)
    expect(screen.getByTestId("b")).toHaveAttribute("data-variant", "glinr")
    view.unmount()
    const min = inStyle("minimal", <BentoCard name="A" description="d" data-testid="b" />)
    expect(screen.getByTestId("b")).toHaveAttribute("data-variant", "plain")
    min.unmount()
    render(<BentoCard name="A" description="d" variant="glass" data-testid="b" />)
    expect(screen.getByTestId("b").className).toContain("backdrop-blur-xl")
  })
})

describe("Alert", () => {
  it("defaults to glinr with an accent bar", () => {
    render(<Alert data-testid="a">Note</Alert>)
    expect(screen.getByTestId("a")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("a").className).toContain("before:w-1")
  })

  it("minimal style is plain without a bar", () => {
    inStyle("minimal", <Alert data-testid="a">Note</Alert>)
    expect(screen.getByTestId("a")).toHaveAttribute("data-variant", "plain")
    expect(screen.getByTestId("a").className).not.toContain("before:w-1")
  })

  it.each(["neutral", "accent", "success", "warning", "danger", "info"] as const)("renders tone %s with an icon", (tone) => {
    render(
      <Alert tone={tone} data-testid="a">
        <AlertTitle>T</AlertTitle>
        <AlertDescription>D</AlertDescription>
      </Alert>
    )
    const alert = screen.getByTestId("a")
    expect(alert).toHaveAttribute("data-tone", tone)
    expect(alert.querySelector(":scope > svg") !== null).toBe(tone !== "neutral")
  })

  it("maps legacy tone variants and keeps note and flag", () => {
    render(
      <>
        <Alert variant="destructive" data-testid="d" />
        <Alert variant="note" data-testid="n" />
        <Alert variant="flag" data-testid="f" />
      </>
    )
    expect(screen.getByTestId("d")).toHaveAttribute("data-tone", "danger")
    expect(screen.getByTestId("n")).toHaveAttribute("data-variant", "note")
    expect(screen.getByTestId("f").className).toContain("--ring-violet")
  })
})

describe("Accordion", () => {
  function list(variant?: React.ComponentProps<typeof Accordion>["variant"]) {
    return (
      <Accordion type="single" collapsible variant={variant} data-testid="root">
        <AccordionItem value="a" data-testid="item">
          <AccordionTrigger>One</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  it("defaults to the lifted glinr list with hairline dividers", () => {
    render(list())
    expect(screen.getByTestId("root")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("root").className).toContain("padding-box")
    expect(screen.getByTestId("item").className).toContain("--line-soft")
  })

  it("minimal style and explicit plain use shadcn borders", () => {
    const view = inStyle("minimal", list())
    expect(screen.getByTestId("root")).toHaveAttribute("data-variant", "plain")
    view.unmount()
    render(list("plain"))
    expect(screen.getByTestId("item").className).toContain("--color-border")
    expect(screen.getByRole("button", { name: "One" }).className).toContain("hover:underline")
  })

  it("lift stays an alias of glinr", () => {
    render(list("lift"))
    expect(screen.getByTestId("root")).toHaveAttribute("data-variant", "glinr")
  })
})

describe("IconFrame and Separator", () => {
  it("IconFrame defaults to glinr and follows the style", () => {
    const view = render(<IconFrame data-testid="i" />)
    expect(screen.getByTestId("i")).toHaveAttribute("data-variant", "glinr")
    view.unmount()
    inStyle("minimal", <IconFrame data-testid="i" />)
    expect(screen.getByTestId("i")).toHaveAttribute("data-variant", "plain")
  })

  it("Separator resolves the ambient look", () => {
    const view = render(<Separator data-testid="s" />)
    expect(screen.getByTestId("s").className).toContain("--line-soft")
    view.unmount()
    inStyle("minimal", <Separator data-testid="s" />)
    expect(screen.getByTestId("s").className).not.toContain("--line-soft")
  })
})

describe("autoPlay and depth layers", () => {
  it("SpotlightCard marks autoplay only when asked", () => {
    render(
      <>
        <SpotlightCard autoPlay data-testid="on">a</SpotlightCard>
        <SpotlightCard data-testid="off">b</SpotlightCard>
      </>
    )
    expect(screen.getByTestId("on")).toHaveAttribute("data-autoplay", "true")
    expect(screen.getByTestId("off")).not.toHaveAttribute("data-autoplay")
  })

  it("DepthCard renders DepthLayer children at a depth", () => {
    render(
      <DepthCard data-testid="d">
        <DepthLayer depth={4} data-testid="layer">x</DepthLayer>
      </DepthCard>
    )
    expect(screen.getByTestId("layer")).toHaveAttribute("data-depth", "4")
    expect(screen.getByTestId("layer").className).toContain("translateZ(76px)")
    expect(screen.getByTestId("d")).toHaveAttribute("data-variant", "glinr")
  })
})
