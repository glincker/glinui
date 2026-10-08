import { fireEvent, render, screen } from "@testing-library/react"
import { vi } from "vitest"

import { Attachment, formatBytes, getAttachmentKind } from "../components/attachment"

describe("Attachment", () => {
  it("formats bytes", () => {
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(2048)).toBe("2 KB")
    expect(formatBytes(5 * 1024 * 1024)).toBe("5 MB")
  })

  it("detects kinds from type and extension", () => {
    expect(getAttachmentKind("a.png")).toBe("image")
    expect(getAttachmentKind("a", "application/pdf")).toBe("pdf")
    expect(getAttachmentKind("x.tsx")).toBe("code")
    expect(getAttachmentKind("x.zip")).toBe("archive")
    expect(getAttachmentKind("x.bin")).toBe("file")
  })

  it("renders name, size and kind", () => {
    render(<Attachment name="report.pdf" size={204800} data-testid="a" />)
    expect(screen.getByText("report.pdf")).toBeInTheDocument()
    expect(screen.getByText("200 KB")).toBeInTheDocument()
    expect(screen.getByTestId("a")).toHaveAttribute("data-kind", "pdf")
  })

  it("shows an accessible progress bar while uploading", () => {
    render(<Attachment name="big.zip" progress={40} />)
    const bar = screen.getByRole("progressbar", { name: "Uploading big.zip" })
    expect(bar).toHaveAttribute("aria-valuenow", "40")
    expect(screen.getByText("Uploading 40%")).toBeInTheDocument()
  })

  it("hides progress when complete", () => {
    render(<Attachment name="big.zip" progress={100} size={1024} />)
    expect(screen.queryByRole("progressbar")).toBeNull()
  })

  it("calls onRemove from a labelled button", () => {
    const onRemove = vi.fn()
    render(<Attachment name="a.txt" onRemove={onRemove} />)
    fireEvent.click(screen.getByRole("button", { name: "Remove a.txt" }))
    expect(onRemove).toHaveBeenCalled()
  })

  it("renders an image thumbnail with alt text", () => {
    render(<Attachment name="cat.png" display="thumbnail" previewUrl="/cat.png" onRemove={() => {}} />)
    expect(screen.getByRole("img", { name: "cat.png" })).toHaveAttribute("src", "/cat.png")
  })

  it("applies the glass variant", () => {
    render(<Attachment name="a.txt" variant="glass" data-testid="a" />)
    expect(screen.getByTestId("a").className).toContain("backdrop-blur")
  })
})
