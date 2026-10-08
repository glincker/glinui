"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { allComponentDocs as componentDocs } from "@/lib/component-docs-all"
import type { PrimitiveComponentId } from "@/lib/primitives"
import { CSS_ANIMATED_IDS, LIVE_ON_HOVER_IDS } from "./gallery-types"
import type { GalleryItem } from "./gallery-types"
import { getPlaybackMeta } from "@/lib/playback-meta"
import { useReplayWhileActive } from "@/components/playback"
import { getSignaturePreview, signatureStills } from "./signature-previews"

function useNearViewport<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === "undefined") {
      setNear(true)
      return
    }
    // Keep observing so previews that scroll far away unmount, which caps live demos.
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1]
        if (last) setNear(last.isIntersecting)
      },
      { rootMargin: "120px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, near]
}

function getDemo(item: GalleryItem): ReactNode | null {
  if (item.kind !== "primitive") return null
  const doc = componentDocs[item.id as PrimitiveComponentId]
  return doc?.examples?.[0]?.render ?? null
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex size-full items-center justify-center bg-[radial-gradient(60%_60%_at_50%_40%,oklch(0.55_0.2_289/0.14),transparent)]">
      <span className="select-none text-3xl font-medium tracking-[-0.02em] text-accent/70">
        {title.slice(0, 2)}
      </span>
    </div>
  )
}

function SignatureFrame({ item, hovered }: { item: GalleryItem; hovered: boolean }) {
  const isLiveOnHover = LIVE_ON_HOVER_IDS.has(item.id)
  const isCssAnimated = CSS_ANIMATED_IDS.has(item.id)
  const node =
    isLiveOnHover && !hovered
      ? (signatureStills[item.id] ?? getSignaturePreview(item.id, item.title))
      : getSignaturePreview(item.id, item.title)
  const paused = isCssAnimated && !hovered
  const replayKey = useReplayWhileActive(hovered && getPlaybackMeta(item.id)?.oneShot === true, 4000)
  return (
    <div
      inert
      className={`pointer-events-none absolute inset-0 motion-reduce:[&_*]:[animation-play-state:paused] ${
        paused ? "[&_*]:[animation-play-state:paused]" : ""
      }`}
    >
      <Fragment key={replayKey}>{node}</Fragment>
    </div>
  )
}

export function GalleryPreview({ item, hovered }: { item: GalleryItem; hovered: boolean }) {
  const [ref, near] = useNearViewport<HTMLDivElement>()
  const isSignature = item.kind === "signature"
  const demo = near && !isSignature ? getDemo(item) : null
  const demoKey = useReplayWhileActive(hovered && !isSignature && getPlaybackMeta(item.id)?.oneShot === true, 4000)

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--surface-1)] [box-shadow:var(--elev-2)] ring-1 ring-[var(--line-soft)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
    >
      {isSignature ? (
        near ? (
          <SignatureFrame item={item} hovered={hovered} />
        ) : (
          <div className="size-full bg-[color-mix(in_oklab,var(--line-soft)_40%,transparent)]" />
        )
      ) : demo ? (
        <div
          inert
          className={`pointer-events-none absolute inset-0 flex origin-center items-center justify-center p-6 transition-transform duration-300 ease-out motion-reduce:transition-none ${
            hovered ? "scale-[0.74]" : "scale-[0.7]"
          }`}
        >
          <div key={demoKey} className="max-h-full w-full max-w-full overflow-hidden">{demo}</div>
        </div>
      ) : near ? (
        <Placeholder title={item.title} />
      ) : (
        <div className="size-full animate-pulse bg-[var(--line-soft)] motion-reduce:animate-none" />
      )}
    </div>
  )
}
