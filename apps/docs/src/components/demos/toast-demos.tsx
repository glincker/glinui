"use client"

import { Toaster, toast, Button } from "@glinui/ui"

const demoToasterProps = {
  position: "bottom-right" as const,
  closeButton: true,
  visibleToasts: 4
}

export function ToastBasicDemo() {
  return (
    <>
      <Toaster {...demoToasterProps} />
      <div className="flex flex-wrap gap-2">
        <Button
         
          onClick={() =>
            toast("Settings saved", {
              description: "Your workspace has been updated."
            })
          }
        >
          Show toast
        </Button>
      </div>
    </>
  )
}

export function ToastTypesDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Toaster {...demoToasterProps} />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => toast.success("Saved", { description: "Changes applied." })}>Success</Button>
        <Button size="sm" onClick={() => toast.error("Failed", { description: "Something went wrong." })}>Error</Button>
        <Button size="sm" onClick={() => toast.warning("Careful", { description: "This cannot be undone." })}>Warning</Button>
        <Button size="sm" onClick={() => toast.info("Heads up", { description: "A new version is available." })}>Info</Button>
        <Button size="sm" onClick={() => toast.loading("Processing...")}>Loading</Button>
      </div>
    </div>
  )
}

export function ToastActionDemo() {
  return (
    <>
      <Toaster {...demoToasterProps} />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            toast("File deleted", {
              description: "The file has been moved to trash.",
              action: { label: "Undo", onClick: () => toast.success("Restored") }
            })
          }
        >
          Delete file
        </Button>
      </div>
    </>
  )
}

export function ToastPromiseDemo() {
  return (
    <>
      <Toaster {...demoToasterProps} />
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: "Generating report...",
                success: "Report is ready and shared with your team.",
                error: "Failed to generate report"
              }
            )
          }}
         
        >
          Generate report
        </Button>
      </div>
    </>
  )
}
