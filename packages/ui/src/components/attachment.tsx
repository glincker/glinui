"use client"

import * as React from "react"
import {
  File as FileIcon,
  FileAudio,
  FileCode,
  FileImage,
  FilePdf,
  FileText,
  FileVideo,
  FileZip,
  X
} from "@phosphor-icons/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface, resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

const attachmentBase = "group/attachment relative inline-flex max-w-full items-center text-sm"

const attachmentDisplay = cva("", {
  variants: {
    display: {
      chip: "gap-2.5 rounded-xl py-1.5 ps-1.5 pe-2",
      thumbnail: "size-20 overflow-hidden rounded-xl p-0"
    }
  },
  defaultVariants: { display: "chip" }
})

export interface AttachmentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    Pick<VariantProps<typeof attachmentDisplay>, "display"> {
  /** Visual variant. Omit for the ambient design style (glinr by default). Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. */
  variant?: SurfaceVariant | "default" | "raised" | "frosted"
  tone?: SurfaceTone
  name: string
  /** Size in bytes. */
  size?: number
  /** MIME type or extension used to pick the icon. */
  type?: string
  /** 0 to 100. When defined and below 100 a progress bar is shown. */
  progress?: number
  /** Image URL. With `display="thumbnail"` it fills the tile. */
  previewUrl?: string
  display?: "chip" | "thumbnail"
  onRemove?: () => void
  removeLabel?: string
}

const PROGRESS_WIDTH = [
  "w-0",
  "w-[5%]",
  "w-[10%]",
  "w-[15%]",
  "w-[20%]",
  "w-[25%]",
  "w-[30%]",
  "w-[35%]",
  "w-[40%]",
  "w-[45%]",
  "w-[50%]",
  "w-[55%]",
  "w-[60%]",
  "w-[65%]",
  "w-[70%]",
  "w-[75%]",
  "w-[80%]",
  "w-[85%]",
  "w-[90%]",
  "w-[95%]",
  "w-[100%]"
] as const

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return ""
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i += 1
  }
  return `${value >= 10 ? Math.round(value) : Math.round(value * 10) / 10} ${units[i]}`
}

export type AttachmentKind = "image" | "pdf" | "code" | "text" | "archive" | "audio" | "video" | "file"

export function getAttachmentKind(name: string, type = ""): AttachmentKind {
  const t = type.toLowerCase()
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (t.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"].includes(ext)) return "image"
  if (t === "application/pdf" || ext === "pdf") return "pdf"
  if (t.startsWith("audio/") || ["mp3", "wav", "m4a", "ogg"].includes(ext)) return "audio"
  if (t.startsWith("video/") || ["mp4", "mov", "webm"].includes(ext)) return "video"
  if (t.includes("zip") || ["zip", "tar", "gz", "rar", "7z"].includes(ext)) return "archive"
  if (["ts", "tsx", "js", "jsx", "json", "py", "go", "rs", "css", "html", "java", "sh"].includes(ext) || t.includes("json")) return "code"
  if (t.startsWith("text/") || ["txt", "md", "csv", "doc", "docx"].includes(ext)) return "text"
  return "file"
}

const kindIcon = {
  image: FileImage,
  pdf: FilePdf,
  code: FileCode,
  text: FileText,
  archive: FileZip,
  audio: FileAudio,
  video: FileVideo,
  file: FileIcon
} as const

export const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      className,
      variant,
      tone,
      display = "chip",
      name,
      size,
      type,
      progress,
      previewUrl,
      onRemove,
      removeLabel,
      ...props
    },
    ref
  ) => {
    const kind = getAttachmentKind(name, type)
    const Icon = kindIcon[kind]
    const uploading = typeof progress === "number" && progress < 100
    const pct = typeof progress === "number" ? Math.min(100, Math.max(0, Math.round(progress))) : 0
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "container")
    const rootClass = cn(
      attachmentBase,
      containerSurface(resolved, { radius: "lg", elevation: "1", tone: tone ?? aliasTone }),
      attachmentDisplay({ display }),
      className
    )
    const showImage = kind === "image" && Boolean(previewUrl)
    const remove = onRemove ? (
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel ?? `Remove ${name}`}
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors duration-normal hover:bg-[var(--surface-3)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none",
          display === "thumbnail" &&
            "absolute end-1 top-1 bg-black/60 text-white hover:bg-black/80 hover:text-white"
        )}
      >
        <X weight="bold" className="size-3" aria-hidden="true" />
      </button>
    ) : null

    const bar = uploading ? (
      <div
        role="progressbar"
        aria-label={`Uploading ${name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className={cn(
          "h-1 overflow-hidden rounded-full bg-[var(--surface-3)]",
          display === "thumbnail" ? "absolute inset-x-1.5 bottom-1.5" : "mt-1 w-full"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-normal motion-reduce:transition-none",
            PROGRESS_WIDTH[Math.round(pct / 5)]
          )}
        />
      </div>
    ) : null

    if (display === "thumbnail") {
      return (
        <div ref={ref} data-kind={kind} data-variant={resolved} className={rootClass} {...props}>
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={name} className="size-full object-cover" />
          ) : (
            <span className="flex size-full flex-col items-center justify-center gap-1 px-1 text-[var(--color-muted)]">
              <Icon className="size-6" aria-hidden="true" />
              <span className="w-full truncate text-center text-[10px]">{name}</span>
            </span>
          )}
          {bar}
          {remove}
        </div>
      )
    }

    return (
      <div ref={ref} data-kind={kind} data-variant={resolved} className={rootClass} {...props}>
        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--surface-3)] text-[var(--color-accent)]">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="size-full object-cover" />
          ) : (
            <Icon className="size-5" aria-hidden="true" />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium leading-tight">{name}</span>
          <span className="truncate text-xs leading-tight text-[var(--color-muted)]">
            {uploading ? `Uploading ${pct}%` : typeof size === "number" ? formatBytes(size) : kind}
          </span>
          {bar}
        </span>
        {remove}
      </div>
    )
  }
)
Attachment.displayName = "Attachment"
