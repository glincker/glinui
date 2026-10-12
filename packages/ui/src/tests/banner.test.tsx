import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Banner, type BannerStorage } from "../index"
import { BANNER_STORAGE_KEY, dismissBanner, isBannerDismissed, parseDismissed, withDismissed } from "../lib/banner-dismissal"

function memoryStorage(initial: Record<string, string> = {}): BannerStorage & { data: Record<string, string> } {
  const data = { ...initial }
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value
    }
  }
}

describe("Banner", () => {
  it("renders title, children and the info variant as a polite status", () => {
    render(<Banner title="Heads up">Maintenance tonight.</Banner>)
    const banner = screen.getByRole("status")
    expect(banner).toHaveAttribute("data-variant", "info")
    expect(banner).toHaveAttribute("aria-live", "polite")
    expect(screen.getByText("Heads up")).toBeVisible()
    expect(screen.getByText("Maintenance tonight.")).toBeVisible()
  })

  it.each([
    ["success", "status", "polite"],
    ["warning", "status", "polite"],
    ["promo", "status", "polite"],
    ["critical", "alert", "assertive"]
  ] as const)("%s uses role %s and aria-live %s", (variant, role, live) => {
    render(<Banner variant={variant} title="Notice" />)
    const banner = screen.getByRole(role)
    expect(banner).toHaveAttribute("data-variant", variant)
    expect(banner).toHaveAttribute("aria-live", live)
  })

  it("is not dismissible without dismissId or onDismiss", () => {
    render(<Banner title="Static" />)
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("dismisses with the keyboard, persists through the adapter and calls onDismiss", async () => {
    const user = userEvent.setup()
    const storage = memoryStorage()
    const onDismiss = vi.fn()
    render(<Banner title="Promo" dismissId="promo-1" storage={storage} onDismiss={onDismiss} />)

    await user.tab()
    const button = screen.getByRole("button", { name: "Dismiss" })
    expect(button).toHaveFocus()
    await user.keyboard("{Enter}")

    expect(screen.queryByRole("status")).toBeNull()
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(JSON.parse(storage.data[BANNER_STORAGE_KEY])).toEqual(["promo-1"])
  })

  it("stays hidden when the id is already dismissed", () => {
    const storage = memoryStorage({ [BANNER_STORAGE_KEY]: JSON.stringify(["seen"]) })
    render(<Banner title="Seen" dismissId="seen" storage={storage} />)
    expect(screen.queryByRole("status")).toBeNull()
  })

  it("uses localStorage by default", async () => {
    window.localStorage.clear()
    const user = userEvent.setup()
    render(<Banner title="Local" dismissId="local-1" dismissLabel="Close notice" />)
    await user.click(screen.getByRole("button", { name: "Close notice" }))
    expect(window.localStorage.getItem(BANNER_STORAGE_KEY)).toBe(JSON.stringify(["local-1"]))
  })

  it("still dismisses for the view when storage throws", async () => {
    const user = userEvent.setup()
    const broken: BannerStorage = {
      getItem: () => {
        throw new Error("blocked")
      },
      setItem: () => {
        throw new Error("blocked")
      }
    }
    render(<Banner title="Blocked" dismissId="b" storage={broken} />)
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(screen.queryByRole("status")).toBeNull()
  })

  it("renders eyebrow, action and a custom heading level", () => {
    render(
      <Banner title="Upgrade" titleAs="h3" eyebrow="New" action={<a href="/plans">See plans</a>} />
    )
    expect(screen.getByRole("heading", { level: 3, name: "Upgrade" })).toBeVisible()
    expect(screen.getByText("New")).toBeVisible()
    expect(screen.getByRole("link", { name: "See plans" })).toBeVisible()
  })

  it("merges className", () => {
    render(<Banner title="Styled" className="custom" />)
    expect(screen.getByRole("status")).toHaveClass("custom")
  })
})

describe("banner dismissal helpers", () => {
  it("parses defensively", () => {
    expect(parseDismissed(null)).toEqual([])
    expect(parseDismissed("not json")).toEqual([])
    expect(parseDismissed('{"a":1}')).toEqual([])
    expect(parseDismissed('["a",1,"b"]')).toEqual(["a", "b"])
  })

  it("adds ids once", () => {
    expect(withDismissed(["a"], "a")).toEqual(["a"])
    expect(withDismissed(["a"], "b")).toEqual(["a", "b"])
  })

  it("reads and writes through a custom key", () => {
    const storage = memoryStorage()
    dismissBanner("x", storage, "k")
    expect(isBannerDismissed("x", storage, "k")).toBe(true)
    expect(isBannerDismissed("y", storage, "k")).toBe(false)
    expect(isBannerDismissed("x", null)).toBe(false)
  })
})
